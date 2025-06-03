import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import ListProjects from "@/components/home/projects";
import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

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
              radius: "sm",
              variant: "shadow",
              className: 'bg-gradient-to-b from-[#6FEE8D] to-[#17c964]',
            })}
            href={'/projects'}
          >
            Projects
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        <div className="mt-8" id="#projects">
          <ListProjects />
        </div>
      </section>
    </DefaultLayout >
  );
}
