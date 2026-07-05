// types/database.ts
// Tipos do banco Supabase (schemas: admin, blog, portfolio, store, public).
// Mantido manualmente a partir do schema real — atualizar junto com migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDef<Row, Rels extends Relationship[] = []> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: Rels;
};

type NoViews = { [_ in never]: never };
type NoFunctions = { [_ in never]: never };
type NoEnums = { [_ in never]: never };
type NoComposite = { [_ in never]: never };

/* ── Rows ─────────────────────────────────────────────────── */

export interface AdministratorRow {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  status: string;
  featured: boolean;
  views_count: number;
  read_time_min: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  slug: string;
}

export interface PostTagRow {
  post_id: string;
  tag_id: string;
}

export interface PostProjectMentionRow {
  post_id: string;
  project_id: string;
}

export interface CommentRow {
  id: string;
  post_id: string;
  author: string;
  email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string | null;
}

export interface CertificateRow {
  id: string;
  organization_id: string | null;
  title: string;
  emission: string;
  url: string | null;
  skills: string[];
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface OrganizationRow {
  id: string;
  name: string;
  logo: string | null;
  email: string | null;
  phone: string | null;
  site: string | null;
  created_at: string;
}

export interface SiteSettingRow {
  key: string;
  value: string | null;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  tech_stack: string[];
  featured: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface AppRow {
  id: string;
  name: string;
  bundle_id: string;
  developer: string;
  subtitle: string | null;
  description: string;
  icon_url: string | null;
  screenshots: string[];
  category: string;
  min_ios_version: string;
  is_beta: boolean;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AppVersionRow {
  id: string;
  app_id: string;
  version: string;
  build_number: number;
  download_url: string;
  sha256: string | null;
  size_bytes: number | null;
  changelog: string | null;
  min_ios_version: string | null;
  published_at: string;
  created_at: string;
}

export interface GithubRepoCacheRow {
  id: string;
  data: Json;
  updated_at: string;
}

/* ── Database ─────────────────────────────────────────────── */

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  admin: {
    Tables: {
      administrators: TableDef<AdministratorRow>;
    };
    Views: NoViews;
    Functions: {
      is_admin: { Args: { uid?: string }; Returns: boolean };
      get_role: { Args: { uid?: string }; Returns: string | null };
    };
    Enums: NoEnums;
    CompositeTypes: NoComposite;
  };
  blog: {
    Tables: {
      posts: TableDef<PostRow>;
      tags: TableDef<TagRow>;
      post_tags: TableDef<
        PostTagRow,
        [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ]
      >;
      post_project_mentions: TableDef<
        PostProjectMentionRow,
        [
          {
            foreignKeyName: "post_project_mentions_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ]
      >;
      comments: TableDef<
        CommentRow,
        [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ]
      >;
    };
    Views: NoViews;
    Functions: {
      increment_post_views: { Args: { post_slug: string }; Returns: undefined };
    };
    Enums: NoEnums;
    CompositeTypes: NoComposite;
  };
  portfolio: {
    Tables: {
      categories: TableDef<CategoryRow>;
      certificates: TableDef<
        CertificateRow,
        [
          {
            foreignKeyName: "certificates_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ]
      >;
      contact_messages: TableDef<ContactMessageRow>;
      organizations: TableDef<OrganizationRow>;
      site_settings: TableDef<SiteSettingRow>;
      projects: TableDef<
        ProjectRow,
        [
          {
            foreignKeyName: "projects_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ]
      >;
    };
    Views: NoViews;
    Functions: {
      increment_project_views: { Args: { project_slug: string }; Returns: undefined };
    };
    Enums: NoEnums;
    CompositeTypes: NoComposite;
  };
  store: {
    Tables: {
      apps: TableDef<AppRow>;
      app_versions: TableDef<
        AppVersionRow,
        [
          {
            foreignKeyName: "app_versions_app_id_fkey";
            columns: ["app_id"];
            isOneToOne: false;
            referencedRelation: "apps";
            referencedColumns: ["id"];
          },
        ]
      >;
    };
    Views: {
      altstore_source: { Row: { source: Json | null }; Relationships: [] };
    };
    Functions: NoFunctions;
    Enums: NoEnums;
    CompositeTypes: NoComposite;
  };
  public: {
    Tables: {
      github_repos_cache: TableDef<GithubRepoCacheRow>;
    };
    Views: NoViews;
    Functions: NoFunctions;
    Enums: NoEnums;
    CompositeTypes: NoComposite;
  };
};

/* ── Aliases de domínio (compatibilidade com o app) ───────── */

export type Administrator = AdministratorRow;
export type BlogPost = PostRow & {
  post_project_mentions?: { project_id: string }[];
};
export type BlogTag = TagRow;
export type Project = ProjectRow;
export type Category = CategoryRow;
export type Certificate = CertificateRow & { organization?: OrganizationRow | null };
export type Organization = OrganizationRow;
export type ContactMessage = ContactMessageRow;
export type StoreApp = AppRow;
export type AppVersion = AppVersionRow;
