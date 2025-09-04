import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { AnimatePresence, motion } from "framer-motion";

import AnimatedBackground from "@/components/animations/background";
import Certificates from "@/components/home/certificates";
import FeaturedProjects from "@/components/home/featured-projects";
import Repositories from "@/components/home/repos";
import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { useReposContext } from "@/contexts/repos";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { repos, fetchingRepos } = useReposContext();

  // Typewriter effect configuration
  const subtitleText =
    "I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience.";
  const words = subtitleText
    .split(" ")
    .map((word) => word.split("").concat(" ")); // Split into words, then characters, with space at the end

  const sentenceVariants = {
    hidden: {},
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }, // Reduced stagger for smoother, natural typing
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 }, // Slight y-offset for a subtle "typing" feel
    visible: {
      opacity: 1,
      y: 0,
      transition: { opacity: { duration: 0 }, y: { duration: 0.1 } },
    }, // Smooth y transition
  };

  return (
    <DefaultLayout>
      <AnimatedBackground />
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-md text-center justify-center items-center">
          <h1 className={title()}>Hi! I&apos;m,</h1>
          <h1 className={title({ color: "green" })}> Dário Jr</h1>

          <motion.h2
            animate="visible"
            className={subtitle({ class: "mt-4" })}
            initial="hidden"
            style={{ display: "inline-block", whiteSpace: "pre-wrap" }} // Preserve word boundaries
            variants={sentenceVariants}
          >
            <AnimatePresence>
              {words.map((word, wordIndex) => (
                <span
                  key={`word-${wordIndex}`}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                >
                  {word.map((char, charIndex) => (
                    <motion.span
                      key={`char-${wordIndex}-${charIndex}`}
                      style={{ display: "inline-block" }}
                      variants={letterVariants}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </AnimatePresence>
          </motion.h2>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              radius: "md",
              variant: "shadow",
              className:
                "bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white",
            })}
            href={"#repositories"}
          >
            Repositories
          </Link>
          <div>
            <Link
              isExternal
              className={buttonStyles({
                radius: "md",
                variant: "bordered",
                className: "relative bg-white dark:bg-black",
              })}
              href={siteConfig.links.github}
              rel="noopener noreferrer"
            >
              <GithubIcon size={20} />
              <div className="flex mt-1 flex-col items-start">
                <p>GitHub</p>
                {fetchingRepos ? (
                  <p
                    className="ml-[1px] text-[7px]"
                    style={{ marginTop: "-7px" }}
                  >
                    Loading...
                  </p>
                ) : (
                  <p
                    className="ml-[1px] text-[7px]"
                    style={{ marginTop: "-7px" }}
                  >
                    {repos.length} repositories
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <FeaturedProjects />
        </div>

        <div className="mt-8">
          <Certificates />
        </div>
        <div className="mt-8 pl-0 pr-0 md:pl-8 md:pr-8 lg:pl-8 lg:pr-8 xl:pl-8 xl:pr-8">
          <Repositories />
        </div>
      </section>
    </DefaultLayout>
  );
}
