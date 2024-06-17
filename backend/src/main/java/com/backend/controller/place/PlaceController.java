package com.backend.controller.place;

import com.backend.domain.place.Place;
import com.backend.service.place.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/place")
public class PlaceController {
    private final PlaceService service;

    @PostMapping("/add")
    public ResponseEntity<String> addPlace(@RequestBody List<Place> places) {
        try {
            for (Place place : places) {
                service.addPlace(place);
                System.out.println("place = " + place);
            }
            return ResponseEntity.ok("장소가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            System.err.println("Error adding place: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("장소 추가 중 오류가 발생했습니다.");
        }
    }
}
