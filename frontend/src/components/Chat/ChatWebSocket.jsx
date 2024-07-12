import React, { useEffect, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNotifications } from "./NotificationProvider.jsx";

export function ChatWebSocket({ roomInfo, maxHeight, width }) {
  //웹소켓 연결 객체
  const stompClient = useRef(null);
  // 메시지 리스트
  const [messages, setMessages] = new useState([]);
  // 사용자 입력을 저장할 변수
  const [inputValue, setInputValue] = useState("");
  const [roomId, setRoomId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [nickName, setNickName] = useState("");
  // 새 메시지 도착 여부를 위한 상태 변수
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [myMessage, setMyMessage] = useState("");
  const [senderName, setSenderName] = useState("");

  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const connect = (roomInfo) => {
    //웹소켓 연결
    const socket = new WebSocket("ws://172.30.1.33:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      //메시지 수신(1은 roomId를 임시로 표현)
      stompClient.current.subscribe(
        `/sub/chatroom/${roomInfo.chatRoomId}`,
        (message) => {
          //누군가 발송했던 메시지를 리스트에 추가
          const nowMessage = JSON.parse(message.body);
          setNewMessage(message.body);
          setMyMessage(message.body);
          console.log("dsd" + nowMessage.name);
          setMessages((prevMessages) => [...prevMessages, nowMessage]);
          if (nickName === nowMessage.name) {
            setIsNewMessage(false);
          } else {
            setSenderName(nowMessage.name);
            console.log("qqqqqqqqqqq=" + nowMessage.name);
            setIsNewMessage(true);
          }
        },
      );
    });
    axios.put("api/chatonline", {
      chatRoomId: roomInfo.chatRoomId,
      memberId: roomInfo.memberId,
      memberNickName: roomInfo.memberNickName,
    });
  };

  //멤버아이디가 채팅방 번호임
  const fetchMessages = (roomId) => {
    return axios.get(`/api/chat/${roomId}`).then((response) => {
      setMessages(response.data);
    });
  };

  const disconnect = () => {
    axios.put("api/chatoffline", {
      chatRoomId: roomInfo.chatRoomId,
      memberId: roomInfo.memberId,
      memberNickName: roomInfo.memberNickName,
    });
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  // 입력 필드에 변화가 있을 때마다 inputValue를 업데이트
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // 엔터 키 입력 감지 함수
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  //메세지 전송
  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      //현재로서는 임의의 테스트 값을 삽입
      const body = {
        chatRoomId: roomId,
        memberId: memberId,
        name: nickName,
        message: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
    // 사용자가 메시지를 보낸 경우, 새 메시지 버튼을 표시하지 않음
    setShowScrollButton(false);
  };

  useEffect(() => {
    if (roomInfo) {
      setRoomId(roomInfo.chatRoomId);
      setMemberId(roomInfo.memberId);
      setNickName(roomInfo.memberNickName);
      connect(roomInfo);
      fetchMessages(roomInfo.chatRoomId);
    }

    return () => disconnect();
  }, [roomInfo]); // roomInfo를 의존성 배열에 추가합니다.

  useEffect(() => {
    // 메시지 목록을 가져온 후 스크롤을 맨 아래로 이동
    fetchMessages(roomInfo.chatRoomId).then(() => {
      scrollToBottom("auto");
    });
  }, [roomInfo]);

  const Message = ({ userRead, message, isOwnMessage, nickName2 }) => {
    const align = isOwnMessage ? "flex-end" : "flex-start";
    const bg = useColorModeValue("blue.100", "blue.700");
    return isOwnMessage ? (
      <Flex justifyContent={align} w="100%">
        {!userRead && (
          <Text fontSize="sm" color="gray.500">
            안읽음
          </Text>
        )}
        <Box ml={2} mr={2} bg={bg} borderRadius="lg" p={2} maxW="80%">
          <Text color="white">{message}</Text>
        </Box>
      </Flex>
    ) : (
      <Flex justifyContent={align} w="100%">
        <Box ml={2} mr={2} bg={bg} borderRadius="lg" p={2} maxW="80%">
          <Text color="white">{message}</Text>
        </Box>
        {!userRead && (
          <Text fontSize="sm" color="gray.500">
            안읽음
          </Text>
        )}
      </Flex>
    );
  };

  // 스크롤을 위한 ref 생성
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // 스크롤을 아래로 이동시키는 함수
  const scrollToBottom = (type) => {
    if (chatBoxRef.current) {
      const scrollHeight = chatBoxRef.current.scrollHeight;
      const height = chatBoxRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;

      if (type === "s") {
        chatBoxRef.current.scrollTo({
          top: maxScrollTop,
          behavior: "smooth",
        });
      } else {
        chatBoxRef.current.scrollTop = maxScrollTop;
      }
    }
    setShowScrollButton(false);
  };

  // 스크롤 위치와 스크롤 높이를 저장할 상태 변수
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const chatBoxRef = useRef(null);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const position = chatBoxRef.current.scrollTop;
    const height = chatBoxRef.current.scrollHeight;
    setScrollPosition(position);
    setScrollHeight(height - 1000);
  };

  // 새 메시지 도착 시 스크롤 조건 확인 및 처리
  useEffect(() => {
    fetchMessages(roomInfo.chatRoomId);
    if (isNewMessage) {
      //스크롤을 제일 밑으로 내린 길이의 - 800인 위치에서 메세지를 보고있을때 메세지가 새로오면 새로운 메세지 버튼 띄우기
      if (scrollPosition >= scrollHeight) {
        scrollToBottom("s");
      } else {
        // 그렇지 않으면 새 메시지 알림 버튼 표시
        setShowScrollButton(true);
      }
      setIsNewMessage(false);
    }
  }, [notifications]);

  useEffect(() => {
    scrollToBottom("s");
  }, [myMessage]);

  //----------------------------------------

  return (
    <Box h="100%" w={width}>
      <Box
        ref={chatBoxRef}
        maxH={maxHeight}
        h={maxHeight}
        overflowY="auto"
        position="relative"
        bottom="0px"
        right="0px"
        width="100%"
        pb={2}
        onScroll={handleScroll}
      >
        {/* 메시지 리스트 */}
        <VStack spacing={4} align="stretch">
          {messages.map((item, index) => (
            <Box key={index}>
              <Message
                userRead={item.userRead}
                message={item.message}
                isOwnMessage={item.memberId == memberId}
                nickName2={item.name}
              />
            </Box>
          ))}
        </VStack>
      </Box>
      {showScrollButton && (
        <Button
          position="absolute"
          bottom="80px"
          right="10px"
          onClick={() => scrollToBottom("s")}
        >
          새 메시지 보기
        </Button>
      )}
      {/* 입력 필드와 버튼 */}
      <Flex
        position="relative"
        bottom="px"
        left="0"
        right="0"
        p={4}
        bg="white"
        boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
        />
        <Button ml={2} onClick={sendMessage} colorScheme="blue">
          입력
        </Button>
      </Flex>
    </Box>
  );
}

export default ChatWebSocket;
