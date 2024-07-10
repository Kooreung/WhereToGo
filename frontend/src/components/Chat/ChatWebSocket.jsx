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

export function ChatWebSocket({ roomInfo }) {
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

  const connect = (roomId) => {
    //웹소켓 연결
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      //메시지 수신(1은 roomId를 임시로 표현)
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        //누군가 발송했던 메시지를 리스트에 추가
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(message.body);
        console.log(nickName);
        console.log(newMessage.name);
        if (nickName === newMessage.name) {
          setIsNewMessage(false);
          scrollToBottom();
        } else {
          setIsNewMessage(true);
        }
      });
    });
  };

  //멤버아이디가 채팅방 번호임
  const fetchMessages = (roomId) => {
    return axios.get(`/api/chat/${roomId}`).then((response) => {
      setMessages(response.data);
    });
  };

  const disconnect = () => {
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
    console.log(memberId);
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
  };

  useEffect(() => {
    if (roomInfo) {
      setRoomId(roomInfo.chatRoomId);
      setMemberId(roomInfo.memberId);
      setNickName(roomInfo.memberNickName);
      connect(roomInfo.chatRoomId);
      fetchMessages(roomInfo.chatRoomId);
    }

    return () => disconnect();
  }, [roomInfo]); // roomInfo를 의존성 배열에 추가합니다.

  const Message = ({ message, isOwnMessage }) => {
    const align = isOwnMessage ? "flex-end" : "flex-start";
    const bg = useColorModeValue("blue.100", "blue.700");
    return (
      <Flex justifyContent={align} w="100%">
        <Box ml={2} mr={2} bg={bg} borderRadius="lg" p={2}>
          <Text color={isOwnMessage ? "white" : "black"}>{message}</Text>
        </Box>
      </Flex>
    );
  };

  // 스크롤을 위한 ref 생성
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // 스크롤을 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    if (isNewMessage) {
      //스크롤을 제일 밑으로 내린 길이의 - 800인 위치에서 메세지를 보고있을때 메세지가 새로오면 새로운 메세지 버튼 띄우기
      if (scrollPosition >= scrollHeight) {
        scrollToBottom();
      } else {
        // 그렇지 않으면 새 메시지 알림 버튼 표시
        setShowScrollButton(true);
      }
      setIsNewMessage(false);
    }
  }, [isNewMessage, scrollPosition, scrollHeight]);

  //----------------------------------------

  return (
    <Box h="100%">
      <Box
        maxH="400px"
        overflowY="auto"
        position="absolute"
        right={0}
        width="100%"
        onScroll={handleScroll}
        ref={chatBoxRef}
      >
        {/* 메시지 리스트 */}
        <VStack spacing={4} align="stretch">
          {messages.map((item, index) => (
            <Message
              key={index}
              message={item.message}
              isOwnMessage={item.memberId == memberId}
            />
          ))}
          {/* 스크롤을 위한 더미 div */}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      {showScrollButton && (
        <Button
          position="absolute"
          bottom="80px"
          right="95px"
          onClick={scrollToBottom}
        >
          새 메시지 보기
        </Button>
      )}
      {/* 입력 필드와 버튼 */}
      <Flex
        position="absolute" // 화면 하단에 고정
        bottom="0" // 하단에 위치
        left="0" // 왼쪽에 위치
        right="0" // 오른쪽에 위치
        p={4} // 패딩 설정
        bg="white" // 배경색 설정
        boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)" // 상단 그림자 효과
      >
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // 엔터 키 입력 감지
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
