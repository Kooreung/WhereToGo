import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { LobbyMdList } from "../component/Lobby/LobbyMdList.jsx";
import { LobbyPlaceList } from "../component/Lobby/LobbyPlaceList.jsx";
import LobbyListOfBest from "../component/Lobby/LobbyListOfBest.jsx";
import HeadingMedium from "../css/Heading/HeadingMedium.jsx";

function Lobby() {
  return (
    <Box w={{ base: "720px", sm: "600px", lg: "960px" }}>
      <Box py={"2rem"}>
        <HeadingMedium pl={"2rem"} pb={"1rem"}>
          장소 선택
        </HeadingMedium>
        <LobbyPlaceList />
      </Box>

      <Box border={"1px dotted red"}>
        <HeadingMedium pl={"2rem"} py={"1rem"}>
          MD 추천 Pick
        </HeadingMedium>
        <LobbyMdList />
      </Box>

      <Box border={"1px dotted red"}>
        <HeadingMedium>회원 인기글</HeadingMedium>
        <Flex direction={"column"} align={"center"}>
          <Box>
            <LobbyListOfBest />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Lobby;
