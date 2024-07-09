package com.backend.controller.commentreply;

import com.backend.domain.comment.Comment;
import com.backend.domain.reply.Reply;
import com.backend.service.comment.CommentService;
import com.backend.service.commentreply.CommentReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/replycomment")
public class CommentReplyController {
    final CommentReplyService service;
    final CommentService commentService;

    @PostMapping("addreply")
    @PreAuthorize("isAuthenticated()")
    public void addCommentReply(@RequestBody Reply reply, Authentication authentication) {
        service.saveReply(reply, authentication);
        System.out.println("reply = " + reply);
    }

    @GetMapping("list/{postId}")
    public List<Comment> getreplyCommentList(@PathVariable Integer postId) {
        List<Comment> commentList = commentService.commentList(postId);
        for (Comment comment : commentList) {
            comment.setReplyList(service.replycommentList(comment.getCommentId()));
        }
        return commentList;
    }

}
