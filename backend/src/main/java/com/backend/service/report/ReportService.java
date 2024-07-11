package com.backend.service.report;

import com.backend.domain.report.Report;
import com.backend.mapper.report.ReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ReportService {

    private final ReportMapper reportMapper;

    public List<Report> getReportList() {
        return reportMapper.select();
    }

    public Report getReportByReportId(int reportId) {
        return reportMapper.selectByReportId(reportId);
    }

    public void saveReport(Report report, Authentication authentication) {
        report.setCreateId(Integer.valueOf(authentication.getName()));
        reportMapper.insertReport(report);
    }

    public boolean validate(Report report) {
        if (report.getPostId() == null) {
            return false;
        } else {
            return true;
        }
    }
}
