package com.backend.service.commentreply;

import com.backend.domain.reply.Reply;
import com.backend.mapper.commentreply.CommentReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentReplyService {
    final CommentReplyMapper mapper;

    public void saveReply(Reply reply, Authentication authentication) {
        reply.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insertReply(reply);
    }

    public List<Reply> replycommentList(Integer commentId) {
        return mapper.selectReplyCommentList(commentId);
    }

    public void editReply(Reply reply, Authentication authentication) {
        reply.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.modifyReply(reply);
    }

    public boolean validate(Reply reply) {
        if (reply.getReplyComment().isBlank()) {
            return false;
        }
        return true;
    }
}
