package com.backend.controller.place;

import com.backend.domain.place.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class LocationController {

    @PostMapping("/nowPosition")
    public void receiveLocation(@RequestBody Location location) {
        double latitude = location.getLatitude();
        double longitude = location.getLongitude();
        
        System.out.println("latitude = " + latitude);
        System.out.println("longitude = " + longitude);
    }
}
