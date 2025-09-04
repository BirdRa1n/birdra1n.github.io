import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import CERTIFICATES from "@/types/certificates";
import supabase from "@/utils/supabase/client";

interface CertificatesContextType {
  certificates: CERTIFICATES[];
  addCertificate: (certificate: CERTIFICATES) => void;
  removeCertificate: (id: string) => void;
  fetchingCertificates: boolean;
}

const CertificatesContext = createContext<CertificatesContextType | undefined>(
  undefined,
);

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<CERTIFICATES[]>([]);
  const [fetchingCertificates, setFetchingCertificates] = useState(true);

  const addCertificate = (certificate: CERTIFICATES) => {
    setCertificates([...certificates, certificate]);
  };

  const removeCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  const handlerGetCertificates = useCallback(async () => {
    try {
      setFetchingCertificates(true);
      const { data, error } = await supabase
        .from("certificates")
        .select("*,organization(*)")
        .order("emission", { ascending: false });

      if (error) {
        throw error;
      }
      setCertificates(data);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setFetchingCertificates(false);
    }
  }, []);

  useEffect(() => {
    handlerGetCertificates();
  }, []);

  return (
    <CertificatesContext.Provider
      value={{
        certificates,
        addCertificate,
        removeCertificate,
        fetchingCertificates,
      }}
    >
      {children}
    </CertificatesContext.Provider>
  );
}

export function useCertificates() {
  const context = useContext(CertificatesContext);

  if (context === undefined) {
    throw new Error(
      "useCertificates must be used within a CertificatesProvider",
    );
  }

  return context;
}
