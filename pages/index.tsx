// pages/index.tsx
// Ordem pensada para quem avalia: identidade → sobre → experiência →
// projetos → habilidades → formação → artigos → contato.
import NextLink from "next/link";

import About from "@/components/home/about";
import Contact from "@/components/home/contact";
import Experience from "@/components/home/experience";
import Hero from "@/components/home/hero";
import Skills from "@/components/home/skills";
import Writing from "@/components/home/writing";
import { Reveal } from "@/components/motion";
import { ProjectCard } from "@/components/project-card";
import { CertificatesProvider, useCertificates } from "@/contexts/certificates";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchExperiences, fetchPosts, fetchProjects } from "@/utils/content";

function Home() {
  const { t } = useI18n();
  const { certificates } = useCertificates();

  const experiences = useLocalizedData((locale, signal) => fetchExperiences(locale, signal));
  const projects = useLocalizedData((locale, signal) => fetchProjects(locale, { limit: 4, signal }));
  const posts = useLocalizedData((locale, signal) => fetchPosts(locale, { limit: 3, signal }));

  const jobs = (experiences.data ?? []).filter((e) => e.kind === "work");
  const companies = new Set(jobs.map((j) => j.organization)).size;

  return (
    <DefaultLayout>
      <Hero />

      <About certs={certificates.length} companies={companies} projects={projects.data?.length ?? 0} />

      <Experience items={experiences.data ?? []} loading={experiences.loading} />

      <section className="section-y scroll-mt-14" id="projects">
        <div className="container-x">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.home.workEyebrow}</p>
              <h2 className="display-lg mt-3">{t.home.workTitle}</h2>
              <p className="lead mt-5">{t.home.workLead}</p>
            </div>
            <NextLink className="link-arrow shrink-0" href="/projects">
              {t.common.viewAll} <span className="arrow">→</span>
            </NextLink>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {projects.loading && !projects.data
              ? Array.from({ length: 4 }).map((_, i) => <li key={i} className="ui-skeleton h-[460px] !rounded-[28px]" />)
              : (projects.data ?? []).map((p, i) => <ProjectCard key={p.id} index={i} project={p} />)}
          </ul>
        </div>
      </section>

      <Skills />

      <Writing loading={posts.loading} posts={posts.data ?? []} />

      <Contact />
    </DefaultLayout>
  );
}

export default function IndexPage() {
  return (
    <CertificatesProvider>
      <Home />
    </CertificatesProvider>
  );
}
