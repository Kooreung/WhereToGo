package com.backend.mapper.post;

import com.backend.domain.post.Post;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostMapper {

    // 게시글 추가 매퍼
    @Insert("""
            INSERT INTO Post (title, content, memberid)
            VALUES (#{title}, #{content}, 1)
            """)
    int insert(Post post);

    // 게시글 조회 매퍼
    @Select("""
            SELECT p.postid, p.title, p.content, p.createdate, p.view
            FROM Post p JOIN Member m
            ON p.memberid = m.memberid
            WHERE p.postid = #{postId}
            """)
    Post selectById(Integer postId);

    // 게시글 리스트 매퍼
    @Select("""
            SELECT p.postid, p.title, p.content, m.nickname
            FROM Post p JOIN Member m ON p.memberid = m.memberid
            GROUP BY p.postid
            ORDER BY p.postid DESC
            LIMIT #{offset}, 5
            """)
    List<Post> selectAllPost(Integer offset);

    // 게시글 리스트 카운트 매퍼
    @Select("""
            SELECT COUNT(p.postid)
            FROM Post p JOIN Member m ON p.memberid = m.memberid
            """)
    Integer countAllPost();

    // 게시글 수정 매퍼
    @Update("""
            UPDATE Post
            SET title=#{title}, content=#{content}
            WHERE postid=#{postId}
            """)
    void update(Post post);
}
