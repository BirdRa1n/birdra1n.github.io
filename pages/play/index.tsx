// pages/play/index.tsx — Hub de minigames
import { motion } from "framer-motion";
import { useState } from "react";
import { FiTarget, FiType } from "react-icons/fi";

import { SpaceTyper, TypingGame } from "@/components/games";
import { EASE_OUT } from "@/components/motion";
import { PageIntro } from "@/components/page";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";

type GameId = "typing" | "space";

export default function PlayPage() {
  const { t } = useI18n();
  const [active, setActive] = useState<GameId>("typing");

  const games: { id: GameId; label: string; tagline: string; Icon: typeof FiType }[] = [
    { id: "typing", label: t.play.typing, tagline: t.play.typingTag, Icon: FiType },
    { id: "space", label: t.play.space, tagline: t.play.spaceTag, Icon: FiTarget },
  ];

  return (
    <DefaultLayout title={t.play.eyebrow}>
      <PageIntro eyebrow={t.play.eyebrow} lead={t.play.lead} title={t.play.title} />

      <section className="container-x pb-32 max-w-[880px]">
        <div className="inline-flex p-1 rounded-full bg-[var(--bg-subtle)] mb-10" role="tablist">
          {games.map(({ id, label, tagline, Icon }) => {
            const isActive = active === id;

            return (
              <button
                key={id}
                aria-selected={isActive}
                className="relative isolate flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors"
                role="tab"
                style={{ color: isActive ? "var(--fg)" : "var(--fg-muted)" }}
                title={tagline}
                type="button"
                onClick={() => setActive(id)}
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--bg-elevated)] shadow-[var(--shadow-sm)]"
                    layoutId="game-tab"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={active}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {active === "typing" ? <TypingGame /> : <SpaceTyper />}
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
