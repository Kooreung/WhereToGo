package com.backend.controller.post;

import com.backend.domain.post.Post;
import com.backend.service.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 추가 | 작성 Controller
    @PostMapping("add")
    public void postAdd(Post post) {
        postService.add(post);
    }

    // 게시글 목록 Controller
    @GetMapping("list")
    public void postList() {
    }

    // 게시글 MD추천 목록 Controller
    @GetMapping("list/md")
    public void postListMd() {
    }

    // 게시글 인기글 목록 Controller
    @GetMapping("list/recommend")
    public void postListRecommend() {
    }

    // 게시글 조회 Controller
    @GetMapping("{postId}")
    public void postRead() {
    }

    // 게시글 삭제 Controller
    @DeleteMapping("{postId}")
    public void postDelete() {
    }

    // 게시글 수정 Controller
    @GetMapping("edit/{postId}")
    public void postEdit() {
    }

    // 게시글 좋아요 Controller
    @PutMapping("like")
    public void postLike() {
    }

    // 게시글 좋아요 목록 Controller
    @PutMapping("likeList")
    public void postLikeList() {
    }
}
