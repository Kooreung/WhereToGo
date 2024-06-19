package com.backend.mapper.place;

import com.backend.domain.place.Place;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface PlaceMapper {
    @Insert("""
            INSERT INTO place (placeName, placeUrl, address, category, latitude, longitude, postid)
            VALUES (#{placeName}, #{placeUrl}, #{address}, #{category}, #{latitude}, #{longitude}, #{postId})
            """)
    int insert(Place place);
}