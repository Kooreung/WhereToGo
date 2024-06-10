package com.backend.service.post;

import com.backend.domain.post.Post;
import com.backend.mapper.post.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시글 작성 시 제목, 내용 공백 확인
    public boolean validate(Post post) {
        if (post.getTitle() == null || post.getTitle().isBlank()) {
            return false;
        }
        if (post.getContent() == null || post.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    // 게시글 추가 서비스
    public void add(Post post) {
        postMapper.insert(post);
    }

    // 게시글 조회 서비스
    public void get(Integer postId) {
        Post post = postMapper.selectById(postId);
    }
}
