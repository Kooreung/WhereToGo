import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { LobbyMdList } from "../component/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../component/Lobby/LobbyPlaceList.jsx";
import LobbyPostListOfBest from "../component/Lobby/LobbyPostListOfBest.jsx";
import HeadingMedium from "../css/Heading/HeadingMedium.jsx";

function Lobby() {
  return (
    <Box w={{ base: "720px", sm: "630px", lg: "990px" }}>
      <Box py={{ base: "3rem", sm: "1rem", lg: "3rem" }}>
        <HeadingMedium
          pl={{ base: "2rem", sm: "1rem", lg: "2rem" }}
          pb={"1rem"}
        >
          장소 선택
        </HeadingMedium>
        <Box>
          <LobbyPlaceList />
        </Box>
      </Box>

      <Box py={{ base: "3rem", sm: "1rem", lg: "3rem" }}>
        <HeadingMedium
          pl={{ base: "2rem", sm: "1rem", lg: "2rem" }}
          pb={"1rem"}
        >
          MD 추천 Pick
        </HeadingMedium>
        <LobbyMdList />
      </Box>

      <Box py={{ base: "3rem", sm: "1rem", lg: "3rem" }}>
        <HeadingMedium
          pl={{ base: "2rem", sm: "1rem", lg: "2rem" }}
          pb={"1rem"}
        >
          회원 인기글
        </HeadingMedium>
        <Flex direction={"column"} align={"center"}>
          <Box w={{ base: "720px", sm: "600px", lg: "720px" }}>
            <LobbyPostListOfBest />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Lobby;
