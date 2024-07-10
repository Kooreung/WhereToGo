package com.backend.controller.place;

import com.backend.domain.place.Location;
import com.backend.service.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class LocationController {

    private final PostService postService;

    @PostMapping("/nowPosition")
    public Map<String, Object> receiveLocation(@RequestBody Location location) {
        Double latitude = location.getLatitude();
        Double longitude = location.getLongitude();

        return postService.getPostListByLocation(latitude, longitude);
    }
}
