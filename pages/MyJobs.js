import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import projects from "../styles/Projects.module.css";
import {
    ChakraProvider,
    HStack,

} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";

import React from "react";
import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@chakra-ui/react";


//components
import AllPosts from "../components/AllPosts";
import BoxIcons from "../components/BoxIcons";

export default function MyJobs() {

    return (
        <ChakraProvider>
            <Head>
                <title>{"I'm Dário Jr"}</title>
                <meta
                    name="description"

                    content="I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
                />
                <link
                    rel="icon"
                    href="https://images2.imgbox.com/bf/61/jhyKvIs2_o.gif"
                />
                <meta prefix="og: http://birdra1n.github.io" />
                <meta property="og:image" content={"https://images2.imgbox.com/bf/61/jhyKvIs2_o.gif"} />

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
                        <BoxIcons />
                    </HStack>



                    <Tabs colorScheme={'#FFCB26'}>
                        <TabList color={'#FFC200'} >
                            <Tab color={'#FFC200'} >All</Tab>
                            <Tab>Finished releases</Tab>
                            <Tab>Beta releases</Tab>
                        </TabList>
                        <TabPanels >
                            <TabPanel >
                                <AllPosts></AllPosts>
                            </TabPanel>
                            <TabPanel h={'xl'}>

                            </TabPanel>
                            <TabPanel h={'xl'}>

                            </TabPanel>
                        </TabPanels>


                    </Tabs>


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
    )
}