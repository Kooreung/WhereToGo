import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { LobbyMdList } from "../../components/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../../components/Lobby/LobbyPlaceList.jsx";
import LobbyPostListOfBest from "../../components/Lobby/LobbyPostListOfBest.jsx";

function Lobby() {
  return (
    <Flex
      w={{ base: "720px", lg: "960px", sm: "720px" }}
      direction={"column"}
      alignItems={"center"}
      justify={"center"}
    >
      <Box>
        <LobbyPlaceList />
      </Box>

      <Box
        w={{ base: "720px", lg: "960px", sm: "720px" }}
        my={{ base: "32px", lg: "32px", sm: "24px" }}
      >
        <LobbyMdList />
      </Box>

      <Box w={{ base: "720px", lg: "720px", sm: "540px" }}>
        <LobbyPostListOfBest />
      </Box>
    </Flex>
  );
}

export default Lobby;
