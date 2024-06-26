import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  useColorMode,
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
  return (
    <Flex alignItems="center" justifyContent="center" w={"100%"}>
      <Flex
        w={{ base: "960px", lg: "1024px", xl: "1080px" }}
        h={"96px"}
        px={6}
        mt={"4rem"}
        mb={"4rem"}
        align={"center"}
        justify={"space-between"}
        boxShadow={"md"}
        rounded={"md"}
        boxSizing={"border-box"}
        bg={"#D8B7E5"}
      >
        {/* 로고 */}
        <Box
          onClick={() => navigate("/")}
          cursor={"pointer"}
          w={"160px"}
          h={"160px"}
        >
          <Image src={homeLogo} />
        </Box>

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
            <Center onClick={() => navigate("/memberList")} cursor={"pointer"}>
              관리 페이지
            </Center>
          )}

          {account.isLoggedIn() && (
            <Center onClick={() => navigate("/memberinfo")} cursor={"pointer"}>
              프로필
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
    </Flex>
  );
}

export default Navbar;
