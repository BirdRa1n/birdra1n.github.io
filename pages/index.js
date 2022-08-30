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
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function Home() {
  const [listProjects, SetListProjects] = useState(false);
  const [DataReq, setDataReq] = useState();
  const [DataModal, setDataModal] = useState({});
  const [languages, setLanguages] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  function getData() {
    axios
      .get("https://api.github.com/users/birdra1n/repos")
      .then(function (response) {
        let responseRequest = response.data;
        setDataReq(responseRequest);
      });
  }
  useEffect(() => {
    getData();
  }, []);

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

  const markdown = DataModal.data;

  if (listProjects == true) {
    return (
      <ChakraProvider>
        <Head>
          <title>{"I'm Dário Jr"}</title>
          <meta
            name="description"
            content="I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
          />
          <link rel="icon" href="/github.svg" />
        </Head>

        <div className={styles.nav}></div>
        <main className={projects.main}>
          <div className={projects.row_container}>
            <HStack marginBottom={1} spacing={1}>
              <img
                width={41}
                src="https://avatars.githubusercontent.com/u/53487868?v=4"
                alt="Avatar"
              ></img>{" "}
              <Heading fontSize={31} noOfLines={1} className={projects.name}>
                {"Dário Jr"}
              </Heading>
              <InputGroup className={projects.searchNavBox}>
                <Input
                  maxWidth={120}
                  variant="unstyled"
                  placeholder="Search project"
                />
                <FiSearch
                  className={projects.iconSearch}
                  size={"22px"}
                ></FiSearch>
              </InputGroup>
            </HStack>
            <Divider></Divider>

            <VStack>
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
                <Text fontSize={20} className={projects.public_repositories}>
                  {"Public Repositories"}
                </Text>
              </motion.div>
            </VStack>

            <HStack
              className={projects.boxIco}
              marginTop={2}
              marginBottom={4}
              spacing={3}
              marginLeft={1}
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
                  <SiLinkedin
                    className={projects.icon}
                    size={"20px"}
                  ></SiLinkedin>
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
                  <FaInstagram
                    className={projects.icon}
                    size={"20px"}
                  ></FaInstagram>
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
                <a href="https://t.me/dariojr">
                  {" "}
                  <SiTelegram className={projects.icon} size={"20px"} />
                </a>
              </motion.div>
            </HStack>

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

            <div className={projects.scroll}>
              <SimpleGrid columns={[1, null, 3]} spacing="20px">
                {DataReq.map((item, itemI) => (
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
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://github.com/birdra1n"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className={styles.footer_text}>Powered by </p>

            <span className={styles.logo}>
              <Image
                src="/github.svg"
                alt="Vercel Logo"
                width={30}
                height={17}
              />
            </span>
            <p className={styles.footer_text}>BirdRa1n</p>
          </a>
        </footer>
      </ChakraProvider>
    );
  } else {
    return (
      <ChakraProvider>
        <Head>
          <title>Hello I'm Dário Jr</title>
          <meta
            name="description"
            content="I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
          />
          <link rel="icon" href="/github.svg" />
        </Head>

        <div className={styles.nav}></div>
        <main className={styles.main}>
          <div className={styles.hello_div}>
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
            >
              <Heading
                position={"relative"}
                as="h1"
                fontSize={31}
                noOfLines={1}
                className={styles.hello}
              >
                Hello, I’m
              </Heading>
            </motion.div>
          </div>
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
          >
            <Heading
              as="h1"
              fontSize={91}
              noOfLines={1}
              className={styles.name}
            >
              Dário Jr
            </Heading>
          </motion.div>
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
          >
            <Text
              as="p"
              fontSize={20}
              textAlign="center"
              marginTop={10}
              className={styles.description}
            >
              {
                "I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
              }
            </Text>
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
            <Button
              rightIcon={<ArrowForwardIcon />}
              borderRadius={4}
              colorScheme="blue"
              size="sm"
              bgColor={"blue.900"}
              className={styles.btn_hello}
              onClick={() => SetListProjects(true)}
            >
              See my work
            </Button>
          </motion.div>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://github.com/birdra1n"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className={styles.footer_text}>Powered by </p>

            <span className={styles.logo}>
              <Image
                src="/github.svg"
                alt="Vercel Logo"
                width={30}
                height={17}
              />
            </span>
            <p className={styles.footer_text}>BirdRa1n</p>
          </a>
        </footer>
      </ChakraProvider>
    );
  }
}
