import React, { useEffect, useRef, useState } from "react";
import { Box, Text, UnorderedList } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { renderToString } from "react-dom/server";

const loadKakaoMapScript = (appKey, libraries = []) => {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById("kakao-map-script");

    if (!existingScript) {
      const script = document.createElement("script");
      const librariesParam =
        libraries.length > 0 ? `&libraries=${libraries.join(",")}` : "";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false${librariesParam}`;
      script.id = "kakao-map-script";
      script.onload = () => {
        window.kakao.maps.load(resolve);
      };
      script.onerror = () => {
        reject(new Error("Kakao map script failed to load"));
      };
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(resolve);
    }
  });
};

const KakaoMapSearch = () => {
  const { postId } = useParams();
  const mapRef = useRef(null);
  const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [distanceOverlay, setDistanceOverlay] = useState(null);
  const [distancePartOverlay, setPartDistanceOverlay] = useState(null);
  let distance = 0;
  let partDistance = 0;

  useEffect(() => {
    axios.get(`/api/post/${postId}/place`).then((res) => {
      setPlaces(res.data);
    });
  }, [postId]);

  useEffect(() => {
    loadKakaoMapScript(kakaoMapAppKey, ["services"])
      .then(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(
            37.567157695939926,
            126.979353948294,
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        setMap(map);

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        const placesService = new window.kakao.maps.services.Places();
        setPs(placesService);
      })
      .catch((error) => {
        console.error("Kakao map script loading error: ", error);
      });
  }, [kakaoMapAppKey]);

  // 선택한 장소에 따른 커스텀 오버레이 생성
  useEffect(() => {
    if (map !== null && places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      const postMarkers = places.map((place, index) => {
        let content = renderToString(<PostSelectedPlaceMarker index={index} />);
        const customMarker = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(
            place.latitude,
            place.longitude,
          ),
          content: content,
          title: place.place_name,
        });
        customMarker.setMap(map);
        bounds.extend(customMarker.getPosition());
        return customMarker;
      });
      setMarkers(postMarkers);
      map.setBounds(bounds);
    }
  }, [map, places]);

  // 선택한 장소에 따른 폴리라인과 선의 거리 계산 해주는 오버레이 표기
  useEffect(() => {
    if (map) {
      polylines.forEach((polyline) => polyline.setMap(null));

      const bounds = new window.kakao.maps.LatLngBounds();
      const newPolylines = places.map((place, index) => {
        if (index === places.length - 1) return null;
        const path = [
          new window.kakao.maps.LatLng(
            places[index].latitude,
            places[index].longitude,
          ),
          new window.kakao.maps.LatLng(
            places[index + 1].latitude,
            places[index + 1].longitude,
          ),
        ];

        const polyline = new window.kakao.maps.Polyline({
          map: map,
          path: path,
          strokeWeight: 3,
          strokeColor: "#E6B143",
          strokeOpacity: 1,
          strokeStyle: "shortdash",
        });

        distance += Math.round(polyline.getLength()); // 선의 총 거리를 계산합니다
        partDistance = Math.round(polyline.getLength());

        const partContent = renderToString(
          <PartDistanceInfo distance={partDistance} />,
        );
        showPartDistance(partContent, path[1]);

        bounds.extend(path[0]);
        bounds.extend(path[1]);

        if (index === places.length - 2) {
          const content = renderToString(<DistanceInfo distance={distance} />);
          showDistance(content, path[1]);
        }
        return polyline;
      });

      setPolylines(newPolylines.filter((polyline) => polyline !== null));
      map.setBounds(bounds);
    }
  }, [map, places]);

  // 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
  function showDistance(content, position) {
    if (distanceOverlay) {
      distanceOverlay.setMap(null);
    }

    // 커스텀 오버레이를 생성하고 지도에 표시합니다
    const newDistanceOverlay = new kakao.maps.CustomOverlay({
      map: map, // 커스텀오버레이를 표시할 지도입니다
      content: content, // 커스텀오버레이에 표시할 내용입니다
      position: position, // 커스텀오버레이를 표시할 위치입니다.
      xAnchor: 0,
      yAnchor: 0,
      zIndex: 3,
    });
    setDistanceOverlay(newDistanceOverlay);
  }

  // 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
  function showPartDistance(content, position) {
    if (distanceOverlay) {
      distanceOverlay.setMap(null);
    }

    // 커스텀 오버레이를 생성하고 지도에 표시합니다
    const newPartDistanceOverlay = new kakao.maps.CustomOverlay({
      map: map, // 커스텀오버레이를 표시할 지도입니다
      content: content, // 커스텀오버레이에 표시할 내용입니다
      position: position, // 커스텀오버레이를 표시할 위치입니다.
      xAnchor: 1,
      yAnchor: 2,
      zIndex: 2,
    });
    setPartDistanceOverlay(newPartDistanceOverlay);
  }

  function PartDistanceInfo({ distance }) {
    return (
      <Box
        style={{
          border: "1px solid black",
          borderRadius: "10px",
          backgroundColor: "white",
          opacity: "0.75",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <UnorderedList>
          <Box>
            <Text as="span">거리: </Text>
            <Text as="span" style={{ color: "#836091", fontWeight: "bold" }}>
              {distance}
            </Text>{" "}
            <Text as="span">m </Text>
          </Box>
        </UnorderedList>
      </Box>
    );
  }

  // 해당 인덱스의 마커
  function PostSelectedPlaceMarker({ index }) {
    return (
      <Box
        style={{
          borderRadius: "100%",
          backgroundColor: "white",
          paddingLeft: "8px",
          paddingRight: "8px",
          boxShadow: "0 0 0 4px #836091, 0 0 0 8px #D8B7E5",
        }}
      >
        {index + 1}
      </Box>
    );
  }

  function DistanceInfo({ distance }) {
    // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
    const walkTime = Math.floor(distance / 67);
    const walkHour = Math.floor(walkTime / 60);
    const walkMin = walkTime % 60;

    // 자전거의 평균 시속은 16km/h 이고 자전거의 분속은 267m/min입니다
    const bicycleTime = Math.floor(distance / 267);
    const bicycleHour = Math.floor(bicycleTime / 60);
    const bicycleMin = bicycleTime % 60;

    return (
      <Box
        style={{
          border: "1px solid black",
          borderRadius: "10px",
          backgroundColor: "white",
          opacity: "0.9",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <UnorderedList>
          <Box>
            <Text as="span">총거리: </Text>
            <Text as="span" style={{ color: "#836091", fontWeight: "bold" }}>
              {distance}
            </Text>
            <Text as="span"> m</Text>
          </Box>
          <Box>
            <Text as="span">도보: </Text>
            {walkHour > 0 && (
              <>
                <Text
                  as="span"
                  style={{ color: "#836091", fontWeight: "bold" }}
                >
                  {walkHour}
                </Text>
                <Text as="span"> 시간 </Text>
              </>
            )}
            <Text as="span" style={{ color: "#836091", fontWeight: "bold" }}>
              {walkMin}
            </Text>
            <Text as="span"> 분</Text>
          </Box>
          <Box>
            <Text as="span">자전거: </Text>
            {bicycleHour > 0 && (
              <>
                <Text
                  as="span"
                  style={{ color: "#836091", fontWeight: "bold" }}
                >
                  {bicycleHour}
                </Text>
                <Text as="span"> 시간 </Text>
              </>
            )}
            <Text as="span" style={{ color: "#836091", fontWeight: "bold" }}>
              {bicycleMin}
            </Text>
            <Text as="span"> 분</Text>
          </Box>
        </UnorderedList>
      </Box>
    );
  }

  return (
    <Box>
      <Box id="map" ref={mapRef} w={"576px"} h={"360px"}></Box>
    </Box>
  );
};

export default KakaoMapSearch;
