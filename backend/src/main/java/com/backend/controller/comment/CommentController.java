package com.backend.controller.comment;

import com.backend.domain.comment.Comment;
import com.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    final CommentService service;

    @PostMapping("add")
    public void getComment(@RequestBody Comment comment) {
        System.out.println("comment = " + comment);
        service.add(comment);
    }

    @GetMapping("list/{postId}")
    public List<Comment> getCommentList(@PathVariable Integer postId) {
        return service.list(postId);
    }

    @PutMapping("edit")
    public void getCommentEdit(@RequestBody Comment comment) {
        System.out.println("comment = " + comment);
        service.edit(comment);
    }

    @DeleteMapping("delete")
    public void deleteComment(@RequestBody Comment comment) {
        System.out.println("comment = " + comment);
        service.delete(comment);
    }
}
