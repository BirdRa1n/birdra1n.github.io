// components/home/certificates.tsx
import { motion } from "framer-motion";

import { EASE_OUT, Reveal } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { useCertificates } from "@/contexts/certificates";
import { useI18n } from "@/i18n";
import { safeUrl } from "@/utils/safe-url";

export default function Certificates() {
  const { t, formatDate } = useI18n();
  const { certificates, fetchingCertificates } = useCertificates();

  if (!fetchingCertificates && certificates.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.home.certsEyebrow}</p>
            <h2 className="display-lg mt-3">{t.home.certsTitle}</h2>
          </div>
          <a className="link-arrow" href={siteConfig.links.credly} rel="noopener noreferrer" target="_blank">
            Credly <span className="arrow">↗</span>
          </a>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fetchingCertificates
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="ui-skeleton h-[180px] !rounded-[28px]" />
              ))
            : certificates.map((cert, i) => (
                <motion.li
                  key={cert.id}
                  initial={{ opacity: 0, y: 32 }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE_OUT }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <a
                    className="surface surface-hover group flex flex-col h-full p-6"
                    href={safeUrl(cert.url)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-[var(--bg-subtle)] grid place-items-center shrink-0">
                        {cert.organization?.logo ? (
                          <img alt="" className="w-full h-full object-contain p-1" loading="lazy" src={cert.organization.logo} />
                        ) : (
                          <span className="text-xs font-semibold text-muted">
                            {(cert.organization?.name ?? cert.title).slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] text-muted truncate">{cert.organization?.name}</p>
                        <p className="text-[12px] text-faint">{formatDate(cert.emission, { month: "short", year: "numeric" })}</p>
                      </div>
                      <span aria-hidden className="ml-auto text-faint group-hover:text-[var(--accent)] transition-colors">
                        ↗
                      </span>
                    </div>
                    <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em] leading-snug">{cert.title}</h3>
                    {cert.skills.length > 0 && (
                      <p className="mt-auto pt-5 text-[13px] text-faint line-clamp-1">{cert.skills.join(" · ")}</p>
                    )}
                  </a>
                </motion.li>
              ))}
        </ul>
      </div>
    </section>
  );
}
