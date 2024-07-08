package com.backend.service.commentreply;

import com.backend.domain.reply.Reply;
import com.backend.mapper.commentreply.CommentReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentReplyService {
    final CommentReplyMapper mapper;

    public void saveReply(Reply reply, Authentication authentication) {
        reply.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insertReply(reply);
    }
}
