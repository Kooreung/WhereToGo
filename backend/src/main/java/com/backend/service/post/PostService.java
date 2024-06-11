package com.backend.service.post;

import com.backend.domain.post.Post;
import com.backend.mapper.post.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> get(Integer postId) {
        Post post = postMapper.selectById(postId);
        Map<String, Object> result = new HashMap<>();
        result.put("post", post);

        return result;
    }

    // 게시글 리스트 서비스
    public List<Post> list() {
        return postMapper.selectAllPage();
    }

    // 게시글 수정 서비스
    public void edit(Post post) {
        postMapper.update(post);
    }
}
