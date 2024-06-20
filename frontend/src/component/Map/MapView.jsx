import React, { useEffect, useRef, useState } from "react";
import { Badge, Box, Text, UnorderedList } from "@chakra-ui/react";
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
  const [distanceSum, setDistanceSum] = useState(0);

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

        const placesService = new window.kakao.maps.services.Places();
        setPs(placesService);
      })
      .catch((error) => {
        console.error("Kakao map script loading error: ", error);
      });
  }, [kakaoMapAppKey]);

  useEffect(() => {
    if (map !== null && places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();

      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const postMarkers = places.map((place) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            place.latitude,
            place.longitude,
          ),
          map: map,
          title: place.place_name,
        });
        bounds.extend(marker.getPosition());
        return marker;
      });
      setMarkers(postMarkers);
      map.setBounds(bounds);
    }
  }, [map, places]);

  useEffect(() => {
    if (map) {
      polylines.forEach((polyline) => polyline.setMap(null));

      if (places.length > 1) {
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
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeStyle: "shortdash",
          });

          const distance = Math.round(polyline.getLength()); // 선의 총 거리를 계산합니다
          setDistanceSum(distanceSum + distance);

          bounds.extend(path[0]);
          bounds.extend(path[1]);

          if (index === places.length - 2) {
            const content = renderToString(
              <DistanceInfo distance={distance} />,
            );
            showDistance(content, path[1]);
          }
          return polyline;
        });

        setPolylines(newPolylines.filter((polyline) => polyline !== null));
        map.setBounds(bounds);
      } else {
        setPolylines([]);
      }
    }
  }, [map, places]);

  // 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
  // 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
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
          opacity: "0.75",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <UnorderedList>
          <Box>
            <Text as="span" style={{ fontWeight: "bold" }}>
              총거리:{" "}
            </Text>
            <Badge>{distance}</Badge> m
          </Box>
          <Box>
            <Text as="span" style={{ fontWeight: "bold" }}>
              도보:{" "}
            </Text>
            {walkHour > 0 && <Badge>{walkHour}시간 </Badge>}
            <Badge>{walkMin}분</Badge>
          </Box>
          <Box>
            <Text as="span" style={{ fontWeight: "bold" }}>
              자전거:{" "}
            </Text>
            {bicycleHour > 0 && <Badge>{bicycleHour}시간 </Badge>}
            <Badge>{bicycleMin}분</Badge>
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
