import Lottie from "lottie-react";
import groovyWalkAnimation from "@/data/assets/lottie/developing.json";
import { Box, Center, Heading, VStack } from "@chakra-ui/react";

export default function Developing() {
    return (<>
        <Center h={"80%"}>
            <VStack>
                <Box w={300} h={300}>
                    <Lottie animationData={groovyWalkAnimation} />
                </Box>
                <Center>
                    <Heading fontSize={"lg"} color={"#FFFFFF"}>building...</Heading>

                </Center>
            </VStack>
        </Center></>)
}