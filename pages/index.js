import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  ChakraProvider,
  HStack,
  Center,
  SimpleGrid
} from "@chakra-ui/react";
import { Heading, Button, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { motion, useRef } from "framer-motion";
import React from "react";
import { TypeAnimation } from 'react-type-animation';
import BoxIcons from "../components/BoxIcons";
import Hello from "../components/hello";
import AllPosts from "../components/AllPosts";


export default function Home() {
  var description =
    "I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"


  
  return (
    <ChakraProvider>
      <Head>
        <title>Hello I'm Dário Jr</title>
        <meta
          name="description"
          content={description}
        />
        <link
          rel="icon"
          href="https://avatars.githubusercontent.com/u/53487868?v=4"
        />
      </Head>

      <nav className={styles.nav}></nav>

      <main className={styles.main}>
      <SimpleGrid columns={[1, null, 2]}  spacing={'9px'}>
      <Hello/>
      <AllPosts></AllPosts>

      </SimpleGrid>
       
       
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
