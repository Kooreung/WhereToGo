package com.backend.mapper.place;

import com.backend.domain.place.Place;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;


@Mapper
public interface PlaceMapper {
    @Insert("""
            INSERT INTO place (placeName, placeUrl, address, category, latitude, longitude, postid, addressCode, placeIndex)
            VALUES (#{placeName}, #{placeUrl}, #{address}, #{category}, #{latitude}, #{longitude}, #{postId}, #{addressCode}, #{placeIndex})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "placeId")
    int insert(Place place);

    @Insert("""
            INSERT INTO placepic (placeid,placename,picurl)
            VALUES (#{placeId},#{placeName} ,#{picUrl})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "picid")
    int insertPlacePicture(Integer placeId, String placeName, String picUrl);
}