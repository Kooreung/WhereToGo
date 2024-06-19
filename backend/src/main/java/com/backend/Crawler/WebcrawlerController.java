package com.backend.Crawler;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/web")
public class WebcrawlerController {

    private final WebCrawler webCrawler;

    @GetMapping("crawling/{keyword}")
    public Map<String, String> getCrawler(@PathVariable String keyword) throws UnsupportedEncodingException, InterruptedException {
        return webCrawler.crawler(keyword);
    }
}
