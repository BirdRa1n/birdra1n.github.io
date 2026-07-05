// hooks/useResume.ts
import { useCallback, useEffect, useRef, useState } from "react";

import supabase from "@/utils/supabase/client";

export const RESUME_SETTING_KEY = "resume_url";
export const RESUME_DOWNLOAD_NAME = "Dario-Jr-CV.pdf";

export interface Resume {
  url: string;
  updatedAt: string;
}

/** Monta a URL que força o download (Content-Disposition: attachment)
 *  e inclui um param de versão para furar cache do CDN após re-upload. */
export function resumeDownloadUrl(resume: Resume): string {
  const v = encodeURIComponent(resume.updatedAt);

  return `${resume.url}?download=${encodeURIComponent(RESUME_DOWNLOAD_NAME)}&v=${v}`;
}

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .schema("portfolio")
      .from("site_settings")
      .select("value, updated_at")
      .eq("key", RESUME_SETTING_KEY)
      .maybeSingle();

    setResume(data?.value ? { url: data.value, updatedAt: data.updated_at } : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch();
  }, [fetch]);

  return { resume, loading, refetch: fetch };
}
