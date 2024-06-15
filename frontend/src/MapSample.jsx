import React, { useEffect, useRef, useState } from "react";

// Kakao Map 스크립트 로드 함수
const loadKakaoMapScript = (appKey, libraries = []) => {
  return new Promise((resolve) => {
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
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(resolve);
    }
  });
};

const KakaoMapSearch = () => {
  const mapRef = useRef(null);
  const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);

  useEffect(() => {
    loadKakaoMapScript(kakaoMapAppKey, ["services"]).then(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      setMap(map);

      const placesService = new window.kakao.maps.services.Places();
      setPs(placesService);
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

  useEffect(() => {
    if (map) {
      // Remove existing polylines
      polylines.forEach((polyline) => polyline.setMap(null));

      if (selectedPlaces.length > 1) {
        const bounds = new window.kakao.maps.LatLngBounds();
        const newPolylines = selectedPlaces.map((place, index) => {
          if (index === selectedPlaces.length - 1) return null; // Skip the last place
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

    ps.keywordSearch(searchTerm, callback);
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

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={searchPlaces}>검색</button>
      <div
        id="map"
        ref={mapRef}
        style={{ width: "500px", height: "400px" }}
      ></div>
      <div>
        <h2>검색 결과</h2>
        <ul>
          {places.map((place, index) => (
            <li key={index} style={{ cursor: "pointer", color: "blue" }}>
              {place.place_name}
              <button onClick={() => selectPlace(place)}>추가하기</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>선택된 장소</h2>
        <ul>
          {selectedPlaces.map((place, index) => (
            <li key={index}>
              {place.place_name} -{" "}
              <a
                href={place.place_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                상세 정보
              </a>
              <button onClick={() => removePlace(index)}>삭제하기</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KakaoMapSearch;
