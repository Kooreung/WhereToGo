import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { LobbyMdList } from "../component/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../component/Lobby/LobbyPlaceList.jsx";
import LobbyPostListOfBest from "../component/Lobby/LobbyPostListOfBest.jsx";

function Lobby() {
  return (
    <Flex
      w={{ base: "720px", lg: "960px", sm: "720px" }}
      direction={"column"}
      alignItems={"center"}
      justify={"center"}
    >
      <Box
        w={{ base: "720px", lg: "800px", sm: "580px" }}
        h={{ base: "240px", lg: "240px", sm: "200px" }}
      >
        <LobbyPlaceList />
      </Box>

      <Box
        w={{ base: "720px", lg: "960px", sm: "720px" }}
        h={{ base: "240px", lg: "280px", sm: "240px" }}
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
