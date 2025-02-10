import supabase from "@/utils/supabase/client";
import { Spinner } from "@heroui/react";
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
    created_at: string
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
            {/* Render projects here */}
        </div>
    );
}


export default ListProjects