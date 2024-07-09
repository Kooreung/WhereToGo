package com.backend.WebSocket.chat;


import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper chatMapper;
    private final MemberMapper memberMapper;

    public ResponseEntity getChatRoom(Integer memberId) {
        int exist = chatMapper.foundChatRoom(memberId);
        Member member = memberMapper.selectMemberByMemberId(memberId);
        if (exist == 0) {
            chatMapper.insertChatRoom(memberId,member.getNickName() );
            ChatRoom chatRoom = chatMapper.getChatRoomByMemberId(memberId);
            return ResponseEntity.ok().body(chatRoom);
        }
            ChatRoom chatRoom = chatMapper.getChatRoomByMemberId(memberId);
            return ResponseEntity.ok().body(chatRoom);


    }



    public ResponseEntity getMessage(Integer roomId) {
        List<ChatMessage> messages = chatMapper.getChatList(roomId);
        if (messages != null && messages.size() > 0) {
            return ResponseEntity.ok().body(messages);
        } else {
            return ResponseEntity.ok().body(List.of());
        }
    }


    public void saveChat(ChatMessage chat) {

        chatMapper.insertChat(chat);
    }


    public ResponseEntity getChatRoomList() {
        List<ChatRoom> rooms = chatMapper.getChatRoomList();
        if(rooms != null){
            return ResponseEntity.ok().body(rooms);
        }
        return ResponseEntity.ok().body(List.of());
    }
}
