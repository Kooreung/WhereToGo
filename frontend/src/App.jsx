import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Lobby from "./page/Lobby.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx"; // 라우터 설정
import { MemberSignup } from "./page/member/MemberSignup.jsx";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Nav 와 Outlet 구성
    children: [
      {
        index: true,
        element: <Lobby />,
      }, // 메인페이지를 담당
      { path: "signup", element: <MemberSignup /> },
      { path: "memberinfo", element: <MemberInfo /> },
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
