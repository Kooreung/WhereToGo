package com.backend.controller.place;

import com.backend.domain.place.Place;
import com.backend.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/place")
public class PlaceController {
    private final PlaceService service;

    @GetMapping("add")
    public void addPlace(@RequestParam Place place) {
        System.out.println("place = " + place);
        service.selectadd(place);
    }
}
