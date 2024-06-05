package com.backend.mapper.comment;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper {
    void insert();

    void selectByPostId();

    void update();

    void delete();

}
