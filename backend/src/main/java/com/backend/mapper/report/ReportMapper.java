package com.backend.mapper.report;

import com.backend.domain.report.Report;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ReportMapper {
    @Insert("""
            INSERT INTO report (postId, commentId, reportReason, reportDetailReason, processDate, processorId, createId)
            VALUES (#{postId}, #{commentId}, #{reportReason}, #{reportDetailReason}, #{processDate}, #{processorId}, #{createId})
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
            ORDER BY r.reportId DESC
            LIMIT #{offset}, 10
            """)
    List<Report> select(Integer page, Integer offset);

    @Select("""
            SELECT COUNT(DISTINCT r.reportId)
            FROM report r
            LEFT JOIN post p ON p.postId = r.postId
            LEFT JOIN comment c ON c.commentId = r.commentId
            LEFT JOIN member creator ON creator.memberId = r.createId
            LEFT JOIN member processor ON processor.memberId = r.processorId
            """)
    Integer countAllSelect();

    @Update("""
            UPDATE report
            SET processYn= #{processYn}, processorId= #{processorId}
            WHERE reportId= #{reportId}
            """)
    void updateReport(Report report);
}