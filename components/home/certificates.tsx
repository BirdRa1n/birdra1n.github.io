import { Avatar, Card, CardFooter, CardHeader, Chip } from "@heroui/react";
import { FaCode } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { IoOpen } from "react-icons/io5";
import { motion } from "framer-motion";

import { useCertificates } from "@/contexts/certificates";

const Certificates = () => {
  const { certificates } = useCertificates();

  return (
    <div
      id="certificates"
      className="min-w-[100%] pl-0 pr-0 md:pl-8 md:pr-8 lg:pl-8 lg:pr-8 xl:pl-8 xl:pr-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-xl text-default-600"
      >
        Certificates
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-default-500 text-sm mb-4"
      >
        Here are some of my certificates. You can find more on my{" "}
        <a
          className="font-bold text-success"
          href="https://www.credly.com/users/dario-rios-1998"
        >
          credly page
        </a>
        .
      </motion.p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Card radius="sm">
              <CardHeader className="flex flex-row w-full gap-2 justify-between items-start">
                <div className="flex flex-col gap-2">
                  <Avatar
                    fallback={<GoOrganization size={23} />}
                    radius="sm"
                    src={cert?.organization?.logo}
                  />
                  <div className="gap-1 flex flex-col">
                    <p className="text-lg font-medium">{cert.title}</p>
                    <p className="text-xs">{cert.organization.name}</p>
                  </div>
                </div>
                <div>
                  <IoOpen
                    className="text-default-500 cursor-pointer"
                    size={20}
                    onClick={() => window.open(cert?.url)}
                  />
                </div>
              </CardHeader>
              <CardFooter className="gap-2 max-w-[99%] overflow-auto scrollbar-hide">
                {cert.skills.map((skill) => (
                  <Chip
                    key={skill}
                    avatar={
                      <Avatar
                        showFallback
                        alt={skill}
                        classNames={{ base: "bg-transparent" }}
                        fallback={<FaCode />}
                        src={`https://cdn.simpleicons.org/${skill.toLocaleLowerCase()}/17c964`}
                      />
                    }
                    radius="sm"
                    size="sm"
                    variant="flat"
                  >
                    {skill}
                  </Chip>
                ))}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
