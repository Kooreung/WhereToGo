import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Input, Link, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { renderToString } from "react-dom/server";
import ButtonOutline from "../ui/Button/ButtonOutline.jsx";

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
  const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const mapRef = useRef(null);
  const [nowLatitude, setNowLatitude] = useState(37.567157695939926);
  const [nowLongitude, setNowLongitude] = useState(126.979353948294);
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState([]);
  const [ps, setPs] = useState(null);
  const [searchedMarkers, setSearchedMarkers] = useState([]);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);

  // 현재 위치 정보 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNowLatitude(position.coords.latitude);
        setNowLongitude(position.coords.longitude);
      },
      () => {},
    );
  }, []);

  // 기본 지도 생성
  useEffect(() => {
    if (nowLongitude && nowLatitude) {
      loadKakaoMapScript(kakaoMapAppKey, ["services"])
        .then(() => {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(nowLatitude, nowLongitude),
            level: 3,
          };

          const map = new window.kakao.maps.Map(container, options);
          setMap(map);

          // 줌 컨트롤 기능
          const zoomControl = new kakao.maps.ZoomControl();
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

          // 장소 검색 서비스
          const placesService = new window.kakao.maps.services.Places();
          setPs(placesService);
        })
        .catch((error) => {
          console.error(
            "카카오 맵을 불러오는 데 오류가 발생하였습니다.",
            error,
          );
        });
    }
  }, [kakaoMapAppKey, nowLongitude, nowLatitude]);

  // 검색 시 생성되는 마커
  useEffect(() => {
    if (map && places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      const newMarkers = places.map((place) => {
        const searchedMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(place.y, place.x),
          map: map,
        });

        // 인포윈도우 생성
        let content = renderToString(
          <SelectedMarkersInfoWindow place={place} />,
        );
        const infoWindow = new window.kakao.maps.InfoWindow({
          position: new window.kakao.maps.LatLng(place.y, place.x),
          content: content,
        });

        kakao.maps.event.addListener(searchedMarker, "mouseover", function () {
          // 모든 인포윈도우를 닫습니다.
          newMarkers.forEach(({ infoWindow }) => infoWindow.close());
          // 현재 마커의 인포윈도우를 엽니다.
          infoWindow.open(map, searchedMarker);
        });
        kakao.maps.event.addListener(searchedMarker, "mouseout", function () {
          // 모든 인포윈도우를 닫습니다.
          newMarkers.forEach(({ infoWindow }) => infoWindow.close());
        });

        bounds.extend(searchedMarker.getPosition());
        // 마커와 인포윈도우 객체 저장
        return { marker: searchedMarker, infoWindow: infoWindow };
      });

      setSearchedMarkers(newMarkers.map(({ marker }) => marker));
      map.setBounds(bounds);
    }
  }, [map, places]);

  // 추가하기 버튼 클릭 시 생성되는 커스텀 마커
  useEffect(() => {
    if (map && selectedPlaces.length > 0) {
      setSelectedMarkers([]);
      selectedMarkers.forEach((customOverlay) => customOverlay.setMap(null));

      const bounds = new window.kakao.maps.LatLngBounds();
      const newMarkers = selectedPlaces.map((place, index) => {
        // 번호가 표시된 커스텀 오버레이 추가
        let content = renderToString(<SelectedPlaceMarker index={index} />);
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(place.y, place.x),
          content: content,
          xAnchor: -0.5,
          yAnchor: 1,
        });
        customOverlay.setMap(map);
        bounds.extend(customOverlay.getPosition());
        return customOverlay;
      });
      setSelectedMarkers(newMarkers);
      map.setBounds(bounds);
    } else if (map && selectedPlaces.length == 0 && places.length > 0) {
      setSelectedMarkers([]);
      selectedMarkers.forEach((customOverlay) => customOverlay.setMap(null));
      setSearchedMarkers([]);
      searchedMarkers.forEach((searchedMarker) => searchedMarker.setMap(null));

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
      setSearchedMarkers(newMarkers);
      map.setBounds(bounds);
    }
  }, [map, selectedPlaces]);

  // 선택 된 장소에 따라 생성되는 폴리라인
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
            strokeColor: "#E6B143",
            strokeOpacity: 1,
            strokeStyle: "shortdash",
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

  // 검색 시
  const searchPlaces = () => {
    if (!ps || !searchTerm) return;

    setSearchedMarkers([]);
    searchedMarkers.forEach((searchedMarker) => searchedMarker.setMap(null));

    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(result);
      } else {
        alert("검색 결과가 존재하지 않습니다.");
      }
    };

    let getMapCenter = map.getCenter();

    ps.keywordSearch(searchTerm, callback, {
      // radius: 20000,
      location: new kakao.maps.LatLng(
        getMapCenter.getLat(),
        getMapCenter.getLng(),
      ),
      size: 10,
    });
  };

  // 장소 선택 시
  const selectPlace = (place) => {
    if (selectedPlaces.length === 0) {
      setSelectedPlaces([...selectedPlaces, place]);
      setSearchTerm("");
    }
    if (selectedPlaces.length < 5) {
      if (selectedPlaces.includes(place)) {
        alert("한 장소는 한 번만 선택 가능합니다.");
      } else {
        setSelectedPlaces([...selectedPlaces, place]);
        setSearchTerm("");
      }
    } else {
      alert("최대 5개의 장소만 선택할 수 있습니다.");
    }
  };

  // 장소 삭제 시
  const removePlace = (index) => {
    const newSelectedPlaces = selectedPlaces.filter((_, i) => i !== index);
    setSelectedPlaces(newSelectedPlaces);

    // 해당 인덱스의 마커 삭제
    if (selectedMarkers[index]) {
      selectedMarkers[index].setMap(null);
    }

    // selectedMarkers 업데이트
    const newSelectedMarkers = selectedMarkers.filter((_, i) => i !== index);
    setSelectedMarkers(newSelectedMarkers);

    // SearchedMarkers 업데이트
    if (searchedMarkers[index]) {
      searchedMarkers[index].setMap(null);
    }

    const newSearchedMarkers = searchedMarkers.filter((_, i) => i !== index);
    setSearchedMarkers(newSearchedMarkers);
  };

  const movePlaceUp = (index) => {
    if (index > 0) {
      // 첫 번째 요소가 아닌 경우에만 실행
      const newSelectedPlaces = [...selectedPlaces];
      [newSelectedPlaces[index - 1], newSelectedPlaces[index]] = [
        newSelectedPlaces[index],
        newSelectedPlaces[index - 1],
      ];
      setSelectedPlaces(newSelectedPlaces);
    }
  };

  const movePlaceDown = (index) => {
    if (index < selectedPlaces.length - 1) {
      const newSelectedPlaces = [...selectedPlaces];
      [newSelectedPlaces[index + 1], newSelectedPlaces[index]] = [
        newSelectedPlaces[index],
        newSelectedPlaces[index + 1],
      ];
      setSelectedPlaces(newSelectedPlaces);
    }
  };

  // 해당 인덱스의 마커
  function SelectedPlaceMarker({ index }) {
    return (
      <Box
        style={{
          borderRadius: "100%",
          backgroundColor: "white",
          paddingLeft: "8px",
          paddingRight: "8px",
          color: "black",
          boxShadow: "0 0 0 4px #836091, 0 0 0 8px #D8B7E5",
        }}
      >
        {index + 1}
      </Box>
    );
  }

  // 마우스 오버 시 나오는 인포윈도우
  function SelectedMarkersInfoWindow({ place }) {
    return (
      <Box
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingLeft: "8px",
          paddingRight: "8px",
          borderRadius: "12px",
          bgColor: "white",
          color: "black",
          boxShadow: "0 0 0 2px #836091, 0 0 0 4px #D8B7E5",
        }}
      >
        <Box>{place.place_name}</Box>
        <Box>{place.address_name}</Box>
      </Box>
    );
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      searchPlaces();
    }
  }

  return (
    <Flex
      w={{ base: "720px", sm: "540px", lg: "720px" }}
      direction={"column"}
      align={"center"}
    >
      <Box w={{ base: "720px", sm: "540px", lg: "720px" }}>
        <Flex mb={"1rem"}>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요."
            onKeyDown={handleSearchKeyDown}
          />
          <ButtonOutline variant={"RecMedium"} onClick={searchPlaces}>
            검색
          </ButtonOutline>
        </Flex>
        {places.length > 0 && (
          <Box
            maxH={"214px"}
            overflowY={"auto"}
            my={"1rem"}
            px={"1rem"}
            py={"4px"}
            border={"1px solid #D8B7E5"}
            borderLeftRadius={"1rem"}
          >
            {places.map((place, index) => (
              <Flex key={index} borderY={"1px solid lightgray"}>
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
                <Button onClick={() => selectPlace(place)}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      <Box
        id="map"
        ref={mapRef}
        w={{ base: "640px", sm: "540px", lg: "640px" }}
        h={{ base: "400px", sm: "360px", lg: "400px" }}
        borderRadius={"1rem"}
      />

      <Box w={"100%"} px={"1rem"} my={"1rem"}>
        <Box>
          {selectedPlaces.map((place, index) => (
            <Flex
              key={index}
              alignItems="center"
              justifyContent="center"
              p={"8px"}
              my={"4px"}
              border={"1px solid #D8B7E5"}
              borderRadius={"1rem"}
            >
              <Box>
                <Box>
                  <Link
                    href={place.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Box>
                      <Box>{place.place_name}</Box>
                      <Box>{place.road_address_name}</Box>
                      <Box>{place.phone}</Box>
                    </Box>
                  </Link>
                </Box>
              </Box>
              <Spacer />
              <Button onClick={() => movePlaceUp(index)}>
                <FontAwesomeIcon icon={faCaretUp} />
              </Button>
              <Button onClick={() => movePlaceDown(index)}>
                <FontAwesomeIcon icon={faCaretDown} />
              </Button>
              <Button
                onClick={() => {
                  removePlace(index);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Flex>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default KakaoMapSearch;
