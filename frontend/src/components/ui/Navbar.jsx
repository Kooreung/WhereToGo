import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faSun,
  faUserPlus,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { faAddressCard, faMessage } from "@fortawesome/free-regular-svg-icons";
import { CloseIcon } from "@chakra-ui/icons";
import homeLogo from "../../assets/img/logo.png";
import ChatWebSocket from "../Chat/ChatWebSocket.jsx";
import { LoginContext } from "./LoginProvider.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNotifications } from "../Chat/NotificationProvider.jsx";

function Navbar() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false); //
  const {} = useNotifications();
  const [roominfo, setRoomInfo] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const [newMessage, setNewMessage] = useState(false);
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const navColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  useEffect(() => {
    // notifications 배열의 변화를 감지합니다.
    notifications.forEach((notification) => {
      // AdminChatList에서 해당 notification.userId와 일치하는 chatRoomId를 찾습니다.
      if (notification.senderId > 0) {
        setNewMessage(true);
      }
    });
  }, [notifications]); // notifications 배열이 변경될 때마다 이 효과를 실행합니다.

  function openChat() {
    removeNotification();
    setNewMessage(false);
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
                  <Center
                    onClick={() => navigate("/chatList")}
                    cursor={"pointer"}
                  >
                    <FontAwesomeIcon icon={faComments} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      문의채팅
                    </Text>
                  </Center>
                )}
                {account.isAdmin() && (
                  <Center
                    onClick={() => navigate("/memberAdminPage")}
                    cursor={"pointer"}
                  >
                    <FontAwesomeIcon icon={faUsersGear} size={"lg"} />
                    <Text display={{ base: "none", lg: "block" }} ml={"1"}>
                      관리메뉴
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
        <Flex
          position="fixed"
          bottom="10"
          right="10"
          zIndex={2}
          cursor={"pointer"}
          onClick={openChat}
          p={"1rem"}
          bgColor={hColor}
          borderRadius={"1rem"}
          align={"center"}
        >
          <Tooltip
            label={
              !account.isLoggedIn()
                ? "로그인 후 사용 가능합니다"
                : newMessage
                  ? "새로운 메시지가 있습니다"
                  : "1:1 문의하기"
            }
            placement="top"
            hasArrow
          >
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faMessage} color={navColor} size="xl" />
              {newMessage ? (
                <Center ml={1}>
                  <Text fontSize="1rem">새로운 메시지</Text>
                </Center>
              ) : (
                <Center fontSize="1rem" ml={1}>
                  <Text>1:1 문의</Text>
                </Center>
              )}
            </Box>
          </Tooltip>
        </Flex>
      )}
      {showChat && (
        <Box>
          <Box
            position="fixed"
            bottom="50px"
            right="50px"
            w="300px"
            h="475px"
            bgColor="white"
            border="1px solid"
            borderColor={navColor}
            zIndex={3}
          >
            <Flex
              bgColor={hColor}
              w={"2rem"}
              h={"2rem"}
              position="absolute"
              right={"1rem"}
              zIndex={4}
              alignItems={"center"}
              justify={"center"}
              cursor={"pointer"}
              transform={"scale(0.9)"}
              sx={{
                transition: "transform 0.1s ease",
                "&:hover": {
                  transform: "scale(0.95)",
                  filter: "brightness(1.5)",
                },
              }}
            >
              <CloseIcon
                color={navColor}
                w={"2rem"}
                h={"2rem"}
                onClick={() => {
                  setShowChat(false);
                }}
              />
            </Flex>
            <ChatWebSocket
              roomInfo={roominfo}
              maxHeight="400px"
              width="100%"
              autoScroll={false}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Navbar;
