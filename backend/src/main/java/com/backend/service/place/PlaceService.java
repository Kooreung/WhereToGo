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
        String addressCode = "";
        switch (addressParts[0]) {
            case "서울": {
                addressCode = getCitySeoulCode(addressParts[1]);
                break;
            }
            case "경기": {
                addressCode = getCityGyeonggiCode(addressParts[1]);
                break;
            }
            case "인천": {
                addressCode = getCityIncheonCode(addressParts[1]);
                break;
            }
        }

        place.setAddressCode(addressCode);
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
        gyeonggiCity.put("파주시", "4100000001");
        gyeonggiCity.put("김포시", "4100000001");
        gyeonggiCity.put("고양시", "4100000001");
        gyeonggiCity.put("양주시", "4100000002");
        gyeonggiCity.put("의정부시", "4100000002");
        gyeonggiCity.put("연천시", "4100000003");
        gyeonggiCity.put("동두천시", "4100000003");
        gyeonggiCity.put("포천시", "4100000003");
        gyeonggiCity.put("남양주시", "4100000004");
        gyeonggiCity.put("가평시", "4100000004");
        gyeonggiCity.put("구리시", "4100000005");
        gyeonggiCity.put("하남시", "4100000005");
        gyeonggiCity.put("양평시", "4100000006");
        gyeonggiCity.put("광주시", "4100000006");
        gyeonggiCity.put("여주시", "4100000007");
        gyeonggiCity.put("이천시", "4100000007");
        gyeonggiCity.put("용인시", "4100000008");
        gyeonggiCity.put("안성시", "4100000008");
        gyeonggiCity.put("성남시", "4100000009");
        gyeonggiCity.put("과천시", "4100000009");
        gyeonggiCity.put("의왕시", "4100000009");
        gyeonggiCity.put("수원시", "4100000010");
        gyeonggiCity.put("화성시", "4100000010");
        gyeonggiCity.put("오산시", "4100000011");
        gyeonggiCity.put("평택시", "4100000011");
        gyeonggiCity.put("안양시", "4100000012");
        gyeonggiCity.put("군포시", "4100000012");
        gyeonggiCity.put("안산시", "4100000012");
        gyeonggiCity.put("부천시", "4100000013");
        gyeonggiCity.put("광명시", "4100000013");
        gyeonggiCity.put("시흥시", "4100000013");

        return gyeonggiCity.getOrDefault(city, ""); // 없으면 빈 문자열 반환
    }

    private String getCityIncheonCode(String city) {
        Map<String, String> incheonCity = new HashMap<>();
        incheonCity.put("계양구", "2800000001");
        incheonCity.put("부평구", "2800000002");
        incheonCity.put("미추홀구", "2800000003");
        incheonCity.put("남동구", "2800000004");
        incheonCity.put("서구", "2800000005");
        incheonCity.put("동구", "2800000006");
        incheonCity.put("중구", "2800000007");
        incheonCity.put("연수구", "2800000008");
        incheonCity.put("옹진군", "2800000009");
        incheonCity.put("강화군", "2800000010");

        return incheonCity.getOrDefault(city, ""); // 없으면 빈 문자열 반환
    }
}


