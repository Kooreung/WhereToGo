package com.backend.WebSocket.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {


    private Integer chatId;
    private Integer chatRoomId;
    private Integer memberId;
    private String name;
    private String message;
    private boolean userRead;

    private LocalDateTime timestamp;


}
