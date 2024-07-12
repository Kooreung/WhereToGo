package com.backend.service.report;

import com.backend.domain.report.Report;
import com.backend.mapper.report.ReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ReportService {

    private final ReportMapper reportMapper;

    public Map<String, Object> getReportList(Integer page) {
        Map pageInfo = new HashMap();

        Integer countAllPost = reportMapper.countAllSelect();
        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAllPost - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;

        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 9;
        leftPageNumber = Math.max(leftPageNumber, 1);

        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPageNumber = rightPageNumber + 1;

        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPageNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPageNumber);
        }

        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);
        List<Report> report = reportMapper.select(page, offset);
        return Map.of("pageInfo", pageInfo, "reportList", report);
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

    public void processmodify(Report report, Authentication authentication) {
        report.setProcessorId(Integer.valueOf(authentication.getName()));
        reportMapper.updateReport(report);
    }
}
