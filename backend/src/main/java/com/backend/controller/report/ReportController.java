package com.backend.controller.report;

import com.backend.domain.report.Report;
import com.backend.service.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getComment(@RequestBody Report report, Authentication authentication) {
        System.out.println("report = " + report);
        if (reportService.validate(report)) {
            reportService.saveReport(report, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    // 신고게시글 조회 Controller
    @GetMapping("{reportId}")
    public ResponseEntity postRead(@PathVariable Integer reportId, Authentication authentication) {
        Report result = reportService.getReportByReportId(reportId);
        return ResponseEntity.ok().body(result);
    }

    // 신고게시글 목록 Controller
    @GetMapping("recordlist")
    public ResponseEntity postList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(value = "listSlider", defaultValue = "closely") String listSlider,
            @RequestParam(value = "type", required = false) String searchType,
            @RequestParam(value = "keyword", defaultValue = "") String searchKeyword,
            @RequestParam(value = "region", defaultValue = "") String searchReg,
            @RequestParam(value = "lat", required = false) Double latitude,
            @RequestParam(value = "lng", required = false) Double longitude) {
//        return reportService.getReportList(page, listSlider, searchType, searchKeyword, searchReg, latitude, longitude);
        try {
            return ResponseEntity.ok().body(reportService.getReportList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버에러 ㅋㅋ");
        }
    }
}
