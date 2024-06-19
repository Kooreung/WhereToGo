import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

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

const KakaoMapSearch = ({ selectedPlaces, setSelectedPlaces }) => {
  const mapRef = useRef(null);
  const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);

  const postPlaces = [
    { y: 37.44935034, x: 126.65431538, place_name: "1번" },
    { y: 37.4476009, x: 126.65319672, place_name: "2번" },
    { y: 37.44755103, x: 126.64851381, place_name: "3번" },
  ];

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

        const bounds = new window.kakao.maps.LatLngBounds();
        const postMarkers = postPlaces.map((place) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),
            map: map,
            title: place.place_name,
          });
          bounds.extend(marker.getPosition());
          return marker;
        });
        setMarkers(postMarkers);
        map.setBounds(bounds);
      })
      .catch((error) => {
        console.error("Kakao map script loading error: ", error);
      });
  }, [kakaoMapAppKey]);

  useEffect(() => {
    if (map && places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();

      const newMarkers = places.map((place) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(place.y, place.x),
          map: map,
          title: place.place_name,
        });
        bounds.extend(marker.getPosition());
        return marker;
      });
      setMarkers(newMarkers);
      map.setBounds(bounds);
    }
  }, [map, places]);

  // useEffect(() => {
  //   if (map) {
  //     polylines.forEach((polyline) => polyline.setMap(null));
  //
  //     if (selectedPlaces.length > 1) {
  //       const bounds = new window.kakao.maps.LatLngBounds();
  //       const newPolylines = selectedPlaces.map((place, index) => {
  //         if (index === selectedPlaces.length - 1) return null;
  //         const polyline = new window.kakao.maps.Polyline({
  //           map: map,
  //           path: [
  //             new window.kakao.maps.LatLng(
  //               selectedPlaces[index].y,
  //               selectedPlaces[index].x,
  //             ),
  //             new window.kakao.maps.LatLng(
  //               selectedPlaces[index + 1].y,
  //               selectedPlaces[index + 1].x,
  //             ),
  //           ],
  //           strokeWeight: 3,
  //           strokeColor: "#FF0000",
  //           strokeOpacity: 0.7,
  //           strokeStyle: "solid",
  //         });
  //         bounds.extend(
  //           new window.kakao.maps.LatLng(
  //             selectedPlaces[index].y,
  //             selectedPlaces[index].x,
  //           ),
  //         );
  //         bounds.extend(
  //           new window.kakao.maps.LatLng(
  //             selectedPlaces[index + 1].y,
  //             selectedPlaces[index + 1].x,
  //           ),
  //         );
  //         return polyline;
  //       });
  //       setPolylines(newPolylines.filter((polyline) => polyline !== null));
  //       map.setBounds(bounds);
  //     } else {
  //       setPolylines([]);
  //     }
  //   }
  // }, [map, selectedPlaces]);

  return (
    <Box>
      <Box id="map" ref={mapRef} w={"576px"} h={"360px"}></Box>
    </Box>
  );
};

export default KakaoMapSearch;
