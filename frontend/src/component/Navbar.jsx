import React, { useContext } from "react";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faSun,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import homeLogo from "../resource/img/logo.png";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";

function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navColor = useColorModeValue("#D8B7E5", "#836091");
  const hColor = useColorModeValue("beige", "#2D3748");

  return (
    <Box w={"100%"} mb={"4rem"}>
      <Box h={"120px"} px={"1rem"}>
        <Grid templateColumns={"1fr 1fr 1fr"} w={"100%"}>
          <GridItem />
          <GridItem align={"center"}>
            {/* 로고 */}
            <Flex
              onClick={() => navigate("/")}
              cursor={"pointer"}
              alignItems={"center"}
              w={"200px"}
              h={"120px"}
            >
              <Image src={homeLogo} />
            </Flex>
          </GridItem>
          <GridItem>
            {/* 회원 메뉴 */}
            <Flex
              align={"center"}
              w={"100%"}
              h={"100%"}
              justify={"end"}
              color={navColor}
            >
              <Flex gap={{ base: "1.5rem", lg: "1.5rem", sm: "1rem" }}>
                {account.isAdmin() && (
                  <Center
                    onClick={() => navigate("/memberAdminPage")}
                    cursor={"pointer"}
                  >
                    관리자 메뉴
                  </Center>
                )}
                {account.isLoggedIn() || (
                  <Center
                    onClick={() => navigate("/signup")}
                    cursor={"pointer"}
                  >
                    <FontAwesomeIcon icon={faUserPlus} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      회원가입
                    </Text>
                  </Center>
                )}
                {account.isLoggedIn() || (
                  <Center onClick={() => navigate("/login")} cursor={"pointer"}>
                    <FontAwesomeIcon icon={faRightToBracket} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      로그인
                    </Text>
                  </Center>
                )}
                {account.isLoggedIn() && (
                  <Center
                    onClick={() => navigate("/memberinfo")}
                    cursor={"pointer"}
                  >
                    <FontAwesomeIcon icon={faAddressCard} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      프로필
                    </Text>
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
                    <FontAwesomeIcon icon={faRightFromBracket} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      로그아웃
                    </Text>
                  </Center>
                )}
                <Center
                  onClick={toggleColorMode}
                  cursor={"pointer"}
                  fontSize={"xl"}
                >
                  {colorMode === "light" ? (
                    <FontAwesomeIcon icon={faMoon} />
                  ) : (
                    <FontAwesomeIcon icon={faSun} />
                  )}
                </Center>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
      <Box
        h={"50px"}
        boxShadow={"md"}
        boxSizing={"border-box"}
        borderY={"2px solid"}
        borderColor={navColor}
      >
        {/* 중간 메뉴 */}
        <Flex gap={"2rem"} justify={"center"} h={"100%"} fontSize={"18px"}>
          <Center
            onClick={() => navigate("/post/mdList")}
            cursor={"pointer"}
            px={"1rem"}
            borderBottom={"3px solid transparent"}
            sx={{
              transition: "border-color 0.3s ease",
              "&:hover": {
                borderBottom: `3px solid ${navColor}`,
              },
            }}
          >
            MD'S Pick
          </Center>
          <Center
            onClick={() => navigate("/post/list")}
            cursor={"pointer"}
            px={"1rem"}
            borderBottom={"3px solid transparent"}
            sx={{
              transition: "border-color 0.3s ease",
              "&:hover": {
                borderBottom: `3px solid ${navColor}`,
              },
            }}
          >
            회원 게시판
          </Center>
        </Flex>
      </Box>
    </Box>
  );
}

export default Navbar;
