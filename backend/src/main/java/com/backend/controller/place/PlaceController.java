package com.backend.controller.place;

import com.backend.Crawler.PlaceResponse;
import com.backend.domain.place.Place;
import com.backend.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/place")
public class PlaceController {
    private final PlaceService service;

    @PostMapping("/add")
    public ResponseEntity addPlace(@RequestBody List<Place> places) {
        try {
            Map<String, Integer> map = new HashMap<>();
            for (Place place : places) {
                service.addPlace(place);
                map.put(place.getPlaceName(), place.getPlaceId());
            }
            PlaceResponse placeResponse = new PlaceResponse();
            placeResponse.setPlaces(map);
            placeResponse.setPostId(places.get(0).getPostId());
            return ResponseEntity.ok(placeResponse);
        } catch (Exception e) {
            System.err.println("Error adding place: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("장소 추가 중 오류가 발생했습니다.");
        }
    }
}
