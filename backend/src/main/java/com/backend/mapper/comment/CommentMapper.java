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
    void insert(Comment comment);

    @Select("""
            SELECT *
            FROM comment
            WHERE postid = #{postId}
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

}
