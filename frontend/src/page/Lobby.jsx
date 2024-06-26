import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { LobbyMdList } from "../component/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../component/Lobby/LobbyPlaceList.jsx";
import LobbyPostListOfBest from "../component/Lobby/LobbyPostListOfBest.jsx";

function Lobby() {
  return (
    <Flex
      w={{ base: "720px", sm: "630px", lg: "990px" }}
      direction={"column"}
      alignItems={"center"}
      justify={"center"}
    >
      <Box
        py={{ base: "2rem", sm: "1rem", lg: "2rem" }}
        w={{ base: "720px", sm: "750px", lg: "870px" }}
      >
        <LobbyPlaceList />
      </Box>

      <Box py={{ base: "2rem", sm: "1rem", lg: "2rem" }}>
        <LobbyMdList />
      </Box>

      <Box
        py={{ base: "2rem", sm: "1rem", lg: "2rem" }}
        w={{ base: "720px", sm: "720px", lg: "720px" }}
      >
        <LobbyPostListOfBest />
      </Box>
    </Flex>
  );
}

export default Lobby;
