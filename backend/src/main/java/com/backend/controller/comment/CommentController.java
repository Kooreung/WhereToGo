package com.backend.controller.comment;

import com.backend.domain.comment.Comment;
import com.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    final CommentService service;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public void getComment(@RequestBody Comment comment, Authentication authentication) {
        System.out.println("comment = " + comment);
        service.add(comment, authentication);
    }

    @GetMapping("list/{postId}")
    public List<Comment> getCommentList(@PathVariable Integer postId) {
        return service.list(postId);
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public void getCommentEdit(@RequestBody Comment comment, Authentication authentication) {
        System.out.println("comment = " + comment);
        if (service.hasAccess(comment, authentication)) {
            service.edit(comment, authentication);
        } else {
            throw new AccessDeniedException("Access denied");
        }
    }

    @DeleteMapping("delete")
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(@RequestBody Comment comment, Authentication authentication) {
        System.out.println("comment = " + comment);
        service.delete(comment, authentication);
    }
}
