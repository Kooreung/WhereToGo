package com.backend.service.place;

import com.backend.domain.place.Place;
import com.backend.mapper.place.PlaceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceMapper mapper;

    @Transactional
    public void addPlace(Place place) {
        String[] addressParts = place.getAddress().split(" ");
        String addressCountry = "";
        String addressCity = "";
        switch (addressParts[0]) {
            case "서울": {
                addressCountry = "1100000000";
                addressCity = getCitySeoulCode(addressParts[1]);
                break;
            }
            case "경기": {
                addressCountry = "4100000000";
                addressCity = getCityGyeonggiCode(addressParts[1]);
                break;
            }
        }

        place.setAddressCountry(addressCountry);
        place.setAddressCity(addressCity);
        mapper.insert(place);
    }

    private String getCitySeoulCode(String city) {
        Map<String, String> seoulCity = new HashMap<>();
        seoulCity.put("송파구", "1100000001");
        seoulCity.put("강동구", "1100000001");
        seoulCity.put("강남구", "1100000002");
        seoulCity.put("서초구", "1100000002");
        seoulCity.put("영등포구", "1100000003");
        seoulCity.put("동작구", "1100000003");
        seoulCity.put("관악구", "1100000003");
        seoulCity.put("구로구", "1100000004");
        seoulCity.put("금천구", "1100000004");
        seoulCity.put("강서구", "1100000005");
        seoulCity.put("양천구", "1100000005");
        seoulCity.put("마포구", "1100000006");
        seoulCity.put("은평구", "1100000006");
        seoulCity.put("서대문구", "1100000006");
        seoulCity.put("종로구", "1100000007");
        seoulCity.put("용산구", "1100000007");
        seoulCity.put("중구", "1100000007");
        seoulCity.put("성북구", "1100000008");
        seoulCity.put("강북구", "1100000008");
        seoulCity.put("도봉구", "1100000009");
        seoulCity.put("노원구", "1100000009");
        seoulCity.put("동대문구", "1100000010");
        seoulCity.put("중랑구", "1100000010");
        seoulCity.put("성동구", "1100000011");
        seoulCity.put("광진구", "1100000011");

        return seoulCity.getOrDefault(city, ""); // 없으면 빈 문자열 반환
    }

    private String getCityGyeonggiCode(String city) {
        Map<String, String> gyeonggiCity = new HashMap<>();
        gyeonggiCity.put("파주", "4100000001");
        gyeonggiCity.put("김포", "4100000001");
        gyeonggiCity.put("고양", "4100000001");
        gyeonggiCity.put("양주", "4100000002");
        gyeonggiCity.put("의정부", "4100000002");
        gyeonggiCity.put("연천", "4100000003");
        gyeonggiCity.put("동두천", "4100000003");
        gyeonggiCity.put("포천", "4100000003");
        gyeonggiCity.put("남양주", "4100000004");
        gyeonggiCity.put("가평", "4100000004");
        gyeonggiCity.put("구리", "4100000005");
        gyeonggiCity.put("하남", "4100000005");
        gyeonggiCity.put("양평", "4100000006");
        gyeonggiCity.put("광주", "4100000006");
        gyeonggiCity.put("여주", "4100000007");
        gyeonggiCity.put("이천", "4100000007");
        gyeonggiCity.put("용인", "4100000008");
        gyeonggiCity.put("안성", "4100000008");
        gyeonggiCity.put("성남", "4100000009");
        gyeonggiCity.put("과천", "4100000009");
        gyeonggiCity.put("의왕", "4100000009");
        gyeonggiCity.put("수원", "4100000010");
        gyeonggiCity.put("화성", "4100000010");
        gyeonggiCity.put("오산", "4100000011");
        gyeonggiCity.put("평택", "4100000011");
        gyeonggiCity.put("안양", "4100000012");
        gyeonggiCity.put("군포", "4100000012");
        gyeonggiCity.put("안산", "4100000012");
        gyeonggiCity.put("부천", "4100000013");
        gyeonggiCity.put("광명", "4100000013");
        gyeonggiCity.put("시흥", "4100000013");

        return gyeonggiCity.getOrDefault(city, ""); // 없으면 빈 문자열 반환
    }
}


