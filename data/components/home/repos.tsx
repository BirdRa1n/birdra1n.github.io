import { Box, Center, HStack, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { SiJavascript, SiTypescript, SiCsharp, SiCss3, SiPhpstorm, SiPython, SiGithub } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { DiAppstore, DiPython } from "react-icons/di";
import { motion } from "framer-motion";

interface Repo {
    name: string;
    html_url: string;
    language: string;
    topics: any;
}
interface LanguageIcons {
    [key: string]: JSX.Element;
}

const languageIcons: LanguageIcons = {
    JavaScript: <SiJavascript size={60} color="#FFFFFF" />,
    TypeScript: <SiTypescript size={60} color="#FFFFFF" />,
    PHP: <SiPhpstorm size={60} color="#FFFFFF" />,
    "C++": <Box w={65} h={65} bg={"#FFFFFF"} >
        <Center h={"100%"}>
            <Heading fontSize={26} color={"#ff5c00"}>C++</Heading>
        </Center>
    </Box>,
    Python: <Box w={65} h={65} bg={"#FFFFFF"} >
        <Center h={"100%"}>
            <DiPython size={60} color="#ff5c00" />
        </Center>
    </Box>,
};

//<SiCsharp size={60} color="#FFFFFF" />

const scrollbarStyles = {
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
        width: "0",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "transparent",
    },
};

const Repos = () => {
    const [data, setData] = useState<Repo[]>([]);

    useEffect(() => {
        getMyRepos();
    }, []);

    const getMyRepos = () => {
        axios
            .get<Repo[]>("https://api.github.com/users/birdra1n/repos")
            .then((response) => {
                const data = response.data || [];
                setData(data);
            })
            .catch((error) => {
                console.error("Falha ao obter repositórios públicos", error);
            });
    };

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <SimpleGrid w={"100%"} columns={[1, 2, 3]} maxH={"85%"} spacing={10} marginTop={10} overflowY="auto" sx={scrollbarStyles}>
            {data.map((repo, index) => (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    key={index}
                    onClick={
                        () => window.open(repo.html_url)
                    }
                >
                    <Box p={3}>
                        <VStack bg="#222222" shadow="sm" alignItems={"flex-start"} height="190px" borderRadius={5} p={0} >
                            <Box bg={"#ff5c00"} w={"100%"} h={120} borderTopRadius={5} borderBottomRadius={7}>
                                <HStack borderRadius={10} justifyContent={"space-between"}>
                                    {languageIcons[repo.language] || <Box w={65} h={65} bg={"#FFFFFF"} >
                                        <Center h={"100%"}>
                                            <FaCode size={49} color="#ff5c00" />
                                        </Center>
                                    </Box>}
                                </HStack>
                            </Box>
                            <Box p={2}>
                                <Heading color="#fff" fontSize="lg" maxW={["190px", "220px", "260px"]} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {repo.name}
                                </Heading>

                                <HStack maxW={[200, 200, 300]} h={10} p={0}>
                                    {repo.topics.map((topic: string, index: number) => {
                                        // Verifica o comprimento do texto (6 ou menos caracteres)
                                        if (topic.length <= 8) {
                                            return (
                                                <Text
                                                    key={index}
                                                    color={"#9E9E9E"}
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: "226px",
                                                    }}
                                                >
                                                    {topic}
                                                </Text>
                                            );
                                        } else {
                                            return null; // Não renderiza textos com mais de 6 caracteres
                                        }
                                    })}
                                </HStack>

                            </Box>


                        </VStack>
                    </Box>
                </motion.div>
            ))}
        </SimpleGrid>
    );
};

export default Repos;


/**
 * 
 *  <Box p={3}>
                        <VStack bg="#222222" shadow="sm" alignItems={"flex-start"} height="190px" borderRadius={5} p={0} justifyContent={"space-between"}>
                            <HStack borderRadius={10} justifyContent={"space-between"}>
                                {languageIcons[repo.language] || <SiGithub size={60} color="#ff5c00" />}
                            </HStack>
                            <Heading p={3} marginTop={5} color="#fff" fontSize="lg" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                                {repo.name}
                            </Heading>
                        </VStack>

                    </Box>


                    const languageIcons: LanguageIcons = {
    JavaScript: <SiJavascript size={60} color="#ff5c00" />,
    TypeScript: <SiTypescript size={60} color="#ff5c00" />,
    PHP: <SiPhpstorm size={60} color="#ff5c00" />,
    "C++": <SiCsharp size={60} color="#ff5c00" />,
    HTML: <SiCss3 size={60} color="#ff5c00" />,
    Python: <SiPython size={60} color="#ff5c00" />,
};

 */