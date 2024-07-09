package com.backend.WebSocket.chat;


import lombok.Data;

@Data
public class ChatRoom {

    private Integer chatRoomId;
    private Integer memberId;
    private String memberNickName;

}
