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

    public void saveComment(Comment comment, Authentication authentication) {
        comment.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insertComment(comment);
    }

    public List<Comment> commentList(Integer postId) {
        return mapper.selectByPostId(postId);
    }

    public void commentEdit(Comment comment) {
        mapper.update(comment);
    }

    public void commentDelete(Comment comment, Authentication authentication) {
        mapper.delete(comment);
    }

    public boolean hasMemberIdAccess(Comment comment, Authentication authentication) {
        Comment db = mapper.selectByCommentId(comment.getCommentId());
        if (db == null) {
            return false;
        }
        if (!authentication.getName().equals(db.getMemberId().toString())) {
            return false;
        }
        return true;
    }

    public boolean validate(Comment comment) {
        if (comment == null) {
            return false;
        }
        if (comment.getComment().isBlank()) {
            return false;
        }
        return true;
    }
}
