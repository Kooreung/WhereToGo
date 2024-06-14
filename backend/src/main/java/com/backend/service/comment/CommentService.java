package com.backend.service.comment;

import com.backend.domain.comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void add(Comment comment, Authentication authentication) {
        comment.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(comment);
    }

    public List<Comment> list(Integer postId) {
        return mapper.selectByPostId(postId);
    }

    public void edit(Comment comment) {
        mapper.update(comment);
    }

    public void delete(Comment comment, Authentication authentication) {
        mapper.delete(comment);
    }

    public boolean hasAccess(Comment comment, Authentication authentication) {
        Comment db = mapper.selectById(comment.getCommentId());
        if (db == null) {
            return false;
        }
        if (!authentication.getName().equals(db.getMemberId().toString())) {
            return false;
        }
        return true;
    }
}
