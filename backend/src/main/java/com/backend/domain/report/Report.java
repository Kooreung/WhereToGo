package com.backend.domain.report;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Report {
    private Integer reportId;
    private Integer postId;
    private Integer commentId;
    private String reportReason;
    private String reportDetailReason;
    private String processYn;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate processDate;
    private Integer processorId;
    private Integer createId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate creatDate;

    private String titleName;
    private String creatorName;
    private String processorName;
//    private Post post;
//    private Member creator;
//    private Member processor;
//    private Comment comment;
}
