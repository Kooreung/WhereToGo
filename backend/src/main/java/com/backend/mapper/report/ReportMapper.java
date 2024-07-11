package com.backend.mapper.report;

import com.backend.domain.report.Report;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReportMapper {
    @Insert("""
            INSERT INTO report (postid, commentid, reportreason, repostdetailreason, processyn, processdate, processorid, createid, creatdate)
            VALUES (#{postId}, #{commentId}, #{reportReason}, #{repostDetailReason}, #{processYn}, #{processDate}, #{processorId}, #{createId}, #{createDate})
            """)
    void insertReport(Report report);

    @Select("""
            SELECT 
                    r.reportid, 
                     r.postid, 
                     r.commentid, 
                     r.reportreason, 
                     r.repostdetailreason, 
                     r.processyn, 
                     r.processdate, 
                     r.processorid, 
                     r.createid, 
                     r.creatdate,
                     p.title as titlename,
                     c.nickname as creatorname
            FROM report r
            LEFT JOIN post p ON p.postid = r.postid
            LEFT JOIN comment c ON c.commentid = r.commentid
            LEFT JOIN member creator ON creator.memberid = r.createid
            LEFT JOIN member processor ON processor.memberid = r.processorid
            WHERE r.reportid = #{reportId}
            """)
    Report selectByReportId(int reportId);

    @Select("""
            SELECT 
                    r.reportid, 
                     r.postid, 
                     r.commentid, 
                     r.reportreason, 
                     r.repostdetailreason, 
                     r.processyn, 
                     r.processdate, 
                     r.processorid, 
                     r.createid, 
                     r.creatdate,
                     p.title as titlename,
                     creator.nickname as creatorname
            FROM report r
            LEFT JOIN post p ON p.postid = r.postid
            LEFT JOIN comment c ON c.commentid = r.commentid
            LEFT JOIN member creator ON creator.memberid = r.createid
            LEFT JOIN member processor ON processor.memberid = r.processorid
            """)
    List<Report> select();
}