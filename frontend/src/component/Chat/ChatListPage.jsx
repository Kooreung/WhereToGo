import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, GridItem } from "@chakra-ui/react";
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

  return (
    <Grid templateColumns="200px auto" gap={8}>
      <GridItem>
        {/* 채팅 리스트를 나열합니다. */}
        {chatList.map((chat) => (
          <Box
            key={chat.chatRoomId}
            border="1px solid"
            p="1rem"
            cursor="pointer"
            onClick={() => {
              setSelectedChat({
                ...chat,
                memberId: user.memberId,
                memberNickName: user.memberNickName,
              });
            }}
          >
            {chat.memberNickName}
          </Box>
        ))}
      </GridItem>
      <GridItem>
        {selectedChat && <ChatWebSocket roomInfo={selectedChat} />}
      </GridItem>
    </Grid>
  );
}

export default ChatListPage;
