package com.backend.mapper.post;

import com.backend.domain.post.Post;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface PostMapper {

    // 게시글 추가 매퍼
    @Insert("""
            INSERT INTO Post (title, content, member_id)
            VALUES (#{title}, #{content}, 1)
            """)
    int insert(Post post);

    // 게시글 조회 매퍼
    @Select("""
            SELECT *
            FROM Post
            WHERE Post.post_id = #{id}
            """)
    Post selectById(Integer postId);
}
