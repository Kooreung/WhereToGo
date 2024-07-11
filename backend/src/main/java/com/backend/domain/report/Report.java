package com.backend.domain.report;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Report {
    private Integer reportid;
    private Integer postid;
    private Integer commentid;
    private String reportreason;
    private String repostdetailreason;
    private String processyn;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate processdate;
    private Integer processorid;
    private Integer createid;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate creatdate;

    private String titlename;
    private String creatorname;
//    private Post post;
//    private Member creator;
//    private Member processor;
//    private Comment comment;
}
