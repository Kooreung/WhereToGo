import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex
        w={{ base: "1080px", lg: "1440px" }}
        h={"96px"}
        px={6}
        mt={"64px"}
        mb={"32px"}
        align={"center"}
        justify={"space-between"}
        border={"red dotted 1px"}
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
          <Center onClick={() => navigate("/signup")} cursor={"pointer"}>
            회원가입
          </Center>
          <Center onClick={() => navigate("/login")} cursor={"pointer"}>
            로그인
          </Center>
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
    </Flex>
  );
}

export default Navbar;
