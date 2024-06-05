package com.backend.domain.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer commentId;
    private Integer postId;
    private Integer memberId;
    private String comment;
    private LocalDateTime createDate;
    private String nickName;
}
