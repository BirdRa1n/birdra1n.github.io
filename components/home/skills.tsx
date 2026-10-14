// components/home/skills.tsx
import { motion } from "framer-motion";

import { EASE_OUT, Reveal } from "@/components/motion";
import { skillGroups } from "@/config/profile";
import { useI18n } from "@/i18n";

export default function Skills() {
  const { t } = useI18n();

  return (
    <section className="section-y scroll-mt-14" id="skills">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.home.skillsEyebrow}</p>
          <h2 className="display-lg mt-3">{t.home.skillsTitle}</h2>
        </Reveal>

        <div className="mt-12 grid gap-px rounded-[28px] overflow-hidden border hairline bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <div
              key={group.key}
              className={`bg-[var(--bg)] p-7 sm:p-8 ${i === skillGroups.length - 1 && skillGroups.length % 3 === 2 ? "lg:col-span-2" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE_OUT }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="font-mono text-[12px] text-faint">0{i + 1}</p>
                <h3 className="mt-1 text-[19px] font-semibold tracking-[-0.02em]">{t.home.skillGroups[group.key]}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="chip !text-[13.5px] !text-[var(--fg)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
