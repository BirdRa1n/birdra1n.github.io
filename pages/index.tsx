import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Grid,
  GridItem,
  Stack,
  Center,
  Image,
  Heading,
  Text,
  VStack,
  Divider,
  HStack,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

import { LuMail, LuCalendarRange, LuGlobe } from "react-icons/lu";
import {
  FaCode,
  FaFacebookF,
  FaInstagram,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { MdPhonelink } from "react-icons/md";
import About from "@/data/components/home/about";
import { useState } from "react";
import Repos from "@/data/components/home/repos";
import Developing from "@/data/components/developing";

interface PropsRenderTabs {
  [key: string]: {
    component: JSX.Element;
    title: string;
  };
}

const RenderTabs: PropsRenderTabs = {
  about: {
    component: <About />,
    title: "About",
  },
  repos: {
    component: <Repos />,
    title: "Repositories",
  },
  apps: {
    component: <Developing />,
    title: "Apps",
  },
};
export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("about");
  return (
    <>
      <Head>
        <title>BirdRa1n</title>
        <meta
          name="description"
          content="Greetings! I'm a technology enthusiast and a developer with experience in both front-end and back-end development. My focus is on creating exceptional digital solutions and enhancing the user experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sticker.png" />
      </Head>
      <main>
        <Box w={"100%"} h={"100vh"} bg={"#121212"} p={[31, null, 70]}>
          <Stack
            direction={["column", null, "row"]}
            spacing="24px"
            h={["100%", null, "75vh"]}
            overflowY="auto"
            sx={{
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                width: "0", // Safari and Chrome
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent", // Safari and Chrome
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent", // Safari and Chrome
              },
            }}
          >
            <Box
              shadow={"xl"}
              borderRadius={7}
              w={["100%", null, "360px"]}
              minHeight={["100%", null, "650px"]}
              maxH={["650px", null, "100%"]}
              bg="#1E1E20"
              p={10}
              justifyContent="space-between"
              minH={"650px"}
            >
              <Center>
                <Stack
                  direction={["column", null, "column"]}
                  spacing="24px"
                  alignItems={["center", null, "center"]}
                >
                  <Box borderRadius={33} w={150} h={140} bg={"#393939"}>
                    <Image
                      src="https://avatars.githubusercontent.com/u/53487868?v=4"
                      alt="Dan Abramov"
                    />
                  </Box>
                  <Stack
                    direction={["column", null, "column"]}
                    alignItems={"center"}
                  >
                    <Heading color={"white"} fontSize={"3xl"}>
                      Dário Jr
                    </Heading>
                    <Center>
                      <Text
                        borderRadius={5}
                        p={2}
                        bg={"#2B2B2C"}
                        fontSize={12}
                        textAlign={"center"}
                        color={"white"}
                      >
                        Mobile and Web Developer
                      </Text>
                    </Center>
                  </Stack>
                </Stack>
              </Center>
              <Divider
                borderColor={"#383838"}
                marginTop={10}
                marginBottom={10}
              />
              <VStack w={"100%"}>
                <VStack
                  spacing={"xl"}
                  w={"100%"}
                  onClick={() => window.open("mailto:birdra1n@proton.me")}
                >
                  <HStack spacing={2} w={"100%"}>
                    <Box p={4} bg={"#212122"} borderRadius={10}>
                      <LuMail size={20} color="#ff5c00" />
                    </Box>
                    <Box alignItems="flex-start">
                      <Text color={"#707070"} fontSize={12}>
                        EMAIL
                      </Text>
                      <Text color={"#DEDEDE"} fontSize={"$sm"}>
                        birdra1n@proton.me
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
                <VStack spacing={"xl"} w={"100%"}>
                  <HStack spacing={2} w={"100%"}>
                    <Box p={4} bg={"#212122"} borderRadius={10}>
                      <LuCalendarRange size={20} color="#ff5c00" />
                    </Box>
                    <Box alignItems="flex-start">
                      <Text color={"#707070"} fontSize={12}>
                        BIRTHDAY
                      </Text>
                      <Text color={"#DEDEDE"} fontSize={"$sm"}>
                        11/02/2003
                      </Text>
                    </Box>
                  </HStack>
                </VStack>

                <VStack spacing={"xl"} w={"100%"}>
                  <HStack spacing={2} w={"100%"}>
                    <Box p={4} bg={"#212122"} borderRadius={10}>
                      <LuGlobe size={20} color="#ff5c00" />
                    </Box>
                    <Box alignItems="flex-start">
                      <Text color={"#707070"} fontSize={12}>
                        LOCATION
                      </Text>
                      <Text color={"#DEDEDE"} fontSize={"$sm"}>
                        BRAZIL
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </VStack>

              <Center>
                <HStack marginTop={5}>
                  <FaFacebookF
                    size={20}
                    color="#ff5c00"
                    onClick={() => alert("Rede social indisponível")}
                  />
                  <FaInstagram
                    size={20}
                    color="#ff5c00"
                    onClick={() =>
                      window.open("https://www.instagram.com/dariojr.ig/")
                    }
                  />
                  <FaSquareXTwitter
                    size={20}
                    color="#ff5c00"
                    onClick={() => window.open("https://twitter.com/birdra1n")}
                  />
                </HStack>
              </Center>
            </Box>

            <Box
              shadow={"xl"}
              borderRadius={7}
              w={["100%"]}
              bg="#1E1E20"
              p={[3, null, 10]}
              minHeight={["130vh", null, "650px"]}
            >
              <HStack w={"100%"} justifyContent="space-between">
                <Heading fontSize={"4xl"} color={"#F9F9F9"}>
                  {" "}
                  {RenderTabs[activeTab]?.title || ""}
                </Heading>
                <Tabs
                  position="relative"
                  variant="unstyled"
                  display={["none", "flex", "flex"]}
                >
                  <TabList>
                    <Tab
                      color={"#F9F9F9"}
                      onClick={() => setActiveTab("about")}
                    >
                      About
                    </Tab>
                    <Tab
                      color={"#F9F9F9"}
                      onClick={() => setActiveTab("repos")}
                    >
                      Repositories
                    </Tab>
                    <Tab color={"#F9F9F9"} onClick={() => setActiveTab("apps")}>
                      Apps
                    </Tab>
                  </TabList>
                  <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="#FF5C00"
                    borderRadius="1px"
                  />
                </Tabs>
              </HStack>
              <Box
                w={65}
                marginTop={3}
                h={1}
                borderRadius={10}
                bg={"#FF5C00"}
                display={["none", "flex", "flex"]}
              />
              <Tabs
                position="relative"
                variant="unstyled"
                display={["flex", "none", "none"]}
                marginTop={10}
              >
                <TabList>
                  <Tab color={"#F9F9F9"} onClick={() => setActiveTab("about")}>
                    About
                  </Tab>
                  <Tab color={"#F9F9F9"} onClick={() => setActiveTab("repos")}>
                    Repositories
                  </Tab>
                  <Tab color={"#F9F9F9"} onClick={() => setActiveTab("apps")}>
                    Apps
                  </Tab>
                </TabList>
                <TabIndicator
                  mt="-1.5px"
                  height="2px"
                  bg="#FF5C00"
                  borderRadius="1px"
                />
              </Tabs>
              {RenderTabs[activeTab]?.component || <Developing />}
            </Box>
          </Stack>
        </Box>
      </main>
    </>
  );
}
