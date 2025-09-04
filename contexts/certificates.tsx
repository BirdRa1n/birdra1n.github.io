import CERTIFICATES from '@/types/certificates';
import supabase from '@/utils/supabase/client';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface CertificatesContextType {
    certificates: CERTIFICATES[];
    addCertificate: (certificate: CERTIFICATES) => void;
    removeCertificate: (id: string) => void;
}

const CertificatesContext = createContext<CertificatesContextType | undefined>(undefined);

export function CertificatesProvider({ children }: { children: ReactNode }) {
    const [certificates, setCertificates] = useState<CERTIFICATES[]>([]);

    const addCertificate = (certificate: CERTIFICATES) => {
        setCertificates([...certificates, certificate]);
    };

    const removeCertificate = (id: string) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const handlerGetCertificates = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('certificates').select('*,organization(*)').order('emission', { ascending: false });
            if (error) {
                throw error;
            }
            setCertificates(data);
        } catch (error) {
            console.log(error);
            throw error;
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
                removeCertificate
            }}
        >
            {children}
        </CertificatesContext.Provider>
    );
}

export function useCertificates() {
    const context = useContext(CertificatesContext);
    if (context === undefined) {
        throw new Error('useCertificates must be used within a CertificatesProvider');
    }
    return context;
}
