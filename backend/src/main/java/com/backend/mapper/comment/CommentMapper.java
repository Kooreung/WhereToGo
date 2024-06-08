package com.backend.mapper.comment;

import com.backend.domain.comment.Comment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO Comment(comment,post_Id)
            VALUES (#{comment},#{postId})
            """)
    void insert(Comment comment);

    void selectByPostId();

    void update();

    void delete();

}
