package com.backend.Crawler;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WebrawlerMapper {

    @Select("""
            SELECT picurl From placepic
            where placename = #{placeName}
            """)
    String selectImage(String placeName);
}
