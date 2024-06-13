package com.backend.service.comment;

import com.backend.domain.comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void add(Comment comment) {
        mapper.insert(comment);
    }

    public List<Comment> list(Integer postId) {
        return mapper.selectByPostId(postId);
    }

    public void edit(Comment comment) {
        mapper.update(comment);
    }

    public void delete(Comment comment) {
        mapper.delete(comment);
    }
}
