// components/home/contact.tsx
import NextLink from "next/link";
import { useState } from "react";
import { FiCheck, FiCopy, FiDownload, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

import { Reveal } from "@/components/motion";
import { profile } from "@/config/profile";
import { resumeDownloadUrl, useResume } from "@/hooks/useResume";
import { useI18n } from "@/i18n";

export default function Contact() {
  const { t } = useI18n();
  const { resume } = useResume();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem permissão de clipboard */
    }
  };

  return (
    <section className="relative overflow-hidden section-y scroll-mt-14" id="contact">
      <div aria-hidden className="aurora opacity-70" />
      <div className="container-x relative">
        <Reveal className="max-w-[760px]">
          <p className="eyebrow">{t.home.contactEyebrow}</p>
          <h2 className="display-lg mt-3">{t.home.contactTitle}</h2>
          <p className="lead mt-6">{t.home.contactLead}</p>
        </Reveal>

        <Reveal className="mt-10" delay={0.08}>
          <div className="flex flex-wrap items-center gap-3">
            <a className="btn btn-accent" href={`mailto:${profile.email}`}>
              <FiMail size={16} /> {profile.email}
            </a>
            <button aria-label={t.home.copyEmail} className="btn btn-ghost" type="button" onClick={copy}>
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              {copied ? t.home.copied : t.home.copyEmail}
            </button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
            <li>
              <a className="flex items-center gap-2 text-muted hover:text-[var(--fg)] transition-colors" href={profile.linkedin} rel="noopener noreferrer" target="_blank">
                <FiLinkedin size={17} /> LinkedIn
              </a>
            </li>
            <li>
              <a className="flex items-center gap-2 text-muted hover:text-[var(--fg)] transition-colors" href={profile.github} rel="noopener noreferrer" target="_blank">
                <FiGithub size={17} /> GitHub
              </a>
            </li>
            {resume && (
              <li>
                <a className="flex items-center gap-2 text-muted hover:text-[var(--fg)] transition-colors" href={resumeDownloadUrl(resume)} rel="noopener noreferrer" target="_blank">
                  <FiDownload size={17} /> {t.common.downloadCv}
                </a>
              </li>
            )}
            <li>
              <NextLink className="link-arrow" href="/contact">
                {t.nav.contact} <span className="arrow">→</span>
              </NextLink>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
