package com.backend.domain.reply;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Reply {
    private Integer replyId;
    private Integer commentId;
    private Integer postId;
    private Integer memberId;
    private String replyComment;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    private String nickName;
}
