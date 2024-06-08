package com.backend.controller.comment;

import com.backend.domain.comment.Comment;
import com.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    final CommentService service;
    
    @PostMapping("add")
    public void getComment(Comment comment) {
        System.out.println("comment = " + comment);
        service.add(comment);
    }

    @PostMapping("list/{postId}")
    public void getCommentList() {
        service.list();
    }

    @PutMapping("edit")
    public void getCommentEdit() {
        service.edit();
    }

    @DeleteMapping("delete")
    public void deleteComment() {
        service.delete();
    }
}
