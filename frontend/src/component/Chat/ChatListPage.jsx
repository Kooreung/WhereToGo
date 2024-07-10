import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import ChatWebSocket from "./ChatWebSocket.jsx";
import { LoginContext } from "../../components/ui/LoginProvider.jsx"; // 채팅 컴포넌트를 import 합니다.

// 채팅 컴포넌트를 import 합니다.

export function ChatListPage() {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const account = useContext(LoginContext);
  const isAdmin = account.isAdmin();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    console.log(account.isAdmin());
    console.log(isAdmin);
  }, []);

  useEffect(() => {
    axios.get("/api/chatroom").then((res) => {
      setChatList(res.data);
      console.log(res.data);
    });
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUser({
        memberId: decodedToken.sub,
        memberNickName: decodedToken.nickName,
      });
    }
  }, []);

  function openChat(chat) {
    setSelectedChat({
      ...chat,
      memberId: user.memberId,
      memberNickName: user.memberNickName,
    });
    setShowChat(true);
  }
  function chatWindowControl() {
    if (showChat === true) {
      setShowChat(false);
    } else {
      setShowChat(true);
    }
  }

  return (
    <Flex w={"100%"} justify={"start"} px={"1rem"}>
      <Box>
        {/* 채팅 리스트를 나열합니다. */}
        {chatList.map((chat) => (
          <Box
            w="200px"
            key={chat.chatRoomId}
            border="1px solid"
            p="1rem"
            cursor="pointer"
            onClick={() => openChat(chat)}
          >
            {chat.memberNickName}
          </Box>
        ))}
      </Box>
      {showChat && (
        <Box
          position="fixed"
          // bottom="120px"
          left="15%"
          w="1000px"
          h="483px"
          bgColor="white"
          border="1px solid #ccc"
          p="10px"
          zIndex={3}
        >
          {selectedChat && <ChatWebSocket roomInfo={selectedChat} />}
          {/* 채팅 컴포넌트를 상자에 추가합니다. */}
        </Box>
      )}
    </Flex>
  );
}

export default ChatListPage;
