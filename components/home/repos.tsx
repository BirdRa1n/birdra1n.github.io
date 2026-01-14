import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { FaCode, FaStar, FaCodeBranch } from "react-icons/fa";
import { VscGithub } from "react-icons/vsc";
import { motion } from "framer-motion";
import { formatRepoName } from "@/utils/github/formatRepoName";
import { useReposContext } from "@/contexts/repos";
import { RepoSkeleton } from "@/components/ui/skeleton";

const Repositories = () => {
  const { repos, fetchingRepos } = useReposContext();

  return (
    <section id="repositories" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-2xl text-default-700 mb-2">Repositories</h2>
        <p className="text-default-500 text-sm mb-6">
          Open source projects and contributions.{" "}
          <a
            className="font-bold text-success hover:underline"
            href="https://github.com/birdra1n?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all on GitHub →
          </a>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fetchingRepos ? (
          Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)
        ) : (
          repos?.map((repo, index) => (
            <motion.div
              key={repo?.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                isPressable
                className="w-full h-[220px] hover:shadow-lg transition-all duration-300 border border-default-200 flex flex-col"
                onPress={() => window.open(repo.html_url, "_blank")}
              >
                <CardHeader className="flex gap-3 pb-3 flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-default-100 flex-shrink-0">
                    <VscGithub className="text-default-700" size={24} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-semibold text-default-700 truncate text-sm">
                      {formatRepoName(repo.name)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-default-500 mt-0.5">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FaStar size={10} />
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FaCodeBranch size={10} />
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="pt-3 pb-3 flex-1 flex flex-col overflow-hidden">
                  <p className="text-xs text-default-500 line-clamp-2 mb-3 h-8">
                    {repo.description || "No description available"}
                  </p>
                  {repo.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {repo.skills.slice(0, 4).map((skill: string) => (
                        <Chip
                          key={skill}
                          size="sm"
                          variant="flat"
                          className="text-xs"
                          startContent={<FaCode size={10} />}
                        >
                          {skill}
                        </Chip>
                      ))}
                      {repo.skills.length > 4 && (
                        <Chip size="sm" variant="flat" className="text-xs">
                          +{repo.skills.length - 4}
                        </Chip>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default Repositories;
