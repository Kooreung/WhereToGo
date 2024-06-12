package com.backend.controller.post;

import com.backend.domain.post.Post;
import com.backend.service.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 추가 | 작성 Controller
    @PostMapping("add")
    public ResponseEntity postAdd(Post post) {
        if (postService.validate(post)) {
            postService.add(post);
            System.out.println("post = " + post);
            return ResponseEntity.ok().build();
        } else {
            System.out.println("post = " + post);
            return ResponseEntity.badRequest().build();
        }
    }

    // 게시글 조회 Controller
    @GetMapping("{postId}")
    public ResponseEntity postRead(@PathVariable Integer postId) {
        Map<String, Object> result = postService.get(postId);
        if (result.get("post") == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().body(result);
    }

    // 게시글 목록 Controller
    @GetMapping("list")
    public Map<String, Object> postList(
            @RequestParam(defaultValue = "1") Integer page) {
        return postService.list(page);
    }

    // 게시글 MD추천 목록 Controller
    @GetMapping("list/md")
    public void postListMd() {
    }

    // 게시글 인기글 목록 Controller
    @GetMapping("list/recommend")
    public void postListRecommend() {
    }

    // 게시글 삭제 Controller
    @DeleteMapping("{postId}")
    public void postDelete() {
    }

    // 게시글 수정 Controller
    @PutMapping("edit")
    public void postEdit(Post post) {
        if (postService.validate(post)) {
            postService.edit(post);
        }
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
