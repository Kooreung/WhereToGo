package com.backend.WebSocket.chat;

import com.backend.WebSocket.sseemitter.NotificationController;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatController {

    private final SimpMessageSendingOperations template;
    private final ChatService chatService;
    private final NotificationController notificationController;
    private final MemberMapper memberMapper;
    private final ChatMapper chatMapper;


    @PostMapping("chatroom/{memberId}")
    public ResponseEntity getChatroom(@PathVariable int memberId) {
        return chatService.getChatRoom(memberId);
    }

    @GetMapping("chatroom/{adminId}")
    public ResponseEntity getChatroom(@PathVariable Integer adminId) {
        Map<String, Object> map = new HashMap<>();
        List<ChatRoom> noneAdminChatRoom = chatService.getChatRoomList();
        List<ChatRoom> AdminChatRoom = chatService.getChatRoomWithAssignedAdmin(adminId);
        map.put("noneAdminChatRoom", noneAdminChatRoom);
        map.put("AdminChatRoom", AdminChatRoom);
        return ResponseEntity.ok().body(map);
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
        String auth = memberMapper.getAuthTypeByMemberId(chat.getMemberId());
        boolean readState = false;
        Integer id = 0;
        if (auth.equals("admin")) {
            String adminExist = chatMapper.getAssignedAdminId(chat.getChatRoomId());
            if (adminExist.equals("none")) {
                chatMapper.updateAssignedAdmin(chat.getChatRoomId(), chat.getMemberId());
                chatService.updateAdminOnline(chat.getChatRoomId());
                chatService.messageRead(chat.getChatRoomId(), chat.getMemberId());
                notificationController.sendState(chat.getMemberId(), "선택완료");
            } else {
                chatService.updateAdminOnline(chat.getChatRoomId());
                chatService.messageRead(chat.getChatRoomId(), chat.getMemberId());
            }
            id = chat.getChatRoomId();
            readState = chatMapper.getUserStatus(chat.getChatRoomId());
            chat.setUserRead(readState);
            notificationController.sendMessageToUser(id, chat.getMemberId(), "어드민의 메세지 와떠염");
        } else {
            String adminExist = chatMapper.getAssignedAdminId(chat.getChatRoomId());
            if (adminExist.equals("none")) {

            } else {
                id = Integer.valueOf(chatMapper.getAssignedAdminId(chat.getChatRoomId()));
                notificationController.sendMessageToUser(id, chat.getMemberId(), "유저의 메세지 와떠염");
            }

            readState = chatMapper.getAdminStatus(chat.getChatRoomId());
            chat.setUserRead(readState);
        }


        // 메시지를 해당 채팅방 구독자들에게 전송
        LocalDateTime time = LocalDateTime.now();
        chat.setTimestamp(time);
        chatService.saveChat(chat);
        String url = String.format("/sub/chatroom/%s", chat.getChatRoomId());
        template.convertAndSend(url, chat);
        return ResponseEntity.ok().build();
    }


    //유저, 어드민 온라인 오프라인 관리
    @PutMapping("chatonline")
    public void updateChatRoomOnline(@RequestBody ChatRoom chatRoom) {
        String auth = memberMapper.getAuthTypeByMemberId(chatRoom.getMemberId());
        System.out.println(auth);
        if (auth.equals("admin")) {
            String adminExist = chatMapper.getAssignedAdminId(chatRoom.getChatRoomId());
            if (!adminExist.equals("none")) {
                chatService.updateAdminOnline(chatRoom.getChatRoomId());
                chatService.messageRead(chatRoom.getChatRoomId(), chatRoom.getMemberId());
//                String url = String.format("/sub/chatroom/%s", chatRoom.getChatRoomId());
//                Map<String, Integer> map = new HashMap<>();
//                map.put("state", 1);
//                template.convertAndSend(url, map);
                notificationController.sendState(chatRoom.getChatRoomId(), "어드민 온라인");
            }

        } else {
            chatService.updateUserOnline(chatRoom);
            chatService.messageRead(chatRoom.getChatRoomId(), chatRoom.getMemberId());
            Integer id = Integer.valueOf(chatMapper.getAssignedAdminId(chatRoom.getChatRoomId()));
            String url = String.format("/sub/chatroom/%s", chatRoom.getChatRoomId());
//            Map<String, Integer> map = new HashMap<>();
//            map.put("state", 1);
//            template.convertAndSend(url, map);
            notificationController.sendState(id, "유저 온라인");
        }

    }

    @PutMapping("chatoffline")
    public void updateChatRoomOffline(@RequestBody ChatRoom chatRoom) {
        String auth = memberMapper.getAuthTypeByMemberId(chatRoom.getMemberId());
        if (auth.equals("admin")) {
            chatService.updateAdminOffline(chatRoom);
        } else {
            chatService.updateUserOffnline(chatRoom);
        }

    }
}
