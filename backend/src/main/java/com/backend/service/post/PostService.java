package com.backend.service.post;

import com.backend.mapper.post.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    public void add () {
        postMapper.insert();
    }

}
