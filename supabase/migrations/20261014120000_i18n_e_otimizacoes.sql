-- ════════════════════════════════════════════════════════════════
-- i18n (pt / en / es) + otimizações estruturais
-- ════════════════════════════════════════════════════════════════

-- ─── 1. Limpeza ────────────────────────────────────────────────
-- blog.comments nunca foi usada pelo app (0 linhas, sem UI de envio).
drop table if exists blog.comments;

-- ─── 2. Integridade ────────────────────────────────────────────
-- Um usuário só pode ser administrador uma vez. O índice comum
-- vira UNIQUE (que já cria o índice usado por admin.is_admin()).
drop index if exists admin.idx_administrators_user_id;
alter table admin.administrators
  add constraint administrators_user_id_key unique (user_id);

-- ─── 3. Cache do GitHub ────────────────────────────────────────
-- A Edge Function insere um snapshot novo a cada chamada e nada
-- era removido (99 cópias idênticas, ~8,5 MB). Mantém só o mais
-- recente e garante isso a cada novo insert.
delete from public.github_repos_cache
where id not in (
  select id from public.github_repos_cache order by updated_at desc limit 1
);

create or replace function public.github_repos_cache_keep_latest()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.github_repos_cache where id <> new.id;
  return null;
end;
$$;

revoke all on function public.github_repos_cache_keep_latest() from public, anon, authenticated;

create trigger trg_github_repos_cache_keep_latest
  after insert on public.github_repos_cache
  for each row execute function public.github_repos_cache_keep_latest();

-- ─── 4. Índices alinhados às queries reais ─────────────────────
-- Lista pública de projetos: where status = 'published' order by created_at desc
drop index if exists portfolio.idx_projects_status_featured;
create index if not exists idx_projects_status_created
  on portfolio.projects (status, created_at desc);

-- ─── 5. Idioma original do conteúdo ────────────────────────────
alter table blog.posts
  add column if not exists locale text not null default 'pt'
  constraint posts_locale_check check (locale in ('pt', 'en', 'es'));

alter table portfolio.projects
  add column if not exists locale text not null default 'pt'
  constraint projects_locale_check check (locale in ('pt', 'en', 'es'));

-- ─── 6. Traduções de posts ─────────────────────────────────────
create table if not exists blog.post_translations (
  post_id          uuid not null references blog.posts (id) on delete cascade,
  locale           text not null check (locale in ('pt', 'en', 'es')),
  title            text not null check (char_length(title) between 1 and 300),
  excerpt          text,
  content          text not null default '',
  auto_translated  boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (post_id, locale)
);

create trigger trg_blog_post_translations_updated_at
  before update on blog.post_translations
  for each row execute function public.set_updated_at();

alter table blog.post_translations enable row level security;

create policy public_read_published on blog.post_translations
  for select to anon
  using (exists (
    select 1 from blog.posts p
    where p.id = post_id and p.status = 'published'
  ));

create policy admin_full_access on blog.post_translations
  for all to authenticated
  using ((select admin.is_admin()))
  with check ((select admin.is_admin()));

grant select on blog.post_translations to anon;
grant select, insert, update, delete on blog.post_translations to authenticated;
grant all on blog.post_translations to service_role;

-- ─── 7. Traduções de projetos ──────────────────────────────────
create table if not exists portfolio.project_translations (
  project_id       uuid not null references portfolio.projects (id) on delete cascade,
  locale           text not null check (locale in ('pt', 'en', 'es')),
  title            text not null check (char_length(title) between 1 and 300),
  description      text,
  content          text,
  auto_translated  boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (project_id, locale)
);

create trigger trg_portfolio_project_translations_updated_at
  before update on portfolio.project_translations
  for each row execute function public.set_updated_at();

alter table portfolio.project_translations enable row level security;

create policy public_read_published on portfolio.project_translations
  for select to anon
  using (exists (
    select 1 from portfolio.projects p
    where p.id = project_id and p.status = 'published'
  ));

create policy admin_full_access on portfolio.project_translations
  for all to authenticated
  using ((select admin.is_admin()))
  with check ((select admin.is_admin()));

grant select on portfolio.project_translations to anon;
grant select, insert, update, delete on portfolio.project_translations to authenticated;
grant all on portfolio.project_translations to service_role;

-- ─── 8. Post completo em uma única chamada ─────────────────────
-- Antes: post → menções → projetos (3 requests em série, e o
-- PostgREST não faz join entre schemas). Agora: 1 RPC já resolvida
-- no idioma pedido, com fallback para o original.
create or replace function blog.get_post(p_slug text, p_locale text default 'pt')
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'id',            p.id,
    'slug',          p.slug,
    'locale',        coalesce(t.locale, p.locale),
    'translated',    t.post_id is not null,
    'title',         coalesce(t.title, p.title),
    'excerpt',       coalesce(t.excerpt, p.excerpt),
    'content',       coalesce(nullif(t.content, ''), p.content),
    'cover_url',     p.cover_url,
    'featured',      p.featured,
    'views_count',   p.views_count,
    'read_time_min', p.read_time_min,
    'published_at',  p.published_at,
    'tags', coalesce((
      select jsonb_agg(jsonb_build_object('id', tg.id, 'name', tg.name, 'slug', tg.slug) order by tg.name)
      from blog.post_tags pt
      join blog.tags tg on tg.id = pt.tag_id
      where pt.post_id = p.id
    ), '[]'::jsonb),
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',            pr.id,
        'slug',          pr.slug,
        'thumbnail_url', pr.thumbnail_url,
        'title',         coalesce(prt.title, pr.title),
        'description',   coalesce(prt.description, pr.description)
      ) order by pr.title)
      from blog.post_project_mentions m
      join portfolio.projects pr on pr.id = m.project_id and pr.status = 'published'
      left join portfolio.project_translations prt
        on prt.project_id = pr.id and prt.locale = p_locale
      where m.post_id = p.id
    ), '[]'::jsonb)
  )
  from blog.posts p
  left join blog.post_translations t
    on t.post_id = p.id and t.locale = p_locale and p_locale <> p.locale
  where p.slug = p_slug and p.status = 'published';
$$;

revoke all on function blog.get_post(text, text) from public;
grant execute on function blog.get_post(text, text) to anon, authenticated, service_role;
