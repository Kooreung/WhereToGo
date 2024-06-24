import React from "react";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { LobbyMdList } from "../component/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../component/Lobby/LobbyPlaceList.jsx";
import LobbyListOfBest from "../component/Lobby/LobbyListOfBest.jsx";

function Lobby() {
  return (
    <Flex
      w={{ base: "960px", lg: "1024px", xl: "1080px" }}
      direction={"column"}
      alignItems={"center"}
      justify={"center"}
    >
      <Center>
        <LobbyPlaceList />
      </Center>
      <Box>
        <Heading>MD 추천 Pick</Heading>
      </Box>

      <LobbyMdList />

      <Box>
        <Heading>회원 인기글</Heading>
      </Box>

      <Flex direction={"column"} align={"center"} my={6}>
        <Box>
          <LobbyListOfBest />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Lobby;
