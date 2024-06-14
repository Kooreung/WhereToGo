package com.backend.domain.post;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Post {
    private Integer postId;
    private String title;
    private String content;
    private String nickName;
    private Integer viewCount;
    private LocalDateTime postDate;

    private Integer memberId;
    private Integer likeCount;
    private Integer commentCount;
}
