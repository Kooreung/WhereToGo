package com.backend.WebSocket.chat;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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
            INSERT INTO chatroom (chatRoomId,memberId,memberNickName)
            VALUES (#{memberId},#{memberId},#{nickName})
            """)
    int insertChatRoom(Integer memberId, String nickName);

    @Insert("""
            INSERT INTO chatmessage (chatRoomId, memberId, name, message, userRead, timeStamp)
            VALUES (#{chatRoomId}, #{memberId}, #{name}, #{message}, #{userRead}, #{timestamp})
            """)
    void insertChat(ChatMessage chat);


    @Select("""
              SELECT c.chatRoomId, c.memberId, c.memberNickName,
                     (SELECT COUNT(*) FROM chatmessage WHERE chatRoomId = c.chatRoomId AND userRead = 0) AS unreadMessagesCount
              FROM chatroom c
              WHERE c.AssignedAdminId = 'none'
            """)
    List<ChatRoom> getChatRoomList();


    @Select("""
                      SELECT c.chatRoomId, c.memberId, c.memberNickName,
                   (SELECT COUNT(*) FROM chatmessage WHERE chatRoomId = c.chatRoomId AND userRead = 0) AS unreadMessagesCount
            FROM chatroom c
            WHERE c.AssignedAdminId = #{adminId}
                      """)
    List<ChatRoom> getChatRoomWithAssignedAdmin(Integer adminId);


    @Select("""
            SELECT memberId from chatmessage
            where chatRoomId= #{chatRoomId}
            and memberId <> #{chatRoomId}
            """)
    Integer getMemberId(Integer chatRoomId);


    @Update("""
            UPDATE chatroom
            set Admin_Online = true
            where chatRoomId= #{chatRoomId}
            """)
    void updateAdminOnline(Integer chatRoomId);

    @Update("""
            UPDATE chatroom
            set Admin_Online = false
            where chatRoomId= #{chatRoomId}
            """)
    void updateAdminOffline(ChatRoom chatRoom);

    @Update("""
            UPDATE chatroom
            set User_Online = true
            where chatRoomId= #{chatRoomId}
            """)
    void updateUserOnline(ChatRoom chatRoom);

    @Update("""
            UPDATE chatroom
            set User_Online = false
            where chatRoomId= #{chatRoomId}
            """)
    void updateUserOffline(ChatRoom chatRoom);


    @Select("""
            SELECT User_Online FROM chatroom
            where chatRoomId= #{chatRoomId}
            """)
    boolean getUserStatus(Integer chatRoomId);

    @Select("""
            SELECT Admin_Online FROM chatroom
            where chatRoomId= #{chatRoomId}
            """)
    boolean getAdminStatus(Integer chatRoomId);

    @Update("""
            UPDATE chatmessage
            SET userRead = true
            WHERE chatRoomId = #{chatRoomId}
            AND memberId <> #{myId}
            """)
    void updateMessageRead(Integer chatRoomId, Integer myId);


    @Update("""
            UPDATE chatroom
            set AssignedAdminId = #{adminId}
            where chatRoomId= #{chatRoomId}
                        """)
    void updateAssignedAdmin(Integer chatRoomId, Integer adminId);

    @Select("""
            SELECT AssignedAdminId from chatroom
            where chatRoomId = #{chatRoomId}
            """)
    String getAssignedAdminId(Integer chatRoomId);
}
