import { Card, CardHeader, CardBody, Image, Divider } from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import storage from "@/utils/storage";
import supabase from "@/utils/supabase/client";
import { ProjectSkeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  title: string;
  content: string;
  status: string;
  views_count: number;
  thumbnail_url: string;
  slug: string;
  category_id: string;
  created_at: string;
  description: string;
}

const FeaturedProjects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchLastProjects = async () => {
    const cachedProjects = storage.getItem("lastProjects");

    if (cachedProjects) {
      const parsedProjects = JSON.parse(cachedProjects) as Project[];
      setProjects(parsedProjects);
      setIsLoading(false);
      return;
    }
    
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      storage.setItem("lastProjects", data);
      setProjects(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLastProjects();
  }, []);

  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-2xl text-default-700 mb-2">Latest Projects</h2>
        <p className="text-default-500 text-sm mb-6">
          Recent work and side projects.{" "}
          <a className="font-bold text-success hover:underline" href="/projects">
            View all projects →
          </a>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <ProjectSkeleton key={i} />)
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                isPressable
                className="w-full h-[120px] hover:shadow-lg transition-all duration-300 border border-default-200 flex flex-col"
                radius="md"
              >
                <CardHeader className="flex gap-3 pb-0 flex-1 overflow-hidden">
                  <Image
                    isBlurred
                    alt={project?.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                    src={project.thumbnail_url}
                  />
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <p className="font-semibold text-default-700 line-clamp-1 text-sm">
                      {project?.title}
                    </p>
                    <p className="text-xs text-default-500 line-clamp-2 mt-1">
                      {project?.description}
                    </p>
                  </div>
                  <FaExternalLinkAlt className="text-default-400 flex-shrink-0" size={14} />
                </CardHeader>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
