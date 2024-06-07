import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { GuideLine } from "../App.jsx";

function Lobby() {
  return (
    <Box>
      <Center>
        <Flex {...GuideLine}>원형 메뉴</Flex>
      </Center>
      <Flex>
        <Box fontSize="3xl">MD 추천 Pick</Box>
        <Flex {...GuideLine}>MD 메뉴</Flex>
      </Flex>
    </Box>
  );
}

export default Lobby;
