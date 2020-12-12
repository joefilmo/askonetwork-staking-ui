import React from 'react';
import { Text, Box, Link } from "@chakra-ui/core"
import addresses from "../contracts/addresses";

export default function Footer() {

  return (
    <>
      <Box w="100%" minH="100px" bg="gray.800" color="gray.200" position="relative"  p="20px" pt="80px" textAlign="center" fontSize={{base:"sm", md:"md"}} >
        <Box width="90vw" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
      </Box>
      
      <Box w="100%" minH="100px" pb="80px" bg="gray.800" color="gray.700" position="relative"  textAlign="center" >
        © Asko. All rights reserved.
      </Box>
    </>
  );
}
