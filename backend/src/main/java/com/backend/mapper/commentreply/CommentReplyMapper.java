package com.backend.mapper.commentreply;

import com.backend.domain.reply.Reply;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentReplyMapper {
    @Insert("""
                        INSERT INTO commentreply(replycomment,postid,memberid,commentid)
            VALUES (#{replyComment},#{postId},#{memberId},#{commentId})
                        """)
    void insertReply(Reply reply);
}
