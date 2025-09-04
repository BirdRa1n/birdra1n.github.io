import { Avatar, Card, CardFooter, CardHeader, Chip } from "@heroui/react";
import { FaCode } from "react-icons/fa6";

import { GithubIcon } from "../icons";

import { formatRepoName } from "@/utils/github/formatRepoName";
import { useReposContext } from "@/contexts/repos";

const Repositories = () => {
  const { repos, fetchingRepos } = useReposContext();

  return (
    <div id="repos">
      <p className="font-bold text-xl text-default-600">Repositories</p>
      <p className="text-default-500 text-sm mb-4">
        Here are some of my latest repositories. You can find more on my{" "}
        <a
          className="font-bold text-success"
          href="https://github.com/birdra1n?tab=repositories"
        >
          github page
        </a>
        .
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {fetchingRepos ? (
          <p className="font-bold text-lg text-default-600">loading...</p>
        ) : (
          repos?.map((repo, index) => (
            <Card
              key={index}
              className="flex flex-col items-center justify-center gap-2"
            >
              <CardHeader className="flex flex-col items-start justify-center gap-2 p-2">
                <div className="bg-default-200 p-2 rounded-md">
                  <GithubIcon className="text-default-600" />
                </div>
                <h3 className="font-bold text-lg text-default-600 is-truncated text-center">
                  {formatRepoName(repo.name)}
                </h3>
                <p className="text-default-500 text-xs is-truncated line-clamp-3">
                  {repo.description || "No description available"}
                </p>
              </CardHeader>
              <CardFooter>
                {repo.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {repo.skills.map((skill: string) => (
                      <Chip
                        key={skill}
                        avatar={
                          <Avatar
                            showFallback
                            alt={skill}
                            classNames={{ base: "bg-transparent" }}
                            fallback={<FaCode />}
                            src={`https://cdn.simpleicons.org/${skill.toLowerCase()}/17c964`}
                          />
                        }
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Repositories;
