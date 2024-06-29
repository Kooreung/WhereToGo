package com.backend.Crawler;


import com.backend.domain.place.Place;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/web")
public class WebcrawlerController {

    private final WebCrawlerService webCrawlerService;

    @PostMapping("crawling")
    public Map<String, Map<String, String>> getCrawler(@RequestBody List<Place> places) throws InterruptedException {
        return webCrawlerService.imageCrawling(places);
    }
}
