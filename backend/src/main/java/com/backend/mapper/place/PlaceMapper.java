package com.backend.mapper.place;

import com.backend.domain.place.Place;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlaceMapper {
    @Insert("""
            INSERT INTO Place (place_name, place_url, address, category, latitude, longitude)
            VALUES ()
            """)
    int insert(Place place);
}
