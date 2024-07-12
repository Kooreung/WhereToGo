package com.backend.domain.place;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Place {
    private Integer placeId;
    private String placeName;
    private String placeUrl;
    private String address;
    private String category;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    private Integer placeIndex;
    private Integer postId;
    private String picurl;
    private Integer countPlace;
    private String addressCode;
}

