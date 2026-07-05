// pages/api/altstore/source.json.ts
import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "@/utils/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  try {
    const { data: apps, error } = await supabase
      .schema("store")
      .from("apps")
      .select("*, versions:app_versions(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const source = {
      name: "BirdRa1n Apps",
      identifier: "com.birdra1n.altstore",
      sourceURL: `${process.env.NEXT_PUBLIC_SITE_URL || "https://birdra1n.vercel.app"}/api/altstore/source.json`,
      apps: (apps || []).map((app: any) => ({
        name: app.name,
        bundleIdentifier: app.bundle_id,
        developerName: app.developer,
        subtitle: app.subtitle,
        localizedDescription: app.description,
        iconURL: app.icon_url,
        screenshotURLs: app.screenshots || [],
        category: app.category,
        versions: (app.versions || [])
          .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
          .map((v: any) => ({
            version: v.version,
            date: new Date(v.published_at).toISOString().split("T")[0],
            downloadURL: v.download_url,
            ...(v.sha256 && { sha256: v.sha256 }),
            ...(v.size_bytes && { size: v.size_bytes }),
            ...(v.changelog && { localizedDescription: v.changelog }),
            minOSVersion: v.min_ios_version || app.min_ios_version,
          })),
        // compatibility
        ...(app.min_ios_version && { minOSVersion: app.min_ios_version }),
      })),
      news: [],
      userInfo: {},
    };

    return res.status(200).json(source);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
