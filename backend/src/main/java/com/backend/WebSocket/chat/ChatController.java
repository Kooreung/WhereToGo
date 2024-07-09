package com.backend.WebSocket.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatController {

    private final SimpMessageSendingOperations template;
    private final ChatService chatService;


    @PostMapping("chatroom/{memberId}")
    public Optional<ChatRoom> getChatroom(@PathVariable Integer memberId) {
        System.out.println(memberId);
        return chatService.getChatRoom(memberId);
    }

    // 채팅 리스트 반환
    @GetMapping("chat/{roomId}")
    public ResponseEntity getChatMessages(@PathVariable Integer roomId) {
        //임시로 리스트 형식으로 구현, 실제론 DB 접근 필요

        return chatService.getMessage(roomId);
    }

    //메시지 송신 및 수신, /pub가 생략된 모습. 클라이언트 단에선 /pub/message로 요청
    @MessageMapping("/message")
    public ResponseEntity<Void> receiveMessage(@RequestBody ChatMessage chat) {
        // 메시지를 해당 채팅방 구독자들에게 전송
        chatService.saveChat(chat);
        String url = String.format("/sub/chatroom/%s", chat.getChatRoomId());
        template.convertAndSend("/sub/chatroom/", chat);
        return ResponseEntity.ok().build();
    }
}
