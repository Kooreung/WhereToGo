package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO Comment(comment,post_Id)
            VALUES (#{comment},#{postId})
            """)
    void insert(Comment comment);

    @Select("""
            SELECT *
            FROM Comment
            WHERE postid = #{postId}
            """)
    List<Comment> selectByPostId(Integer postId);

    void update();

    void delete();

}
