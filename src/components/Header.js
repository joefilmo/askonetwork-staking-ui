import React from 'react';
import { Text, Box, Flex, Image, Heading, Button } from "@chakra-ui/core"
import Blockie from "./Blockie"

export default function Header({web3, address, onConnect}) {

  return (
    <>
    <Box w="100%" h="auto">
      <Box float={{base:"none",sm:"right"}} ml={{base:"auto",sm:"initial"}} display="block" position="relative" textAlign="right">
        { (web3 && address) ?
          (<>
            <Box display="inline-block" >
              <Blockie address={address} size={40} />
            </Box>
            <Text fontSize="xs">{address.substring(0, 6)}</Text>
          </>) :
          (
            <Button variant="solid" bg="asko.accentButton" display="inline-block" ml="auto" mr="0px"
            borderRadius="30px" fontWeight="regular" fontSize="21px"
            height="60px" width={["120px","200px","200px","200px"]} color="white"
            onClick={onConnect}>
              Connect
            </Button>
          )
        }
      </Box>
      <Box w="100%" mt={["20px","0px","0px","0px"]} mb={["20px","0px","0px","0px"]}>
        <Image src="/logo.png" alt="Askobar Logo" display="inline-block" mt="0px" mr={["10px","20px","20px","20px"]} mb={["7px","24px","24px","24px"]} w={["40px","50px","50px","50px"]} h="auto" />
        <Heading as="h1" mt="0px" fontFamily="Roboto" display="inline-block" fontSize={["28px","48px","48px","48px"]} >Asko Staking</Heading>
      </Box>
      <Text fontSize={{base:"12px", sm:"16px"}} mt="-10px" mb="10px" textAlign="left" width="100%" color="asko.fgMed">
        v1.0.2b
      </Text>
    </Box>
    </>
  );
}
