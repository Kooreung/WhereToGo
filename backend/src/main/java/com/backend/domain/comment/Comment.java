package com.backend.domain.comment;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Comment {
    private Integer commentId;
    private Integer postId;
    private Integer memberId;
    private String comment;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    private String nickName;
}
