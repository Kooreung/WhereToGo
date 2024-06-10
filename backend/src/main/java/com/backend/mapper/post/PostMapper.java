package com.backend.mapper.post;

import com.backend.domain.post.Post;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

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
            SELECT p.post_id, p.title, p.content, p.create_date, p.view
            FROM Post p JOIN Member m
            ON p.member_id = m.member_id
            WHERE p.post_id = #{postId}
            """)
    Post selectById(Integer postId);

    @Select("""
            SELECT p.post_id, p.title, p.content, m.nick_name
            FROM Post p JOIN Member m ON p.member_id = m.member_id
            GROUP BY p.post_id
            ORDER BY p.post_id DESC
            """)
    List<Post> selectAllPage();
}
