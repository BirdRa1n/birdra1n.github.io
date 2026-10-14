// utils/content.ts
// Leitura do conteúdo público já resolvido no idioma pedido.
// Regra: tradução existente > conteúdo original. As listas buscam só
// as colunas que os cards usam (nada de `content` inteiro em listagem).
import type { Locale } from "@/types/database";
import supabase from "@/utils/supabase/client";

export interface TagRef {
  id: string;
  name: string;
  slug: string;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  featured: boolean;
  views_count: number;
  read_time_min: number | null;
  published_at: string | null;
  tags: TagRef[];
  /** idioma em que o texto está sendo exibido */
  locale: Locale;
}

export interface PostDetail extends PostSummary {
  content: string;
  translated: boolean;
  auto_translated: boolean;
  projects: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
  }[];
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  tech_stack: string[];
  featured: boolean;
  views_count: number;
  created_at: string;
  locale: Locale;
}

export interface ProjectDetail extends ProjectSummary {
  content: string | null;
  demo_url: string | null;
  repo_url: string | null;
  translated: boolean;
  auto_translated: boolean;
}

/* ─── Posts ──────────────────────────────────────────────────── */

const POST_LIST_COLUMNS =
  "id,slug,title,excerpt,cover_url,featured,views_count,read_time_min,published_at,locale," +
  "tags:post_tags(tag:tags(id,name,slug))," +
  "post_translations(locale,title,excerpt)";

export async function fetchPosts(
  locale: Locale,
  { limit, signal }: { limit?: number; signal?: AbortSignal } = {},
): Promise<PostSummary[]> {
  let query = supabase
    .schema("blog")
    .from("posts")
    .select(POST_LIST_COLUMNS)
    .eq("status", "published")
    // filtra o embed (não as linhas-pai): traz só a tradução do idioma atual
    .eq("post_translations.locale", locale)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);
  if (signal) query = query.abortSignal(signal);

  const { data, error } = await query;

  if (error) throw error;

  return ((data ?? []) as any[]).map((row) => {
    const tr = row.locale !== locale ? row.post_translations?.[0] : undefined;

    return {
      id: row.id,
      slug: row.slug,
      title: tr?.title ?? row.title,
      excerpt: tr?.excerpt ?? row.excerpt,
      cover_url: row.cover_url,
      featured: row.featured,
      views_count: row.views_count,
      read_time_min: row.read_time_min,
      published_at: row.published_at,
      tags: (row.tags ?? []).map((t: any) => t.tag).filter(Boolean),
      locale: tr ? locale : row.locale,
    };
  });
}

export async function fetchPost(
  slug: string,
  locale: Locale,
  signal?: AbortSignal,
): Promise<PostDetail | null> {
  let query = supabase.schema("blog").rpc("get_post", { p_slug: slug, p_locale: locale });

  if (signal) query = query.abortSignal(signal);

  const { data, error } = await query;

  if (error) throw error;

  return (data as PostDetail | null) ?? null;
}

export function incrementPostViews(slug: string) {
  Promise.resolve(
    supabase.schema("blog").rpc("increment_post_views", { post_slug: slug }),
  ).catch(() => {});
}

/* ─── Projetos ───────────────────────────────────────────────── */

const PROJECT_LIST_COLUMNS =
  "id,slug,title,description,thumbnail_url,tech_stack,featured,views_count,created_at,locale," +
  "project_translations(locale,title,description)";

export async function fetchProjects(
  locale: Locale,
  { limit, signal }: { limit?: number; signal?: AbortSignal } = {},
): Promise<ProjectSummary[]> {
  let query = supabase
    .schema("portfolio")
    .from("projects")
    .select(PROJECT_LIST_COLUMNS)
    .eq("status", "published")
    .eq("project_translations.locale", locale)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);
  if (signal) query = query.abortSignal(signal);

  const { data, error } = await query;

  if (error) throw error;

  return ((data ?? []) as any[]).map((row) => {
    const tr = row.locale !== locale ? row.project_translations?.[0] : undefined;

    return {
      id: row.id,
      slug: row.slug,
      title: tr?.title ?? row.title,
      description: tr?.description ?? row.description,
      thumbnail_url: row.thumbnail_url,
      tech_stack: row.tech_stack ?? [],
      featured: row.featured,
      views_count: row.views_count,
      created_at: row.created_at,
      locale: tr ? locale : row.locale,
    };
  });
}

export async function fetchProject(
  slug: string,
  locale: Locale,
  signal?: AbortSignal,
): Promise<ProjectDetail | null> {
  let query = supabase
    .schema("portfolio")
    .from("projects")
    .select(
      "id,slug,title,description,content,thumbnail_url,demo_url,repo_url,tech_stack,featured,views_count,created_at,locale," +
        "project_translations(locale,title,description,content,auto_translated)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("project_translations.locale", locale);

  if (signal) query = query.abortSignal(signal);

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as any;
  const tr = row.locale !== locale ? row.project_translations?.[0] : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: tr?.title ?? row.title,
    description: tr?.description ?? row.description,
    content: tr?.content || row.content,
    thumbnail_url: row.thumbnail_url,
    demo_url: row.demo_url,
    repo_url: row.repo_url,
    tech_stack: row.tech_stack ?? [],
    featured: row.featured,
    views_count: row.views_count,
    created_at: row.created_at,
    locale: tr ? locale : row.locale,
    translated: Boolean(tr),
    auto_translated: Boolean(tr?.auto_translated),
  };
}

export function incrementProjectViews(slug: string) {
  Promise.resolve(
    supabase.schema("portfolio").rpc("increment_project_views", { project_slug: slug }),
  ).catch(() => {});
}
