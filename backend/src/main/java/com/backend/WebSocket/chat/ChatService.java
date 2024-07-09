package com.backend.WebSocket.chat;


import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private ChatMapper chatMapper;
    private MemberMapper memberMapper;

    public Optional<ChatRoom> getChatRoom(Integer memberId) {
        return Optional.ofNullable(chatMapper.getCHatRoomByMemberId(memberId))
                .orElseGet(() -> {
                    Member member = memberMapper.selectMemberByMemberId(memberId);
                    chatMapper.insertChatRoom(memberId, member.getNickName());
                    return chatMapper.getCHatRoomByMemberId(memberId);
                });
    }


    public ResponseEntity getMessage(Integer roomId) {
        List<ChatMessage> messages = chatMapper.getMessageList(roomId);
        if (messages != null && messages.size() > 0) {
            return ResponseEntity.ok().body(messages);
        } else {
            return ResponseEntity.ok().body(null);
        }
    }


    public void saveChat(ChatMessage chat) {
        chatMapper.insertChat(chat);
    }
}
