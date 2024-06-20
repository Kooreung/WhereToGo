import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
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
    if (map && places.length > 0) {
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

          bounds.extend(path[0]);
          bounds.extend(path[1]);
          return polyline;
        });
        setPolylines(newPolylines.filter((polyline) => polyline !== null));
        map.setBounds(bounds);
      } else {
        setPolylines([]);
      }
    }
  }, [map, places]);

  return (
    <Box>
      <Box id="map" ref={mapRef} w={"576px"} h={"360px"}></Box>
    </Box>
  );
};

export default KakaoMapSearch;
