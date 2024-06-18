import React, { useState } from "react";
import { Box, Button, Center, Flex, Input } from "@chakra-ui/react";
import {
  GuideLineLargeBanner,
  GuideLineMediumBanner,
} from "../css/CustomStyles.jsx";
import axios from "axios";

function Lobby() {
  const [keyword, setKeyword] = useState("");

  function crawling() {
    axios.get(`/api/web/crawling/${keyword}`).then((response) => {
      console.log(response.data);
    });
  }
  return (
    <Box>
      <Input onChange={(e) => setKeyword(e.target.value)}></Input>
      <Button onClick={crawling}>크롤링~</Button>
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
      {/* TODO 다크/라이트 모드 추가 필요 */}
    </Box>
  );
}

export default Lobby;
