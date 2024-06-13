package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment(comment, postid)
            VALUES (#{comment},#{postId})
            """)
    void insert(Comment comment);

    @Select("""
            SELECT *
            FROM comment
            WHERE postid = #{postId}
            """)
    List<Comment> selectByPostId(Integer postId);

    @Update("""
            UPDATE comment SET comment=#{comment} WHERE postid=#{postId}
            """)
    void update(Comment comment);

    void delete();

}
