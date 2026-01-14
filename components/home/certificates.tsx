import { Avatar, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { FaCode, FaExternalLinkAlt } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { motion } from "framer-motion";
import { useCertificates } from "@/contexts/certificates";
import { CertificateSkeleton } from "@/components/ui/skeleton";

const Certificates = () => {
  const { certificates, fetchingCertificates } = useCertificates();

  return (
    <section id="certificates" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-2xl text-default-700 mb-2">Certificates</h2>
        <p className="text-default-500 text-sm mb-6">
          Professional certifications and achievements.{" "}
          <a
            className="font-bold text-success hover:underline"
            href="https://www.credly.com/users/dario-rios-1998"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all on Credly →
          </a>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fetchingCertificates ? (
          Array.from({ length: 6 }).map((_, i) => <CertificateSkeleton key={i} />)
        ) : (
          certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                isPressable
                className="w-full h-[180px] hover:shadow-lg transition-all duration-300 border border-default-200 flex flex-col"
                onPress={() => window.open(cert?.url, "_blank")}
              >
                <CardHeader className="flex gap-3 pb-3 flex-shrink-0">
                  <Avatar
                    isBordered
                    radius="sm"
                    size="lg"
                    src={cert?.organization?.logo}
                    fallback={<GoOrganization size={24} />}
                    className="flex-shrink-0"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-semibold text-default-700 line-clamp-2 text-sm">
                      {cert.title}
                    </p>
                    <p className="text-xs text-default-500 truncate">
                      {cert.organization.name}
                    </p>
                  </div>
                  <FaExternalLinkAlt className="text-default-400 flex-shrink-0" size={14} />
                </CardHeader>
                <Divider />
                <CardBody className="pt-3 flex-1 overflow-hidden">
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.slice(0, 4).map((skill) => (
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
                    {cert.skills.length > 4 && (
                      <Chip size="sm" variant="flat" className="text-xs">
                        +{cert.skills.length - 4}
                      </Chip>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default Certificates;
