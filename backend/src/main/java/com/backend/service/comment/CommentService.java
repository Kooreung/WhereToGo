package com.backend.service.comment;

import com.backend.domain.comment.Comment;
import com.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void add(Comment comment) {
        mapper.insert(comment);
    }

    public void list() {
        mapper.selectByPostId();
    }

    public void edit() {
        mapper.update();
    }

    public void delete() {
        mapper.delete();
    }
}
