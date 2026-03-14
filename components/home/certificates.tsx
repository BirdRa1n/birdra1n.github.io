// components/home/certificates.tsx
import { motion } from "framer-motion";

import { useCertificates } from "@/contexts/certificates";
import CERTIFICATES from "@/types/certificates";

const CertSkeleton = () => (
  <div
    className="h-[140px] rounded-sm animate-pulse"
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
  />
);

const CertCard = ({ cert, index }: { cert: CERTIFICATES; index: number }) => (
  <motion.a
    animate={{ opacity: 1, scale: 1 }}
    className="group relative flex flex-col p-4 rounded-sm overflow-hidden cursor-pointer"
    href={cert.url}
    initial={{ opacity: 0, scale: 0.97 }}
    rel="noopener noreferrer"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      transition: "border-color 0.25s, box-shadow 0.25s",
      minHeight: 140,
    }}
    target="_blank"
    transition={{ delay: index * 0.05, duration: 0.4 }}
    whileHover={{ y: -3 }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;

      el.style.borderColor = "var(--neon)";
      el.style.boxShadow = "0 8px 32px rgba(0,255,135,0.1)";
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;

      el.style.borderColor = "var(--border)";
      el.style.boxShadow = "none";
    }}
  >
    {/* Scanline effect */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,135,0.015) 3px, rgba(0,255,135,0.015) 4px)",
      }}
    />

    <div className="flex items-start gap-3 mb-auto">
      {/* Logo */}
      <div
        className="w-10 h-10 rounded-sm flex-shrink-0 overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          background: "var(--bg-card-alt)",
        }}
      >
        {cert.organization?.logo ? (
          <img
            alt={cert.organization.name}
            className="w-full h-full object-contain p-1"
            src={cert.organization.logo}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] font-bold"
            style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
          >
            {cert.organization.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Title & org */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold line-clamp-2 leading-snug mb-1 group-hover:text-[var(--neon)] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cert.title}
        </p>
        <p
          className="text-[10px] truncate opacity-40"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {cert.organization.name}
        </p>
      </div>

      <span
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0"
        style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
      >
        ↗
      </span>
    </div>

    {/* Skills */}
    {cert.skills.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {cert.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="tag-chip">
            {skill}
          </span>
        ))}
        {cert.skills.length > 4 && (
          <span
            className="text-[10px] px-2 py-0.5 opacity-40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            +{cert.skills.length - 4}
          </span>
        )}
      </div>
    )}
  </motion.a>
);

const Certificates = () => {
  const { certificates, fetchingCertificates } = useCertificates();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {fetchingCertificates
          ? Array.from({ length: 6 }).map((_, i) => <CertSkeleton key={i} />)
          : certificates.map((cert, index) => (
              <CertCard key={cert.id} cert={cert} index={index} />
            ))}
      </div>

      <div className="flex justify-end">
        <a
          className="flex items-center gap-2 text-xs tracking-widest transition-opacity hover:opacity-100 opacity-50"
          href="https://www.credly.com/users/dario-rios-1998"
          rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
          target="_blank"
        >
          VIEW_ON_CREDLY
          <span>↗</span>
        </a>
      </div>
    </div>
  );
};

export default Certificates;
