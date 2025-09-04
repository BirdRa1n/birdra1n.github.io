import { Avatar, Card, CardFooter, CardHeader, Chip } from "@heroui/react";
import { FaCode } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { IoOpen } from "react-icons/io5";

import { useCertificates } from "@/contexts/certificates";

const Certificates = () => {
  const { certificates } = useCertificates();

  return (
    <div className="w-[82vw]" id="certificates">
      <p className="font-bold text-xl text-default-600">Certificates</p>
      <p className="text-default-500 text-sm mb-4">
        Here are some of my certificates. You can find more on my{" "}
        <a
          className="font-bold text-success"
          href="https://www.credly.com/users/dario-rios-1998"
        >
          credly page
        </a>
        .
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {certificates.map((cert) => (
          <Card key={cert.id} radius="sm">
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
        ))}
      </div>
    </div>
  );
};

export default Certificates;
