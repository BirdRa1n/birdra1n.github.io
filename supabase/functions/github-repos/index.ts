// supabase/functions/github-repos/index.ts
// Repositórios públicos do GitHub com cache no banco (1 snapshot, TTL 1h).
// Dados públicos e somente leitura: roda com verify_jwt = false, pois o
// gateway rejeita a anon key legada (UNAUTHORIZED_LEGACY_JWT).
import { createClient } from "jsr:@supabase/supabase-js@2";

const GITHUB_USER = "birdra1n";
const TTL_MS = 60 * 60 * 1000;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
};

type Repo = Record<string, unknown>;

function slim(r: any): Repo {
  return {
    id: r.id,
    name: r.name,
    html_url: r.html_url,
    homepage: r.homepage,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    topics: r.topics ?? [],
    skills: [...new Set([r.language, ...(r.topics ?? [])].filter(Boolean))],
    pushed_at: r.pushed_at,
  };
}

async function fetchFromGitHub(): Promise<Repo[]> {
  const token = Deno.env.get("GITHUB_TOKEN");
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "birdra1n-portfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const all = (await res.json()) as any[];

  return all
    .filter((r) => !r.fork && !r.archived && !r.private && r.name.toLowerCase() !== GITHUB_USER)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .map(slim);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  const { data: cached } = await db
    .from("github_repos_cache")
    .select("data, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const fresh = cached && Date.now() - Date.parse(cached.updated_at) < TTL_MS;

  if (fresh) return new Response(JSON.stringify(cached.data), { headers });

  try {
    const repos = await fetchFromGitHub();

    // O trigger da tabela remove os snapshots anteriores
    await db.from("github_repos_cache").insert({ data: repos });

    return new Response(JSON.stringify(repos), { headers });
  } catch (err) {
    // GitHub fora do ar/limite: serve o snapshot antigo se existir
    if (cached) return new Response(JSON.stringify(cached.data), { headers });

    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 502, headers });
  }
});
