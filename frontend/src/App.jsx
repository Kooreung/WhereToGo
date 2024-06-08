import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Lobby from "./page/Lobby.jsx";
import CommentComponent from "./component/Comment/CommentComponent.jsx";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Nav 와 Outlet 구성
    children: [
      { index: true, element: <Lobby /> },
      { path: "comment", element: <CommentComponent /> }, // 메인페이지를 담당
    ],
  },
]);

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
