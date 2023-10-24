import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Box, Grid, GridItem, Stack, Center, Image, Heading, Text, VStack, Divider, HStack, Flex, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

import { LuMail, LuCalendarRange, LuGlobe } from "react-icons/lu";
import { FaCode, FaFacebookF, FaInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { MdPhonelink } from "react-icons/md";

const About = () => {
    return (<>
        <VStack spacing={2} marginTop={10} marginBottom={10}>
            <Text color={"#D5D5D5"}>{`Greetings! I'm a technology enthusiast and a developer with experience in both front-end and back-end development. My focus is on creating exceptional digital solutions and enhancing the user experience.`}</Text>

            <Text color={"#D5D5D5"} >
                Proficient in various languages and technologies, including TypeScript, JavaScript, Python, HTML5, and CSS, I am dedicated to developing high-performance and functional web and mobile applications. My skills in React Native and React enable me to create quality cross-platform native applications.

            </Text>
        </VStack>

        <Heading fontSize={"2xl"} color={"#F9F9F9"} marginBottom={9}>{`What I'm Doing`}</Heading>

        <Stack direction={['column', null, 'row']} >

            <Box w={["100%", null, "50%"]} bg={"#222223"} borderRadius={14} p={10}>


                <HStack spacing={5} alignItems='flex-start'>
                    <Text fontSize={["xl", null, 65]} display={["none", null, "flex"]}>

                        <FaCode color="#ff5c00" />
                    </Text>
                    <VStack alignItems='flex-start'>
                        <Heading fontSize={"lg"} color={"#FAFAFA"}>Web Design</Heading>
                        <Text color={"#D6D6D6"}>
                            O design mais moderno e de alta qualidade feito a nível profissional.
                        </Text>
                    </VStack>

                </HStack>
            </Box>

            <Box w={["100%", null, "50%"]} bg={"#222223"} borderRadius={14} p={10}>


                <HStack spacing={5} alignItems='flex-start'>
                    <Text fontSize={["xl", null, 65]} display={["none", null, "flex"]}>
                        <MdPhonelink color="#ff5c00" />
                    </Text>
                    <VStack alignItems='flex-start'>
                        <Heading fontSize={"lg"} color={"#FAFAFA"}>Mobile & Desktop Apps</Heading>
                        <Text color={"#D6D6D6"}>
                            Professional development of applications for iOS and Android.
                        </Text>
                    </VStack>

                </HStack>
            </Box>


        </Stack>
    </>)
}

export default About;