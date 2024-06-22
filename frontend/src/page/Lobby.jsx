import React, { useState } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../css/CustomStyles.jsx";
import { LobbyMdList } from "./LobbyMdList.jsx";
import { LobbyPlaceList } from "./LobbyPlaceList.jsx";

function Lobby() {


  return (
    <Box>
      <Center my={6}>
        <Flex>
          <LobbyPlaceList />
        </Flex>
      </Center>
      <Box fontSize="3xl" pl={40}>
        MD 추천 Pick
      </Box>
      <LobbyMdList />
      <Box fontSize="3xl" pl={80}>
        회원 인기글
      </Box>
      <Flex direction={"column"} align={"center"} my={6}>
        <Box {...GuideLineMediumBanner}></Box>
        <Box {...GuideLineMediumBanner}></Box>
        <Box {...GuideLineMediumBanner}></Box>
      </Flex>
      {/* TODO 다크/라이트 모드 추가 필요 */}
    </Box>
  );
}

export default Lobby;
