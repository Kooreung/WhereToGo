package com.backend.domain.post;


import lombok.Data;

@Data
public class Banner {
    private int bannerId;
    private String city;
    private String link;
    private String bannerSrc;
}
