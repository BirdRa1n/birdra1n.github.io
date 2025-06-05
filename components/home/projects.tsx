import { useReposContext } from "@/contexts/repos";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { GithubIcon } from "../icons";

const Projects = () => {
    const { repos, fetchingRepos } = useReposContext();
    return (
        <>
            <p className="font-bold text-xl text-default-600">Projects</p>
            <p className="text-default-500 text-sm mb-4">Here are some of my latest projects. You can find more on my <a href="https://github.com/birdra1n?tab=repositories" className="text-inherit font-bold text-success">github page</a>.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {fetchingRepos ? (
                    <p className="font-bold text-lg text-default-600">loading...</p>
                ) : (
                    repos?.map((repo, index) => (
                        <Card key={index} className="flex flex-col items-center justify-center gap-2">
                            <CardHeader className="flex flex-col items-center justify-center gap-2 p-2">
                                <div className="bg-default-200 p-2 rounded-md">
                                    <GithubIcon className="text-default-600" />
                                </div>
                                <h3 className="font-bold text-lg text-default-600 is-truncated text-center">{repo.name}</h3>
                            </CardHeader>
                            <CardBody>
                                <p className="text-default-500 text-sm text-justify is-truncated line-clamp-3">{repo.description || "No description available"}</p>
                            </CardBody>
                            <CardFooter>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-success hover:underline">
                                    View on GitHub
                                </a>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}

export default Projects;