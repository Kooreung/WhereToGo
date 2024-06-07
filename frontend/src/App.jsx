import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Lobby from "./page/Lobby.jsx";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Nav 와 Outlet 구성
    children: [
      { index: true, element: <Lobby /> }, // 메인페이지를 담당
    ],
  },
]);

// 작업 시 사용 할 가이드라인용 스타일 값
export const GuideLine = {
  align: "center",
  justify: "center",
  px: 6,
  mb: 6,
  border: "red dotted 1px",
  bg: "lightgray",
  w: "75%",
  h: 200,
};

function App() {
  return (
    // <LoginProvider>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
    //</LoginProvider>
  );
}

export default App;
