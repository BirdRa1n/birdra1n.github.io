-- ════════════════════════════════════════════════════════════════
-- Experiência profissional e formação (linha do tempo do portfólio)
-- ════════════════════════════════════════════════════════════════

create table if not exists portfolio.experiences (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'work' check (kind in ('work', 'education')),
  organization text not null check (char_length(organization) between 1 and 200),
  role         text not null check (char_length(role) between 1 and 200),
  location     text,
  start_date   date not null,
  end_date     date,                       -- null = atual
  highlights   text[] not null default '{}',
  tech         text[] not null default '{}',
  url          text,
  sort_order   integer not null default 0,
  locale       text not null default 'pt' check (locale in ('pt', 'en', 'es')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint experiences_period_check check (end_date is null or end_date >= start_date)
);

create index if not exists idx_experiences_kind_start
  on portfolio.experiences (kind, start_date desc);

create trigger trg_portfolio_experiences_updated_at
  before update on portfolio.experiences
  for each row execute function public.set_updated_at();

alter table portfolio.experiences enable row level security;

create policy public_read on portfolio.experiences
  for select to anon using (true);

create policy admin_full_access on portfolio.experiences
  for all to authenticated
  using ((select admin.is_admin()))
  with check ((select admin.is_admin()));

grant select on portfolio.experiences to anon;
grant select, insert, update, delete on portfolio.experiences to authenticated;
grant all on portfolio.experiences to service_role;

create table if not exists portfolio.experience_translations (
  experience_id   uuid not null references portfolio.experiences (id) on delete cascade,
  locale          text not null check (locale in ('pt', 'en', 'es')),
  role            text not null check (char_length(role) between 1 and 200),
  location        text,
  highlights      text[] not null default '{}',
  auto_translated boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (experience_id, locale)
);

create trigger trg_portfolio_experience_translations_updated_at
  before update on portfolio.experience_translations
  for each row execute function public.set_updated_at();

alter table portfolio.experience_translations enable row level security;

create policy public_read on portfolio.experience_translations
  for select to anon using (true);

create policy admin_full_access on portfolio.experience_translations
  for all to authenticated
  using ((select admin.is_admin()))
  with check ((select admin.is_admin()));

grant select on portfolio.experience_translations to anon;
grant select, insert, update, delete on portfolio.experience_translations to authenticated;
grant all on portfolio.experience_translations to service_role;
