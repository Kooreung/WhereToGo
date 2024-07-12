package com.backend.domain.comment;

import com.backend.domain.reply.Reply;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class Comment {
    private Integer commentId;
    private Integer postId;
    private Integer memberId;
    private String comment;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    private String nickName;
    //    대댓글 담기 객체
    private List<Reply> replyList;
    private Integer replyCount;
}
