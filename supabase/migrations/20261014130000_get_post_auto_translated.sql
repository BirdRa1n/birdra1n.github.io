-- blog.get_post passa a informar se a tradução exibida foi automática.
create or replace function blog.get_post(p_slug text, p_locale text default 'pt')
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'id',              p.id,
    'slug',            p.slug,
    'locale',          coalesce(t.locale, p.locale),
    'translated',      t.post_id is not null,
    'auto_translated', coalesce(t.auto_translated, false),
    'title',           coalesce(t.title, p.title),
    'excerpt',         coalesce(t.excerpt, p.excerpt),
    'content',         coalesce(nullif(t.content, ''), p.content),
    'cover_url',       p.cover_url,
    'featured',        p.featured,
    'views_count',     p.views_count,
    'read_time_min',   p.read_time_min,
    'published_at',    p.published_at,
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
        on prt.project_id = pr.id and prt.locale = p_locale and p_locale <> pr.locale
      where m.post_id = p.id
    ), '[]'::jsonb)
  )
  from blog.posts p
  left join blog.post_translations t
    on t.post_id = p.id and t.locale = p_locale and p_locale <> p.locale
  where p.slug = p_slug and p.status = 'published';
$$;
