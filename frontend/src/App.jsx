import { useEffect, useState } from "react";

const maps = document.createElement("script");
maps.type = "text/javascript";
maps.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_API_KEY}=geocoder`;
document.head.appendChild(maps);

function App() {
  const [mapPoint, setMapPoint] = useState({ x: null, y: null });
  const [location, setLocation] = useState("");

  useEffect(() => {
    const mapDiv = document.getElementById("map");
    const map = new window.naver.maps.Map(mapDiv);
  }, []);

  return (
    <>
      <div>방가방가~^^</div>
      <div id="map" style={{ width: "400px", height: "400px" }} />
    </>
  );
}

export default App;
