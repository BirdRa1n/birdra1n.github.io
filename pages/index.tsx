import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import AnimatedBackground from "@/components/animations/background";
import ListProjects from "@/components/home/projects";
import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";
import GitHubRepo from "@/types/github";
import getRepos from "@/utils/github/repo";
import React, { useEffect } from "react";

export default function IndexPage() {
  const [repos, setRepos] = React.useState<GitHubRepo[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getRepos().then((data) => {
      setRepos(data);
      setLoading(false);
    }
    ).catch((error) => {
      console.error("Error fetching repositories:", error);
      setLoading(false);
    }
    );
  }, []);

  return (
    <DefaultLayout>
      <AnimatedBackground />
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>
            Hi! I'm,
          </h1>
          <h1 className={title({ color: "green" })}> Dário Jr&nbsp;</h1>

          <h2 className={subtitle({ class: "mt-4" })}>
            I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience.				</h2>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              radius: "md",
              variant: "shadow",
              className: 'bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white',
            })}
            href={'/projects'}
          >
            Projects
          </Link>
          <div>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "md", className: "relative bg-white dark:bg-black" })}
              href={siteConfig.links.github}
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
    </DefaultLayout >
  );
}
