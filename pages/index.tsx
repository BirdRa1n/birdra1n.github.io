import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/animations/background";
import Certificates from "@/components/home/certificates";
import FeaturedProjects from "@/components/home/featured-projects";
import Repositories from "@/components/home/repos";
import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { useReposContext } from "@/contexts/repos";
import DefaultLayout from "@/layouts/default";
import { useCertificates } from "@/contexts/certificates";

export default function IndexPage() {
  const { repos, fetchingRepos } = useReposContext();
  const { certificates, fetchingCertificates } = useCertificates();

  const subtitleText =
    "I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience.";

  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-8 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block max-w-2xl text-center"
        >
          <h1 className={title()}>Hi! I&apos;m,</h1>
          <h1 className={title({ color: "green" })}> Dário Jr</h1>
          <p className={subtitle({ class: "mt-6" })}>{subtitleText}</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            className={buttonStyles({
              radius: "md",
              variant: "shadow",
              size: "lg",
              className:
                "bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white font-semibold",
            })}
            href={"#repositories"}
          >
            View Repositories
          </Link>
          <Link
            isExternal
            className={buttonStyles({
              radius: "md",
              variant: "bordered",
              size: "lg",
              className: "relative bg-white dark:bg-black font-semibold",
            })}
            href={siteConfig.links.github}
            rel="noopener noreferrer"
          >
            <GithubIcon size={20} />
            <div className="flex flex-col items-start">
              <span>GitHub</span>
              <span className="text-[10px] font-normal -mt-1">
                {fetchingRepos ? "Loading..." : `${repos.length} repositories`}
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Content Sections */}
        <div className="w-full max-w-7xl space-y-16 mt-8">
          <FeaturedProjects />
          <Certificates />
          <Repositories />
        </div>
      </section>
    </DefaultLayout>
  );
}
