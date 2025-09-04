// pages/api/github-repos.ts
import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "@/utils/supabase/client";

type Repo = any; // ou crie um tipo específico
type Data = {
  repos: Repo[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const { data, error } = await supabase.functions.invoke("github-repos");

    if (error) {
      throw error;
    }

    res.status(200).json({ repos: data });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ repos: [], error: err.message });
  }
}
