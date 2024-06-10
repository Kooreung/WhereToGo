package com.backend.mapper.post;

import com.backend.domain.post.Post;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper {

    @Insert("""
            INSERT INTO Post (title, content)
            VALUES (#{title}, #{content})
            """)
    void insert(Post post);
}
