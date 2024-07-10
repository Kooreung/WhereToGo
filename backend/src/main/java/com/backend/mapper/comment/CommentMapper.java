package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment(comment, postid,memberid)
            VALUES (#{comment},#{postId},#{memberId})
            """)
    void insertComment(Comment comment);

    @Select("""
                SELECT c.commentid, c.comment, c.memberid, m.nickName, c.createdate,
                       COUNT(cr.commentid) AS replyCount
                FROM comment c
                JOIN member m ON c.memberid = m.memberid
                LEFT JOIN commentreply cr ON c.commentid = cr.commentid
                WHERE c.postid = #{postId}
                GROUP BY c.commentid, c.comment, c.memberid, m.nickName, c.createdate
            """)
    List<Comment> selectByPostId(Integer postId);

    @Update("""
            UPDATE comment SET comment=#{comment} WHERE commentid=#{commentId}
            """)
    void update(Comment comment);

    @Delete("""
            DELETE FROM comment WHERE commentId=#{commentId}
            """)
    void delete(Comment comment);

    @Select("""
            SELECT *
            FROM comment
            WHERE commentid = #{commentId}
            """)
    Comment selectByCommentId(Integer commentId);
}
