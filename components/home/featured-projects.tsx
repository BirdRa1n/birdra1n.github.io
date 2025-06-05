import storage from "@/utils/storage";
import supabase from "@/utils/supabase/client";
import { Card, CardHeader, Image, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

interface Project {
    id: string,
    title: string,
    content: string,
    status: string,
    views_count: number,
    thumbnail_url: string,
    slug: string,
    category_id: string,
    created_at: string,
    description: string,
}

const FeaturedProjects = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchLastProjects = async () => {
        const cachedProjects = storage.getItem('lastProjects');
        if (cachedProjects) {
            const parsedProjects = JSON.parse(cachedProjects) as Project[];
            return setProjects(parsedProjects);
        }
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3);
        if (data) {
            setIsLoading(false);
            storage.setItem('lastProjects', data);
            return setProjects(data);
        }
    }

    useEffect(() => {
        fetchLastProjects();
    }, []);

    if (projects.length === 0) {
        return (
            <center>
                <Spinner color="success" size="sm" className="mt-20" />
                <p className="font-size-sm">getting latest projects...</p>
            </center>
        )
    }

    return (
        <>
            <p className="font-bold text-xl text-default-600">Latest Projects</p>
            <p className="text-default-500 text-sm mb-4">Here are some of my latest projects. You can find more on my <a href="/projects" className="text-inherit font-bold text-success">projects page</a>.</p>
            <div className="flex flex-col items-center justify-center gap-2 xl:flex-row xl:gap-4 md:flex-row md:gap-4">
                {
                    projects.map((project) => (
                        <Card key={project.id} radius="md" className="max-w-sm mb-4 min-h-[110px] hover:shadow-lg transition-shadow duration-300 ease-in-out">
                            <CardHeader className="flex flex-col gap-1 align-start items-start">
                                <div className="flex gap-3 items-center">
                                    <Image
                                        src={project.thumbnail_url}
                                        alt={project?.title}
                                        className="max-w-[140px] max-h-[80px] object-cover"
                                        loading="lazy"
                                        isBlurred
                                        isLoading={project?.thumbnail_url ? false : true}
                                    />
                                    <div>
                                        <h3 className="font-bold text-xl text-default-600">{project?.title}</h3>
                                        <p className="text-default-500 text-[13px]">{project?.description}</p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
        </>
    );
}


export default FeaturedProjects;