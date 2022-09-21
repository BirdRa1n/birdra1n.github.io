import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  ChakraProvider,
  HStack,
  Center,
  Box,
  Divider
} from "@chakra-ui/react";
import { Heading, Button, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { motion, useRef } from "framer-motion";
import React from "react";
import { TypeAnimation } from 'react-type-animation';
import BoxIcons from "./BoxIcons";

var description =
"I'm Dário, a young programmer who loves to learn new things. I am passionate about technology and programming!"

export default function Hello(){
    return(
        <Box marginTop={10}  className={styles.boxhello}>
          <Center flexDirection={'column'} >
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
          speed={140}
            sequence={[
              description,
              100
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            className={styles.description}
          />
          <Divider marginTop={3}></Divider>
          <Center>
          <BoxIcons></BoxIcons>
          </Center>
          







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
            onClick={() => alert('Developing')}
          >
            See my work
          </Button>
        </motion.div>
        </Center>
        
        </Box>
    )
}