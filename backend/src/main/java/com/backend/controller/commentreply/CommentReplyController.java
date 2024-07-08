package com.backend.controller.commentreply;

import com.backend.domain.reply.Reply;
import com.backend.service.commentreply.CommentReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/replycomment")
public class CommentReplyController {
    final CommentReplyService service;

    @PostMapping("addreply")
    @PreAuthorize("isAuthenticated()")
    public void addCommentReply(@RequestBody Reply reply, Authentication authentication) {
        service.saveReply(reply, authentication);
        System.out.println("reply = " + reply);
    }

}
