import React, { useEffect, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";

export function ChatWebSocket() {
  //웹소켓 연결 객체
  const stompClient = useRef(null);
  // 메시지 리스트
  const [messages, setMessages] = new useState([]);
  // 사용자 입력을 저장할 변수
  const [inputValue, setInputValue] = useState("");

  const connect = () => {
    //웹소켓 연결
    const socket = new WebSocket("ws://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      //메시지 수신(1은 roomId를 임시로 표현)
      stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
        //누군가 발송했던 메시지를 리스트에 추가
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });
  };

  const fetchMessages = () => {
    return axios.get("/ws/chat/1").then((response) => {
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

  //메세지 전송
  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      //현재로서는 임의의 테스트 값을 삽입
      const body = {
        id: 1,
        name: "테스트1",
        message: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };
  useEffect(() => {
    connect();
    fetchMessages();
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => disconnect();
  }, []);
  return (
    <div>
      <ul>
        <div>
          {/* 입력 필드 */}
          <input type="text" value={inputValue} onChange={handleInputChange} />
          {/* 메시지 전송, 메시지 리스트에 추가 */}
          <button onClick={sendMessage}>입력</button>
        </div>
        {/* 메시지 리스트 출력 */}
        {messages.map((item, index) => (
          <div key={index} className="list-item">
            {item.message}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ChatWebSocket;
