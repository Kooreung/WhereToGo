package com.backend.Crawler;

import lombok.Data;

import java.util.Map;

@Data
public class PlaceResponse {
    private Map<String, Integer> places;
    private Integer postId;
}
