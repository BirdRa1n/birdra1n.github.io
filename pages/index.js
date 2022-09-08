import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  ChakraProvider,
  HStack,
} from "@chakra-ui/react";
import { Heading, Button, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { motion, useRef } from "framer-motion";
import React from "react";
import { TypeAnimation } from 'react-type-animation';



export default function Home() {
  var description =
    "I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
  return (
    <ChakraProvider>
      <Head>
        <title>Hello I'm Dário Jr</title>
        <meta
          name="description"
          content="I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"
        />
        <link
          rel="icon"
          href="https://avatars.githubusercontent.com/u/53487868?v=4"
        />
      </Head>

      <div className={styles.nav}></div>

      <main className={styles.main}>

        <div className={styles.hello_div}>
          <HStack>

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

            <motion.div
              drag
            >
              <motion.div
                initial='hidden'
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
                <img
                  width={40}
                  src="https://images2.imgbox.com/bf/61/jhyKvIs2_o.gif"
                  alt="Avatar"
                ></img>{" "}
              </motion.div>
            </motion.div>

          </HStack>
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





          <TypeAnimation
            sequence={[
              description,
              10000, // Waits 1s
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            className={styles.description}
          />







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
            colorScheme="orange"
            size="sm"
            bgColor={"#F7C112"}
            className={styles.btn_hello}
            onClick={() => window.location.replace('/MyJobs')}
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
