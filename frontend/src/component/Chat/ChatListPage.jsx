import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Flex } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import ChatWebSocket from "./ChatWebSocket.jsx";
import { LoginContext } from "../../components/ui/LoginProvider.jsx";
import { useNotifications } from "./NotificationProvider.jsx"; // 채팅 컴포넌트를 import 합니다.

// 채팅 컴포넌트를 import 합니다.

export function ChatListPage() {
  const [noneAdminChatList, setNoneAdminChatList] = useState([]);
  const [AdminChatList, setAdminChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const account = useContext(LoginContext);
  const isAdmin = account.isAdmin();
  const [showChat, setShowChat] = useState(false);

  const { notifications, addNotification, removeNotification } =
    useNotifications();

  // 예를 들어, 새 알림을 추가하는 함수를 사용할 수 있습니다.
  const handleNewNotification = () => {
    addNotification({ id: "new", message: "새 알림 메시지" });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    if (accessToken) {
      setUser({
        memberId: decodedToken.sub,
        memberNickName: decodedToken.nickName,
      });
    }
    axios.get(`/api/chatroom/${decodedToken.sub}`).then((res) => {
      setNoneAdminChatList(res.data.noneAdminChatRoom);
      setAdminChatList(res.data.AdminChatRoom);
    });
  }, []);

  function openChat(chat) {
    setShowChat(false);
    setSelectedChat(null);
    setSelectedChat({
      ...chat,
      memberId: user.memberId,
      memberNickName: user.memberNickName,
    });
    setShowChat(true);

    setAdminChatList({
      ...chat,
      unreadMessagesCount: 0,
    });
  }

  function closeChat() {
    setSelectedChat(null);
    setShowChat(false);
  }

  useEffect(() => {
    // notifications 배열의 변화를 감지합니다.
    notifications.forEach((notification) => {
      // AdminChatList에서 해당 notification.userId와 일치하는 chatRoomId를 찾습니다.
      const chatIndex = AdminChatList.findIndex(
        (chat) => chat.chatRoomId === notification.senderId,
      );
      console.log("인덳스 " + chatIndex);

      // 일치하는 채팅방이 있다면, unreadMessagesCount를 증가시킵니다.
      if (chatIndex !== -1) {
        const updatedChatList = [...AdminChatList];
        updatedChatList[chatIndex] = {
          ...updatedChatList[chatIndex],
          unreadMessagesCount:
            updatedChatList[chatIndex].unreadMessagesCount + 1,
        };
        console.log(
          "카운트 : " + updatedChatList[chatIndex].unreadMessagesCount,
        );
        setAdminChatList(updatedChatList);
      }
    });
  }, [notifications]); // notifications 배열이 변경될 때마다 이 효과를 실행합니다.

  return (
    <Flex w={"100%"} justify={"start"} px={"1rem"}>
      <Box ml={5}>
        담당자 없는 문의
        {/* 채팅 리스트를 나열합니다. */}
        {noneAdminChatList.map((chat) => (
          <Box
            w="200px"
            key={chat.chatRoomId}
            border="1px solid"
            p="1rem"
            cursor="pointer"
            onClick={() => openChat(chat)}
          >
            {chat.memberNickName} {}
          </Box>
        ))}
      </Box>
      <Box ml={5}>
        {/* 채팅 리스트를 나열합니다. */}
        담당문의
        {AdminChatList.map((chat) => (
          <Box
            w="200px"
            key={chat.chatRoomId}
            border="1px solid"
            p="1rem"
            cursor="pointer"
            onClick={() => openChat(chat)}
          >
            챗룸아디 : {chat.chatRoomId}/{chat.memberNickName}
            {chat.unreadMessagesCount}
          </Box>
        ))}
      </Box>
      {showChat && (
        <Box
          position="absolute"
          // bottom="120px"
          left="15%"
          w="1000px"
          h="483px"
          bgColor="white"
          border="1px solid #ccc"
          p="10px"
          zIndex={3}
        >
          {selectedChat && (
            <Box>
              <ChatWebSocket roomInfo={selectedChat} />
              <Button onClick={closeChat}>닫기</Button>
            </Box>
          )}
          {/* 채팅 컴포넌트를 상자에 추가합니다. */}
        </Box>
      )}
      <div>
        <button onClick={handleNewNotification}>알림 추가</button>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              {notification.id}
              유저아디 : {notification.senderId}/{notification.message}
              <button onClick={() => removeNotification(notification.userId)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Flex>
  );
}

export default ChatListPage;
