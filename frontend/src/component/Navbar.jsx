import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex
      align={"center"}
      justify={"space-between"}
      px={6}
      mb={6}
      border={"red dotted 1px"}
      height={20}
    >
      <Flex gap={3} onClick={() => navigate("/")} cursor={"pointer"}>
        <Box>로고</Box>
        <Box>홈페이지 제목</Box>
      </Flex>
      <Center gap={12}>
        <Box>MD Pick</Box>
        <Box onClick={() => navigate("/post/list")} cursor={"pointer"}>
          회원 게시판
        </Box>
      </Center>
      <Flex gap={3}>
        <Box>회원가입/목록</Box>
        <Box>로그인/아웃</Box>
        <Center onClick={() => navigate("/memberinfo")} cursor={"pointer"}>
          프로필
        </Center>
        <Box
          onClick={() => {
            navigate("/comment");
          }}
          cursor={"pointer"}
        >
          댓글연습
        </Box>
      </Flex>
    </Flex>
  );
}

export default Navbar;
