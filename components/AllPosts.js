
import projects from "../styles/Projects.module.css";
import {
    HStack,
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

export default function AllPosts() {
    const [DataReq, setDataReq] = useState();
    const [DataModal, setDataModal] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    function getData() {
        axios
            .get("https://api.github.com/users/birdra1n/repos")
            .then(function (response) {
                let responseRequest = response.data;
                setDataReq(responseRequest);
            });
    }

    function setModalData(reponame, description, language, url) {
        axios
            .get("https://api.github.com/repos/BirdRa1n/" + reponame + "/languages")
            .then(function (response) {
                let responseRequest = JSON.stringify(response.data);
                setLanguages(JSON.parse(responseRequest));
                console.log(JSON.parse(responseRequest));
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
            <div className={projects.scroll}>
                <SimpleGrid columns={[1, null, 3]} spacing="20px">
                    {DataReq?.map((item, itemI) => (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {
                                    scale: 0.8,
                                    opacity: 0,
                                },
                                visible: {
                                    scale: 1,
                                    opacity: 1,
                                    transition: {
                                        delay: 0.4,
                                    },
                                },
                            }}
                            whileHover={{
                                scale: 1,
                                rotate: 1,
                            }}
                            whileTap={{
                                scale: 0.9,
                                borderRadius: "100%",
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
                            >
                                <Heading size={50} className={projects.name_project}>
                                    {item.name}
                                </Heading>

                                <Text size={10} className={projects.description}>
                                    {item.description}
                                </Text>
                            </Box>
                        </motion.div>
                    ))}
                </SimpleGrid>

                <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
                    <ModalOverlay />
                    <ModalContent className={projects.modal_box}>
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
                                <Text>{DataModal.language}</Text>
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

    return (

        <Post />


    )
}