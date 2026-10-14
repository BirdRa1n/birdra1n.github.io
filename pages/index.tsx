// pages/index.tsx
import NextLink from "next/link";
import { FiDownload } from "react-icons/fi";

import Certificates from "@/components/home/certificates";
import Hero from "@/components/home/hero";
import Repositories from "@/components/home/repos";
import Stack from "@/components/home/stack";
import Work from "@/components/home/work";
import Writing from "@/components/home/writing";
import { CountUp, Reveal, ScrollHighlight } from "@/components/motion";
import { CertificatesProvider, useCertificates } from "@/contexts/certificates";
import { ReposProvider, useReposContext } from "@/contexts/repos";
import { resumeDownloadUrl, useResume } from "@/hooks/useResume";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchPosts, fetchProjects } from "@/utils/content";

const CAREER_START_YEAR = 2022;

function Stats({ projectCount }: { projectCount: number }) {
  const { t, formatNumber } = useI18n();
  const { repos } = useReposContext();
  const { certificates } = useCertificates();
  const years = Math.max(1, new Date().getFullYear() - CAREER_START_YEAR);

  const items = [
    { value: years, suffix: "+", label: t.home.stats.years },
    { value: repos.length, suffix: "", label: t.home.stats.repos },
    { value: projectCount, suffix: "", label: t.home.stats.projects },
    { value: certificates.length, suffix: "", label: t.home.stats.certs },
  ];

  return (
    <section aria-label={t.home.statsTitle} className="container-x pb-[clamp(64px,10vw,140px)]">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-[28px] overflow-hidden border hairline bg-[var(--line)]">
        {items.map((item, i) => (
          <Reveal key={item.label} className="bg-[var(--bg)] p-7 sm:p-10" delay={i * 0.06}>
            <dd className="display-lg text-gradient leading-none">
              <CountUp format={formatNumber} suffix={item.suffix} value={item.value} />
            </dd>
            <dt className="mt-3 text-[15px] text-muted">{item.label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

function ClosingCta() {
  const { t } = useI18n();
  const { resume } = useResume();

  return (
    <section className="relative overflow-hidden section-y">
      <div aria-hidden className="aurora opacity-70" />
      <div className="container-x relative text-center flex flex-col items-center">
        <Reveal>
          <p className="eyebrow">{t.home.ctaEyebrow}</p>
          <h2 className="display-lg mt-4 max-w-[18ch] mx-auto">{t.home.ctaTitle}</h2>
          <p className="lead mt-6 max-w-[40ch] mx-auto">{t.home.ctaLead}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <NextLink className="btn btn-accent" href="/contact">
              {t.home.ctaContact}
            </NextLink>
            {resume && (
              <a className="btn btn-ghost" href={resumeDownloadUrl(resume)} rel="noopener noreferrer" target="_blank">
                <FiDownload size={16} /> {t.common.downloadCv}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  const { t } = useI18n();
  const { repos } = useReposContext();

  const projects = useLocalizedData((locale, signal) => fetchProjects(locale, { limit: 6, signal }));
  const posts = useLocalizedData((locale, signal) => fetchPosts(locale, { limit: 3, signal }));

  return (
    <DefaultLayout>
      <Hero repoCount={repos.length} />

      <section className="container-x section-y">
        <ScrollHighlight className="display-md max-w-[24ch] mx-auto" text={t.home.manifesto} />
      </section>

      <Stats projectCount={projects.data?.length ?? 0} />

      <Stack />

      <Work loading={projects.loading} projects={projects.data ?? []} />

      <Writing loading={posts.loading} posts={posts.data ?? []} />

      <Certificates />

      <Repositories />

      <ClosingCta />
    </DefaultLayout>
  );
}

export default function IndexPage() {
  return (
    <CertificatesProvider>
      <ReposProvider>
        <Home />
      </ReposProvider>
    </CertificatesProvider>
  );
}
