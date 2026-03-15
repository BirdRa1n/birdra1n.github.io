// contexts/certificates.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from "react";

import type CERTIFICATES from "@/types/certificates";
import supabase from "@/utils/supabase/client";

interface CertificatesContextType {
  certificates: CERTIFICATES[];
  fetchingCertificates: boolean;
}

const CertificatesContext = createContext<CertificatesContextType | undefined>(undefined);

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<CERTIFICATES[]>([]);
  const [fetchingCertificates, setFetchingCertificates] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    const controller = new AbortController();

    Promise.resolve(
      supabase
        .from("certificates")
        .select("*,organization(*)")
        .order("emission", { ascending: false })
        .abortSignal(controller.signal)
    )
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[Certificates] fetch error:", error.message);
          return;
        }
        setCertificates((data ?? []) as CERTIFICATES[]);
      })
      .catch((err) => {
        if (!cancelled) console.error("[Certificates] exception:", err);
      })
      .finally(() => {
        if (!cancelled) setFetchingCertificates(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const value = useMemo(
    () => ({ certificates, fetchingCertificates }),
    [certificates, fetchingCertificates]
  );

  return (
    <CertificatesContext.Provider value={value}>
      {children}
    </CertificatesContext.Provider>
  );
}

export function useCertificates() {
  const context = useContext(CertificatesContext);
  if (!context) throw new Error("useCertificates must be used within CertificatesProvider");
  return context;
}
