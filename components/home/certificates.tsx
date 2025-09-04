import { useCertificates } from "@/contexts/certificates";
import { Avatar, Card, CardFooter, CardHeader, Chip } from "@heroui/react";
import { FaCode } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { IoOpen } from "react-icons/io5";


const Certificates = () => {
    const { certificates } = useCertificates();
    return (
        <div id="certificates" className="w-[82vw]">
            <p className="font-bold text-xl text-default-600">Certificates</p>
            <p className="text-default-500 text-sm mb-4">Here are some of my certificates. You can find more on my <a href="https://www.credly.com/users/dario-rios-1998" className="text-inherit font-bold text-success">credly page</a>.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {
                    certificates.map(cert => (
                        <Card key={cert.id} radius="sm">
                            <CardHeader className="flex flex-row w-full gap-2 justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <Avatar radius="sm" fallback={<GoOrganization size={23} />} src={cert?.organization?.logo} />
                                    <div>
                                        {cert.title}
                                        <p className="text-xs">{cert.organization.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <IoOpen size={20} className="text-default-500 cursor-pointer" onClick={() => window.open(cert?.url)} />
                                </div>
                            </CardHeader>
                            <CardFooter className="gap-2 max-w-[99%] overflow-auto scrollbar-hide">
                                {
                                    cert.skills.map(skill => (
                                        <Chip
                                            size="sm"
                                            radius="sm"
                                            avatar={<Avatar fallback={<FaCode />} classNames={{ base: 'bg-transparent' }} showFallback alt={skill} src={`https://cdn.simpleicons.org/${skill.toLocaleLowerCase()}/17c964`} />}
                                            variant="flat"
                                        >
                                            {skill}
                                        </Chip>
                                    ))
                                }
                            </CardFooter>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
};

export default Certificates;