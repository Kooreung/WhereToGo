import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import homeLogo from "../resource/img/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navColor = useColorModeValue("#D8B7E5", "#836091");
  return (
    <Flex
      w={"100%"}
      h={"100px"}
      px={"1rem"}
      mb={"4rem"}
      align={"center"}
      roundedBottom={"1rem"}
      boxShadow={"md"}
      boxSizing={"border-box"}
      bg={navColor}
    >
      <Grid
        templateColumns={"1fr 1fr 1fr"}
        w={"100%"}
        border={"1px dotted red"}
      >
        <GridItem border={"1px dotted red"}>
          {/* 로고 */}
          <Box
            onClick={() => navigate("/")}
            cursor={"pointer"}
            w={"100px"}
            h={"100px"}
          >
            <Image src={homeLogo} />
          </Box>
        </GridItem>
        <GridItem border={"1px dotted red"}>
          {/* 중간 메뉴 */}
          <Flex gap={12} align={"center"} justifyContent={"center"} h={"100%"}>
            <Box onClick={() => navigate("/post/mdList")} cursor={"pointer"}>
              MD Pick
            </Box>
            <Box onClick={() => navigate("/post/list")} cursor={"pointer"}>
              회원 게시판
            </Box>
          </Flex>
        </GridItem>
        <GridItem border={"1px dotted red"}>
          {/* 회원 메뉴 */}
          <Flex
            align={"center"}
            w={"100%"}
            h={"100%"}
            justify={"end"}
            gap={{ base: "1rem", lg: "1rem", sm: "8px" }}
          >
            {account.isAdmin() && (
              <Center
                onClick={() => navigate("/memberList")}
                cursor={"pointer"}
              >
                회원&배너 관리
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
              <Center
                onClick={() => navigate("/memberinfo")}
                cursor={"pointer"}
              >
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
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default Navbar;
