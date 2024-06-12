import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import {
  GuideLineLargeBanner,
  GuideLineMediumBanner,
} from "../css/CustomStyles.jsx";

function Lobby() {
  return (
    <Box>
      <Center my={6}>
        <Flex {...GuideLineMediumBanner}>원형 메뉴</Flex>
      </Center>
      <Box fontSize="3xl" pl={40}>
        MD 추천 Pick
      </Box>
      <Flex direction={"column"} align={"center"} my={6}>
        <Flex {...GuideLineLargeBanner}>MD 메뉴</Flex>
      </Flex>
      <Box fontSize="3xl" pl={80}>
        회원 인기글
      </Box>
      <Flex direction={"column"} align={"center"} my={6}>
        <Box {...GuideLineMediumBanner}></Box>
        <Box {...GuideLineMediumBanner}></Box>
        <Box {...GuideLineMediumBanner}></Box>
      </Flex>
    </Box>
  );
}

export default Lobby;
