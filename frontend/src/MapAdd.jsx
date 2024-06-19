import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Input, Link, Spacer } from "@chakra-ui/react";

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
    if (map && places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();

      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const newMarkers = places.map((place) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(place.y, place.x),
          map: map,
          title: place.place_name,
        });
        bounds.extend(marker.getPosition());
        console.log(marker);
        return marker;
      });
      setMarkers(newMarkers);
      map.setBounds(bounds);
    }
  }, [map, places]);

  useEffect(() => {
    if (map) {
      polylines.forEach((polyline) => polyline.setMap(null));

      if (selectedPlaces.length > 1) {
        const bounds = new window.kakao.maps.LatLngBounds();

        const newPolylines = selectedPlaces.map((place, index) => {
          if (index === selectedPlaces.length - 1) return null;
          const polyline = new window.kakao.maps.Polyline({
            map: map,
            path: [
              new window.kakao.maps.LatLng(
                selectedPlaces[index].y,
                selectedPlaces[index].x,
              ),
              new window.kakao.maps.LatLng(
                selectedPlaces[index + 1].y,
                selectedPlaces[index + 1].x,
              ),
            ],
            strokeWeight: 3,
            strokeColor: "#FF0000",
            strokeOpacity: 0.7,
            strokeStyle: "solid",
          });
          bounds.extend(
            new window.kakao.maps.LatLng(
              selectedPlaces[index].y,
              selectedPlaces[index].x,
            ),
          );
          bounds.extend(
            new window.kakao.maps.LatLng(
              selectedPlaces[index + 1].y,
              selectedPlaces[index + 1].x,
            ),
          );
          return polyline;
        });
        setPolylines(newPolylines.filter((polyline) => polyline !== null));
        map.setBounds(bounds);
      } else {
        setPolylines([]);
      }
    }
  }, [map, selectedPlaces]);

  const searchPlaces = () => {
    if (!ps || !searchTerm) return;

    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(result);
      } else {
        alert("검색 결과가 존재하지 않습니다.");
      }
    };

    let getMapCenter = map.getCenter();

    ps.keywordSearch(searchTerm, callback, {
      radius: 20000,

      location: new kakao.maps.LatLng(
        getMapCenter.getLat(),
        getMapCenter.getLng(),
      ),
      size: 10,
    });
  };

  const selectPlace = (place) => {
    if (selectedPlaces.length < 3) {
      setSelectedPlaces([...selectedPlaces, place]);
      setSearchTerm("");
    } else {
      alert("최대 3개의 장소만 선택할 수 있습니다.");
    }
  };

  const removePlace = (index) => {
    const newSelectedPlaces = selectedPlaces.filter((_, i) => i !== index);
    setSelectedPlaces(newSelectedPlaces);
  };

  // function saveSelectedPlacesToServer() {
  //   selectedPlaces.map((place) => ({
  //     placeName: place.place_name,
  //     placeUrl: place.place_url,
  //     address: place.address_name,
  //     category: place.category,
  //     latitude: parseFloat(place.y),
  //     longitude: parseFloat(place.x),
  //   }));
  // }

  return (
    <Box>
      <Box mb={"2rem"}>
        <Flex>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <Button onClick={searchPlaces}>검색</Button>
        </Flex>
        <Box maxH={"240px"} overflowY={"auto"}>
          {places.map((place, index) => (
            <Flex key={index}>
              <Box>
                <Link
                  href={place.place_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {place.place_name}
                </Link>
              </Box>
              <Spacer />
              <Button onClick={() => selectPlace(place)}>추가하기</Button>
            </Flex>
          ))}
        </Box>
      </Box>

      <Box id="map" ref={mapRef} w={"576px"} h={"360px"}></Box>
      <Box>
        <Box>
          {selectedPlaces.map((place, index) => (
            <Flex key={index}>
              <Link
                href={place.place_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {place.place_name}
              </Link>
              <Spacer />
              <Button onClick={() => removePlace(index)}>삭제하기</Button>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default KakaoMapSearch;
