import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navColor = useColorModeValue("#D8B7E5", "#836091");
  return (
    <Flex
      w={"100%"}
      h={"100px"}
      px={"1rem"}
      mt={"4rem"}
      align={"center"}
      justify={"space-between"}
      boxShadow={"md"}
      roundedTop={"1rem"}
      boxSizing={"border-box"}
      bg={navColor}
    >
      {/* 중간 메뉴 */}
      <Flex gap={12}>
        <Box onClick={() => navigate("/post/mdList")} cursor={"pointer"}>
          MD Pick
        </Box>
        <Box onClick={() => navigate("/post/list")} cursor={"pointer"}>
          회원 게시판
        </Box>
      </Flex>

      {/* 회원 메뉴 */}
      <Flex gap={3}>
        {account.isAdmin() && (
          <Center onClick={() => navigate("/memberList")} cursor={"pointer"}>
            관리 페이지
          </Center>
        )}
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
          <Center onClick={() => navigate("/memberinfo")} cursor={"pointer"}>
            프로필
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
        <Button onClick={toggleColorMode}>
          {" "}
          {colorMode === "light" ? (
            <FontAwesomeIcon icon={faMoon} />
          ) : (
            <FontAwesomeIcon icon={faSun} />
          )}
        </Button>
      </Flex>
    </Flex>
  );
}

export default Footer;
