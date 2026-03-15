export interface Administrator {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
}

export interface StoreApp {
  id: string;
  name: string;
  bundle_id: string;
  developer?: string;
  subtitle?: string;
  description?: string;
  icon_url?: string;
  category?: string;
  status?: string;
  is_beta?: boolean;
  featured?: boolean;
  min_ios_version?: string;
  updated_at?: string;
  created_at?: string;
}

export interface AppVersion {
  id: string;
  app_id: string;
  version: string;
  build_number: number;
  download_url: string;
  sha256?: string;
  size_bytes?: number;
  changelog?: string;
  min_ios_version?: string;
  published_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  cover_url?: string;
  status?: string;
  featured?: boolean;
  views_count?: number;
  read_time_min?: number;
  published_at?: string;
  created_at?: string;
  post_project_mentions?: { project_id: string }[];
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  thumbnail_url?: string;
  demo_url?: string;
  repo_url?: string;
  tech_stack?: string[];
  category_id?: string;
  status?: string;
  featured?: boolean;
  views_count: number;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization_id: string;
  organization?: Organization;
  emission?: string;
  url?: string;
  skills?: string[];
  created_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: string;
  created_at?: string;
}
