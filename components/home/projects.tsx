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

const ListProjects = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchLastProjects = async () => {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3);
        if (data) {
            setIsLoading(false);
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
        <div>
            {
                projects.map((project) => (
                    <Card key={project.id} radius="md" className="max-w-sm mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out">
                        <CardHeader className="flex flex-col gap-1 align-start items-start">
                            <div className="flex gap-3 items-center">
                                <Image
                                    src={project.thumbnail_url}
                                    alt={project?.title}
                                    width={140}
                                    height={70}
                                    isBlurred
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
    );
}


export default ListProjects