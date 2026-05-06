// components/home/certificates.tsx
import { motion } from "framer-motion";

import { useCertificates } from "@/contexts/certificates";
import CERTIFICATES from "@/types/certificates";

const CertSkeleton = () => (
  <div
    className="rounded-xl animate-pulse p-4"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      minHeight: 130,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    }}
  >
    <div className="flex gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: "var(--bg-card-alt)" }} />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <div className="h-3 rounded w-3/4" style={{ background: "var(--bg-card-alt)" }} />
        <div className="h-2.5 rounded w-1/2" style={{ background: "var(--bg-card-alt)" }} />
      </div>
    </div>
    <div className="flex gap-1.5">
      {[40, 56, 44].map((w) => (
        <div key={w} className="h-4 rounded-full" style={{ width: w, background: "var(--bg-card-alt)" }} />
      ))}
    </div>
  </div>
);

const CertCard = ({ cert, index }: { cert: CERTIFICATES; index: number }) => (
  <motion.a
    animate={{ opacity: 1, y: 0 }}
    className="group relative rounded-xl block cursor-pointer p-4"
    href={cert.url}
    initial={{ opacity: 0, y: 20 }}
    rel="noopener noreferrer"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      minHeight: 130,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    }}
    target="_blank"
    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4 }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = "var(--neon-dim)";
      el.style.boxShadow =
        "0 0 0 1px var(--neon-glow), 0 16px 48px var(--neon-glow), 0 4px 20px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = "var(--border)";
      el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
    }}
  >
    {/* Accent line */}
    <div
      className="absolute top-0 inset-x-0 h-0.5 rounded-t-xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
      style={{ background: "linear-gradient(90deg, var(--neon), var(--cyan))" }}
    />

    <div className="flex items-start gap-3 mb-3">
      {/* Logo */}
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden"
        style={{ border: "1px solid var(--border)", background: "var(--bg-card-alt)" }}
      >
        {cert.organization?.logo ? (
          <img
            alt={cert.organization.name}
            className="w-full h-full object-contain p-0.5"
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

      {/* Title + org */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold line-clamp-2 leading-snug mb-1 transition-colors duration-200 group-hover:text-[var(--neon)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {cert.title}
        </p>
        <p
          className="text-[10px] truncate"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {cert.organization.name}
        </p>
      </div>

      <span
        className="text-sm flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
        style={{ color: "var(--neon)" }}
      >
        ↗
      </span>
    </div>

    {cert.skills.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {cert.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="tag-chip">{skill}</span>
        ))}
        {cert.skills.length > 4 && (
          <span
            className="text-[10px] px-1.5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {fetchingCertificates
          ? Array.from({ length: 6 }).map((_, i) => <CertSkeleton key={i} />)
          : certificates.map((cert, index) => (
              <CertCard key={cert.id} cert={cert} index={index} />
            ))}
      </div>

      <div className="flex justify-end">
        <a
          className="group flex items-center gap-2 text-xs font-medium transition-colors duration-200"
          href="https://www.credly.com/users/dario-rios-1998"
          rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          target="_blank"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--neon)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
        >
          open credly.com/birdra1n
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </a>
      </div>
    </div>
  );
};

export default Certificates;
