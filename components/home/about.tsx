// components/home/about.tsx
import { CountUp, Reveal } from "@/components/motion";
import { profile, yearsOfExperience } from "@/config/profile";
import { useI18n } from "@/i18n";

export default function About({
  companies,
  projects,
  certs,
}: {
  companies: number;
  projects: number;
  certs: number;
}) {
  const { t, formatNumber } = useI18n();

  const facts = [
    { label: t.home.facts.name, value: profile.fullName },
    { label: t.home.facts.location, value: `${profile.location} · ${t.home.remote}` },
    { label: t.home.facts.focus, value: t.home.facts.focusValue },
    { label: t.home.facts.languages, value: t.home.facts.languagesValue },
  ];

  const stats = [
    { value: yearsOfExperience(), suffix: "+", label: t.home.stats.years },
    { value: companies, suffix: "", label: t.home.stats.companies },
    { value: projects, suffix: "", label: t.home.stats.projects },
    { value: certs, suffix: "", label: t.home.stats.certs },
  ];

  return (
    <section className="section-y scroll-mt-14" id="about">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t.home.aboutEyebrow}</p>
          <h2 className="display-lg mt-3 max-w-[12ch]">{t.home.aboutTitle}</h2>
        </Reveal>

        <div>
          <Reveal className="space-y-5 text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.7] text-muted" delay={0.05}>
            {t.home.aboutBody.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-5 border-t hairline pt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[13px] text-faint">{f.label}</dt>
                  <dd className="mt-1 text-[16px] font-medium tracking-[-0.01em]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <div className="container-x mt-16 md:mt-20">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-[28px] overflow-hidden border hairline bg-[var(--line)]">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-[var(--bg)] p-7 sm:p-9">
              <Reveal className="flex flex-col" delay={i * 0.06}>
                <dt className="order-2 mt-3 text-[15px] text-muted">{s.label}</dt>
                <dd className="order-1 display-lg leading-none">
                  <CountUp format={formatNumber} value={s.value} />
                  <span className="text-[var(--accent-fill)]">{s.suffix}</span>
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
