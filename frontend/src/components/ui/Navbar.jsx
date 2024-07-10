import React, {useContext, useEffect, useState} from "react";
import {
  Box, Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Text,
  useColorMode,
  useColorModeValue, useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {LoginContext, useAuth} from "./LoginProvider.jsx";
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
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import ChatWebSocket from "./Chat/ChatWebSocket.jsx";

function Navbar() {
  const [roominfo,setRoomInfo]=useState([]);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const [showChat, setShowChat] = useState(false); // 채팅창 표시 상태를 추가합니다.
  const { isAdmin } = useAuth();

  useEffect(() => {

    //문제: account.isAdmin의 값이 useEffect 훅에서 즉시 반영되지 않는 문제가 있습니다. 이는 LoginProvider에서 상태가 비동기적으로 설정되기 때문에 발생할 수 있습니다. 즉, LoginProvider가 완전히 설정되기 전에 useEffect가 실행되어 isAdmin 값이 아직 최신 상태가 아닐 수 있습니다.
    //
    // 해결 방법: const { isAdmin } = useAuth();를 사용하여 useAuth 커스텀 훅을 만들고 사용합니다. 이 훅은 LoginProvider가 완전히 설정된 후에 호출되며, 이미 설정된 isAdmin 값을 바로 가져와서 사용할 수 있습니다. useAuth 훅은 LoginContext의 현재 값을 반환하므로, LoginProvider 내에서 정의된 모든 상태와 메서드에 즉시 접근할 수 있습니다. 이를 통해 isAdmin 값이 항상 최신 상태로 유지되며, 컴포넌트의 렌더링이 완료된 후에도 정확한 권한 확인이 가능해집니다.
    //
    // 이렇게 useAuth 훅을 사용함으로써, 로그인 상태와 관련된 문제를 해결하고, 컴포넌트 내에서 로그인 상태를 더욱 효과적으로 관리할 수 있습니다
    if (!isAdmin) {// 관리자가 아닐 때만 API 요청을 보냅니다.
      console.log("나 어드민인데")
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) { // 토큰이 존재할 때만 API 요청을 보냅니다.
        const decodedToken = jwtDecode(accessToken);
        axios.post(`/api/chatroom/${decodedToken.sub}`).then((res)=>{
          setRoomInfo(res.data);
        })
      }
    }
  }, []);


  const navColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  function openChat(){
    if(showChat === true){
      setShowChat(false);
    }else {
      setShowChat(true);
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
                    <Text onClick={() => navigate("/chatList")}
                          cursor={"pointer"}>
                      문의채팅 리스트
                    </Text>

                    <Text onClick={() => navigate("/memberAdminPage")}
                          cursor={"pointer"}>
                      관리자 메뉴
                    </Text>
                  </Center
                    >
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
      {!isAdmin && ( // 관리자가 아닐 때만 고정 상자를 표시합니다.
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
          >
          </Box>
      )}
      {showChat && (
          <Box
              position="fixed"
              bottom="120px"
              right="10px"
              w="300px"
              h="400px"
              bgColor="white"
              border="1px solid #ccc"
              p="10px"
              zIndex={3}
          >
            <ChatWebSocket roomInfo={roominfo}/> {/* 채팅 컴포넌트를 상자에 추가합니다. */}
          </Box>
      )}
    </Box>
  );
}

export default Navbar;
