import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    axios.get(`/api/chatroom/${decodedToken.sub}`).then((res) => {
      console.log(res.data.AdminChatRoom);
      setNoneAdminChatList(res.data.noneAdminChatRoom);
      setAdminChatList(res.data.AdminChatRoom);
      if (accessToken) {
        setUser({
          memberId: decodedToken.sub,
          memberNickName: decodedToken.nickName,
        });
      }
    });
  }, [showChat]);

  function openChat(chat) {
    removeNotification();
    setShowChat(false);
    setSelectedChat(null);
    setSelectedChat({
      ...chat,
      memberId: user.memberId,
      memberNickName: user.memberNickName,
    });
    setShowChat(true);
  }

  function closeChat() {
    setSelectedChat(null);
    setShowChat(false);
  }

  useEffect(() => {
    if (!showChat) {
      // notifications 배열의 변화를 감지합니다.
      notifications.forEach((notification) => {
        // AdminChatList에서 해당 notification.userId와 일치하는 chatRoomId를 찾습니다.
        const chatIndex = AdminChatList.findIndex(
          (chat) => chat.chatRoomId === notification.senderId,
        );

        // 일치하는 채팅방이 있다면, unreadMessagesCount를 증가시킵니다.
        if (chatIndex !== -1) {
          const updatedChatList = [...AdminChatList];
          updatedChatList[chatIndex] = {
            ...updatedChatList[chatIndex],
            unreadMessagesCount:
              updatedChatList[chatIndex].unreadMessagesCount + 1,
          };
          setAdminChatList(updatedChatList);
        }
      });
    }
  }, [notifications]); // notifications 배열이 변경될 때마다 이 효과를 실행합니다.

  return (
    <Flex w="100%" h="calc(100vh - 500px)" bg="gray.50">
      {/* 왼쪽 섹션 - 채팅 리스트 */}
      <Box
        w="300px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
      >
        <VStack spacing={4} align="stretch" p="4">
          <Box>
            <Text fontWeight="bold" mb="2">
              담당자 없는 문의
            </Text>
            <VStack spacing={2} align="stretch">
              {noneAdminChatList.map((chat) => (
                <Box
                  key={chat.chatRoomId}
                  p="3"
                  borderRadius="md"
                  bg="gray.100"
                  _hover={{ bg: "blue.100" }}
                  cursor="pointer"
                  onClick={() => openChat(chat)}
                >
                  <Text fontWeight="semibold">{chat.memberNickName}</Text>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box mt="4">
            <Text fontWeight="bold" mb="2">
              담당 문의
            </Text>
            <VStack spacing={2} align="stretch">
              {AdminChatList.map((chat) => (
                <Box
                  key={chat.chatRoomId}
                  p="3"
                  borderRadius="md"
                  bg="gray.100"
                  _hover={{ bg: "blue.100" }}
                  cursor="pointer"
                  onClick={() => openChat(chat)}
                >
                  <Text fontWeight="semibold">{chat.chatRoomId}번 방</Text>
                  <Text fontSize="sm">닉네임: {chat.memberNickName}</Text>
                  {chat.unreadMessagesCount > 0 && (
                    <Badge colorScheme="red" mt={1}>
                      새 메시지: {chat.unreadMessagesCount}
                    </Badge>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* 오른쪽 섹션 - 채팅창 또는 기본 컨텐츠 */}
      <Flex flex={1} direction="column" position="relative" overflow="hidden">
        {showChat && selectedChat && (
          <Box
            position="absolute"
            top="0"
            w="90%"
            h="100%"
            maxW="1000px"
            bgColor="white"
            border="1px solid #ccc"
            zIndex={3}
            overflow="hidden"
          >
            <Button
              onClick={closeChat}
              position="absolute"
              top="2px"
              right="2px"
              zIndex={4}
            >
              닫기
            </Button>
            <Box h="calc(100% - 60px)">
              <ChatWebSocket
                roomInfo={{
                  chatRoomId: selectedChat.chatRoomId,
                  memberId: selectedChat.memberId,
                  memberNickName: selectedChat.memberNickName,
                }}
                maxHeight="370px"
                width="100%"
              />
            </Box>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

export default ChatListPage;
