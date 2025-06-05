import AnimatedBackground from "@/components/animations/background";
import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";
import GitHubRepo from "@/types/github";
import getRepos from "@/utils/github/repo";
import storage from "@/utils/storage";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from 'next/dynamic';
import React, { useEffect } from "react";

const ListProjects = dynamic(() => import('@/components/home/projects'), { ssr: false });

export default function IndexPage() {
  const [repos, setRepos] = React.useState<GitHubRepo[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const cachedRepos = storage.getItem('repos');
    if (cachedRepos) {
      try {
        const parsedRepos = JSON.parse(cachedRepos) as GitHubRepo[];
        setRepos(parsedRepos);
        setLoading(false);
        return;
      }
      catch (error) {
        console.log("Error parsing cached repos:", error);
      }
    }

    getRepos().then((data) => {
      setRepos(data);
      setLoading(false);
      storage.setItem('repos', data);
    }
    ).catch((error) => {
      console.error("Error fetching repositories:", error);
      setLoading(false);
    });
  }, []);

  // Typewriter effect configuration
  const subtitleText = "I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience.";
  const words = subtitleText.split(" ").map(word => word.split("").concat(" ")); // Split into words, then characters, with space at the end
  const characters = words.flat(); // Flatten to get character array with spaces

  const sentenceVariants = {
    hidden: {},
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }, // Reduced stagger for smoother, natural typing
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 }, // Slight y-offset for a subtle "typing" feel
    visible: { opacity: 1, y: 0, transition: { opacity: { duration: 0 }, y: { duration: 0.1 } } }, // Smooth y transition
  };

  return (
    <DefaultLayout>
      <AnimatedBackground />
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-md text-center justify-center">
          <h1 className={title()}>
            Hi! I'm,
          </h1>
          <h1 className={title({ color: "green" })}> Dário Jr</h1>

          <motion.h2
            className={subtitle({ class: "mt-4" })}
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "inline-block", whiteSpace: "pre-wrap" }} // Preserve word boundaries
          >
            <AnimatePresence>
              {words.map((word, wordIndex) => (
                <span key={`word-${wordIndex}`} style={{ display: "inline-block", whiteSpace: "pre" }}>
                  {word.map((char, charIndex) => (
                    <motion.span
                      key={`char-${wordIndex}-${charIndex}`}
                      variants={letterVariants}
                      style={{ display: "inline-block" }}
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
              className: 'bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white',
            })}
            rel="noopener noreferrer"
            href={'/projects'}
          >
            Projects
          </Link>
          <div>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "md", className: "relative bg-white dark:bg-black" })}
              href={siteConfig.links.github}
              rel="noopener noreferrer"
            >
              <GithubIcon size={20} />
              <div className="flex mt-1 flex-col items-start">
                <p>GitHub</p>
                {loading ? (
                  <p style={{ marginTop: '-7px' }} className="text-[7px] ml-[1px]">loading...</p>
                ) : (
                  <p style={{ marginTop: '-7px' }} className="text-[7px] ml-[1px]">{repos.length} repositories</p>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8" id="#projects">
          <ListProjects />
        </div>
      </section>
    </DefaultLayout>
  );
}