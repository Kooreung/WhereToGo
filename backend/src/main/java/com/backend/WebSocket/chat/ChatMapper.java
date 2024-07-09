package com.backend.WebSocket.chat;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ChatMapper {


    @Select("""
            SELECT * FROM chatmessage
            where chatRoomId= #{roomId}
                        """)
    List<ChatMessage> getChatList(Integer roomId);


    @Select("""
            SELECT * FROM chatroom
            where memberId = #{memberId}
            """)
    ChatRoom getChatRoomByMemberId(Integer memberId);

    @Select("""
            SELECT COUNT(*) FROM chatroom
            where memberId = #{memberId}
            """)
    int foundChatRoom(Integer memberId);


    @Insert("""
            INSERT INTO chatroom (memberId,memberNickName)
            VALUES (#{memberId},#{nickName})
            """)
    int insertChatRoom(Integer memberId, String nickName);

    @Insert("""
            INSERT INTO chatmessage (chatRoomId,memberId,name,message,timestamp)
            VALUES (#{chatRoomId},#{memberId},#{name},#{message},#{timestamp})
            """)
    void insertChat(ChatMessage chat);


    @Select("""
            SELECT * FROM chatroom
            """)
    List<ChatRoom> getChatRoomList();
}
