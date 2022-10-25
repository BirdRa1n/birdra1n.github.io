
import projects from "../styles/Projects.module.css";
import {
    Divider,
    HStack, Stack, VStack,
} from "@chakra-ui/react";
import { Heading, Button, Text, SimpleGrid, Box } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";


import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Badge
} from "@chakra-ui/react";
import { FaJs, FaCube, FaPhp, FaPython, FaHtml5, FaCode, FaCubes, FaStar, FaRegStar } from "react-icons/fa";
import { DiPhp } from "react-icons/di";
import { BiGitRepoForked } from "react-icons/bi";
import { SiPhpstorm, SiPhpmyadmin } from "react-icons/si";

export default function AllPosts() {
    const [DataReq, setDataReq] = useState();

    function getData() {
        axios
            .get("https://api.github.com/users/birdra1n/repos")
            .then(function (response) {
                setDataReq(response.data);
            });
    }

    function setModalData(reponame, description, language, url) {
        axios
            .get("https://api.github.com/repos/BirdRa1n/" + reponame + "/languages")
            .then(function (response) {
                console.log(JSON.parse(JSON.stringify(response.data)));
            });

        setDataModal({
            ...DataModal,
            reponame: reponame,
            description: description,
            language: language,
            url: url,
        });

        onOpen();
    }

    useEffect(() => {
        getData();
    }, []);
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

    const Post = () => {
        return (
            <div className={projects.scroll} >
                <SimpleGrid columns={[1, null, 1]} spacing="19px">
                    {DataReq?.map((item, itemI) => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.8 }}
                            variants={container}
                            initial="hidden"
                            animate="visible"

                            onClick={
                                () => window.open(item.html_url)
                            }
                        >
                            <Box

                                borderRadius={4}
                                className={projects.box}
                                alignContent={'space-between'}
                            >

                                <HStack alignContent={'space-between'}>
                                    <Heading size={30} className={projects.name_project}>
                                        {item.name}
                                    </Heading>
                                    <Text className={projects.description}>
                                        {item.language == 'JavaScript' ? <FaJs fontSize={20}></FaJs> : item.language == 'PHP' ? <SiPhpmyadmin fontSize={20}></SiPhpmyadmin> : item.language == 'Python' ? <FaPython fontSize={20}></FaPython> : item.language == 'HTML' ? <FaHtml5 fontSize={20}></FaHtml5> : < FaCube fontSize={20}></FaCube>}
                                    </Text>


                                </HStack>
                                <Text size={10} className={projects.description}>
                                    {item.description}
                                </Text>

                                <Box right={1.5} position={'relative'}>

                                    {item.topics?.map((item, itemI) => (
                                        <Badge ml='1' fontSize='0.7em' colorScheme='yellow'>
                                            {item}
                                        </Badge>
                                    ))}
                                </Box>


                                <Box marginTop={10}>

                                    <HStack>
                                        <HStack>
                                            <FaRegStar className={projects.icon} fontSize={14}></FaRegStar><Heading fontSize={15} className={projects.icon}>{item.stargazers_count}</Heading>
                                        </HStack>
                                        <HStack>
                                            <BiGitRepoForked className={projects.icon} fontSize={1}></BiGitRepoForked><Heading fontSize={15} className={projects.icon}>{item.forks}</Heading>
                                        </HStack>
                                    </HStack>


                                </Box>





                            </Box>
                        </motion.div>
                    ))}
                </SimpleGrid>


            </div>
        )
    }

    return (<Post />)
}