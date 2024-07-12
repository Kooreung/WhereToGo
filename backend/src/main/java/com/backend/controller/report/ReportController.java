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

    //신고하기
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
            @RequestParam(defaultValue = "1") Integer page) {
        try {
            return ResponseEntity.ok().body(reportService.getReportList(page));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버에러 ㅋㅋ");
        }
    }

    // 신고 진행여부 Controller
    @PutMapping("reportprocess")
    public void reportProcess(@RequestBody Report report, Authentication authentication) {
        reportService.processmodify(report, authentication);

    }
}
