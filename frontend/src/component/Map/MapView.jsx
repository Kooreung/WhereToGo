import React, { useEffect, useRef, useState } from "react";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
        map.setDraggable(false);
        map.setZoomable(false);
        setMap(map);

        const placesService = new window.kakao.maps.services.Places();
        setPs(placesService);
      })
      .catch((error) => {
        console.error("Kakao map script loading error: ", error);
      });
  }, [kakaoMapAppKey]);

  useEffect(() => {
    if (places.length > 0) {
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
            path,
            strokeWeight: 3,
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeStyle: "shortdash",
          });

          const distance = Math.round(polyline.getLength()); // 선의 총 거리를 계산합니다

          bounds.extend(path[0]);
          bounds.extend(path[1]);

          if (index === places.length - 2) {
            const content = DistanceInfo(distance);
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
    const walkSpeed = 67; // m/min
    const bikeSpeed = 267; // m/min

    const walkTime = Math.floor(distance / walkSpeed);
    const bikeTime = Math.floor(distance / bikeSpeed);

    const formatTime = (time) => {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return (
        <>
          {hours > 0 && <Badge>{hours}시간 </Badge>}
          <Badge>{minutes}분</Badge>
        </>
      );
    };

    return (
      <Box style={{ backgroundColor: "white", border: "1px solid black" }}>
        <Flex>
          <Text fontWeight="bold">총거리: </Text>
          <Text>{Math.round(distance)}</Text> m
        </Flex>
        <Box>
          <Text as="span" fontWeight="bold">
            도보:{" "}
          </Text>
          {formatTime(walkTime)}
        </Box>
        <Box>
          <Text as="span" fontWeight="bold">
            자전거:{" "}
          </Text>
          {formatTime(bikeTime)}
        </Box>
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
