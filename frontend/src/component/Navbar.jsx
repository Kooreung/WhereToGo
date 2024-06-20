import React, { useContext } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex
        w={{ base: "1080px", lg: "1440px" }}
        h={"96px"}
        px={6}
        mt={"4rem"}
        mb={"4rem"}
        align={"center"}
        justify={"space-between"}
        border={"red dotted 1px"}
      >
        <Flex gap={3} onClick={() => navigate("/")} cursor={"pointer"}>
          <Box>로고</Box>
          <Box>홈페이지 제목</Box>
        </Flex>
        <Center gap={12}>
          <Box onClick={() => navigate("/post/mdList")} cursor={"pointer"}>
            MD Pick
          </Box>
          <Box onClick={() => navigate("/post/list")} cursor={"pointer"}>
            회원 게시판
          </Box>
        </Center>
        <Flex gap={3}>
          {account.isLoggedIn() || (
            <Center onClick={() => navigate("/signup")} cursor={"pointer"}>
              회원가입
            </Center>
          )}
          {account.isLoggedIn() || (
            <Center onClick={() => navigate("/login")} cursor={"pointer"}>
              로그인
            </Center>
          )}
          {account.isLoggedIn() && (
            <Center
              onClick={() => {
                account.logout();
                navigate("/");
              }}
              cursor={"pointer"}
            >
              로그아웃
            </Center>
          )}
          {account.isAdmin() && (
            <Box onClick={() => navigate("/memberList")} cursor={"pointer"}>
              admin 페이지
            </Box>
          )}

          {account.isLoggedIn() && (
            <Center onClick={() => navigate("/memberinfo")} cursor={"pointer"}>
              프로필
            </Center>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Navbar;
