import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import projects from "../styles/Projects.module.css";
import {
    Center,
    ChakraProvider,
    Divider,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { Heading, Button, Text, SimpleGrid, Box } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { LayoutGroup, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGithub, FaInstagram, FaSearch } from "react-icons/fa";
import { SiGmail, SiLinkedin, SiTelegram } from "react-icons/si";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    InputGroup,
    Input,
    InputRightElement,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function BoxIcons(){
    return (
        <HStack
        
            marginTop={2}
            marginBottom={4}
            spacing={3}
        
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                whileHover={{
                    scale: 1.2,
                    rotate: 0,
                }}
                whileTap={{
                    scale: 0.9,
                    borderRadius: "100%",
                }}
            >
                <a href="https://github.com/birdra1n">
                    {" "}
                    <FaGithub className={projects.icon} size={"20px"}></FaGithub>
                </a>
            </motion.div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                whileHover={{
                    scale: 1.2,
                    rotate: 0,
                }}
                whileTap={{
                    scale: 0.9,
                    borderRadius: "100%",
                }}
            >
                <a href="https://www.linkedin.com/in/ronisd%C3%A1rio-alves-bezerra-j%C3%BAnior-405067234/">
                    {" "}
                    <SiLinkedin className={projects.icon} size={"20px"}></SiLinkedin>
                </a>
            </motion.div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                whileHover={{
                    scale: 1.2,
                    rotate: 0,
                }}
                whileTap={{
                    scale: 0.9,
                    borderRadius: "100%",
                }}
            >
                <a href="https://www.instagram.com/dariojr.ig/">
                    {" "}
                    <FaInstagram className={projects.icon} size={"20px"}></FaInstagram>
                </a>
            </motion.div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                whileHover={{
                    scale: 1.2,
                    rotate: 0,
                }}
                whileTap={{
                    scale: 0.9,
                    borderRadius: "100%",
                }}
            >
                <a href="mailto:dariojunior.dev@gmail.com">
                    {" "}
                    <SiGmail className={projects.icon} size={"20px"}></SiGmail>
                </a>
            </motion.div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                whileHover={{
                    scale: 1.2,
                    rotate: 0,
                }}
                whileTap={{
                    scale: 0.9,
                    borderRadius: "100%",
                }}
            >
                <a href="https://t.me/birdra1nchannel">
                    {" "}
                    <SiTelegram className={projects.icon} size={"20px"} />
                </a>
            </motion.div>
        </HStack>
    );
}