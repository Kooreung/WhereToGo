package com.backend.mapper.report;

import com.backend.domain.report.Report;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReportMapper {
    @Insert("""
            INSERT INTO report (postId, commentId, reportReason, reportDetailReason, processYn, processDate, processorId, createId, creatDate)
            VALUES (#{postId}, #{commentId}, #{reportReason}, #{reportDetailReason}, #{processYn}, #{processDate}, #{processorId}, #{createId}, #{creatDate})
            """)
    void insertReport(Report report);

    @Select("""
            SELECT 
                    r.reportId, 
                     r.postId, 
                     r.commentId, 
                     r.reportReason, 
                     r.reportDetailReason, 
                     r.processYn, 
                     r.processDate, 
                     r.processorId, 
                     r.createId, 
                     r.creatDate,
                     p.title as titlename,
                     creator.nickName as creatorname
            FROM report r
            LEFT JOIN post p ON p.postId = r.postId
            LEFT JOIN comment c ON c.commentId = r.commentId
            LEFT JOIN member creator ON creator.memberId = r.createId
            LEFT JOIN member processor ON processor.memberId = r.processorId
            WHERE r.reportid = #{reportId}
            """)
    Report selectByReportId(int reportId);

    @Select("""
            SELECT 
                    r.reportId, 
                     r.postId, 
                     r.commentId, 
                     r.reportReason, 
                     r.reportDetailReason, 
                     r.processYn, 
                     r.processDate,
                     r.processorId, 
                     r.createId, 
                     r.creatDate,
                     p.title as titlename,
                     creator.nickName as creatorname
            FROM report r
            LEFT JOIN post p ON p.postId = r.postId
            LEFT JOIN comment c ON c.commentId = r.commentId
            LEFT JOIN member creator ON creator.memberId = r.createId
            LEFT JOIN member processor ON processor.memberId = r.processorId
            """)
    List<Report> select();
}