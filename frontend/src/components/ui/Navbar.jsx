import React, { useContext, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faSun,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import homeLogo from "../../assets/img/logo.png";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import ChatWebSocket from "../Chat/ChatWebSocket.jsx";
import { LoginContext } from "./LoginProvider.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [showChat, setShowChat] = useState(false); //
  const account = useContext(LoginContext);
  const [roominfo, setRoomInfo] = useState([]);

  const navColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  function openChat() {
    console.log("나 어드민인데");
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // 토큰이 존재할 때만 API 요청을 보냅니다.
      const decodedToken = jwtDecode(accessToken);
      axios
        .post(`/api/chatroom/${decodedToken.sub}`)
        .then((res) => {
          setRoomInfo(res.data);
        })
        .finally(() => {
          if (showChat === true) {
            setShowChat(false);
          } else {
            setShowChat(true);
          }
        });
    }
  }

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
                  <Center>
                    <Text
                      onClick={() => navigate("/chatList")}
                      cursor={"pointer"}
                    >
                      문의채팅 리스트
                    </Text>

                    <Text
                      onClick={() => navigate("/memberAdminPage")}
                      cursor={"pointer"}
                    >
                      관리자 메뉴
                    </Text>
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
        borderBottom={"2px solid"}
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
      {!account.isAdmin() && ( // 관리자가 아닐 때만 고정 상자를 표시합니다.
        <Box
          position="fixed"
          bottom="10"
          right="10"
          w="100px" // 'width' 대신 'w'를 사용합니다.
          h="100px" // 'height' 대신 'h'를 사용합니다.
          bgColor="#f9f9f9" // 'background-color' 대신 'bgColor'를 사용합니다.
          border="1px solid #ccc" // 오타 수정: 'soild' -> 'solid'
          p="10px" // 'padding' 대신 'p'를 사용합니다.
          zIndex={2}
          cursor={"pointer"}
          onClick={openChat}
        ></Box>
      )}
      {showChat && (
        <Box
          position="fixed"
          bottom="120px"
          right="10px"
          w="300px"
          h="483px"
          bgColor="white"
          border="1px solid #ccc"
          p="10px"
          zIndex={3}
        >
          <ChatWebSocket roomInfo={roominfo} />{" "}
          {/* 채팅 컴포넌트를 상자에 추가합니다. */}
        </Box>
      )}
    </Box>
  );
}

export default Navbar;
