
import projects from "../styles/Projects.module.css";
import {
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
} from "@chakra-ui/react";
import { FaJs,FaCube, FaPhp, FaPython, FaHtml5,FaCode,FaCubes } from "react-icons/fa";
import { DiPhp } from "react-icons/di";
import { SiPhpstorm , SiPhpmyadmin} from "react-icons/si";


export default function AllPosts() {
    const [DataReq, setDataReq] = useState();
    const [DataModal, setDataModal] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();


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

    const Post = () => {
        return (
            <div className={projects.scroll} >
                <SimpleGrid columns={[1, null, 2,3]} spacing="20px">
                    {DataReq?.map((item, itemI) => (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 35,
                                damping: 10
                            }}
                            onClick={() =>
                                setModalData(
                                    item.name,
                                    item.description,
                                    item.language,
                                    item.html_url
                                )
                            }
                        >
                            <Box
                                height="100px"
                                borderRadius={4}
                                className={projects.box}
                                alignContent={'space-between'}
                            >
                          
                                  <HStack alignContent={'space-between'}>
                                  <Heading size={30} className={projects.name_project}>
                                        {item.name}
                                    </Heading>
                                    <Text className={projects.description}>
                                    {item.language == 'JavaScript' ? <FaJs fontSize={20}></FaJs> : item.language == 'PHP' ? <SiPhpmyadmin fontSize={20}></SiPhpmyadmin> : item.language == 'Python' ? <FaPython fontSize={20}></FaPython> : item.language == 'HTML' ? <FaHtml5 fontSize={20}></FaHtml5> : < FaCube  fontSize={20}></FaCube>}
                                    </Text>
                                    

                                  </HStack>
                                    <Text size={10} className={projects.description}>
                                        {item.description}
                                    </Text>
                                  
                                
                            
                            </Box>
                        </motion.div>
                    ))}
                </SimpleGrid>

                <Modal isOpen={isOpen} onClose={onClose} size={"xs"} >
                    <ModalOverlay />
                    <ModalContent className={projects.modal_box} >
                        <ModalHeader className={projects.ModalBody}>
                            {DataModal.reponame}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody className={projects.ModalBody}>
                            <Text className={projects.descriptionModal}>
                                {DataModal.description}
                            </Text>
                        </ModalBody>

                        <ModalFooter>
                            <HStack className={projects.footerModal}>
                                <Text>{DataModal.language == 'JavaScript' ? <FaJs fontSize={40}></FaJs> : DataModal.language == 'PHP' ? <FaPhp fontSize={40}></FaPhp> : DataModal.language == 'Python' ? <FaPython fontSize={40}></FaPython> : DataModal.language == 'HTML' ? <FaHtml5 fontSize={40}></FaHtml5> : DataModal.language}</Text>

                                <div>
                                    <Button
                                        onClick={() => window.open(DataModal.url)}
                                        variant="ghost"
                                        rightIcon={<ArrowForwardIcon />}
                                    >
                                        Open repo
                                    </Button>
                                </div>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        )
    }

    return (<Post />)
}