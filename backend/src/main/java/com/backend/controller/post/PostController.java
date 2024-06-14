package com.backend.controller.post;

import com.backend.domain.post.Post;
import com.backend.service.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 추가 | 작성 Controller
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> postAdd(Post post, Authentication authentication) {
        if (postService.validate(post)) {
            Integer result = postService.add(post, authentication);
            return ResponseEntity.ok().body(result);
        } else {

            return ResponseEntity.badRequest().build();
        }
    }

    // 게시글 조회 Controller
    @GetMapping("{postId}")
    public ResponseEntity postRead(@PathVariable Integer postId, Authentication authentication) {
        Map<String, Object> result = postService.get(postId, authentication);
        if (result.get("post") == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(result);
    }

    // 게시글 목록 Controller
    @GetMapping("list")
    public Map<String, Object> postList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(value = "type", required = false) String searchType,
            @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return postService.list(page, searchType, searchKeyword);
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity postDelete(@PathVariable Integer postId, Authentication authentication) {
        if (postService.hasMemberIdAccess(postId, authentication)) {
            postService.remove(postId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

    }

    // 게시글 수정 Controller
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity postEdit(Post post,
                                   Authentication authentication) {
        if (!postService.hasMemberIdAccess(post.getPostId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (postService.validate(post)) {
            postService.edit(post);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 게시글 좋아요 Controller
    @PutMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> postLike(@RequestBody Map<String, Object> like, Authentication authentication) {
        return postService.postLike(like, authentication);
    }

    // 게시글 좋아요 목록 Controller
    @PutMapping("likeList")
    public void postLikeList() {
    }
}
