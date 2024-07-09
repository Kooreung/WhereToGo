package com.backend.WebSocket.chat;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChatMapper {


    @Select("""
            SELECT * FROM chatmessage
            where chatRoomId=#{roomId}
                        """)
    List<ChatMessage> getMessageList(Integer roomId);


    @Select("""
            SELECT * FROM chatroom
            where memberId = #{memberId}
            """)
    Optional<ChatRoom> getCHatRoomByMemberId(Integer memberId);


    @Insert("""
            INSERT INTO chatroom (memberId,memberNickName)
            VALUES (#{memberId},#{nickName})
            """)
    ChatRoom insertChatRoom(Integer memberId, String nickName);

    @Insert("""
            INSERT INTO chatmessage (chatRoomId,memberId,name,message)
            VALUES (#{chatRoomId},#{memberId},#{name},#{message})
            """)
    void insertChat(ChatMessage chat);
}
