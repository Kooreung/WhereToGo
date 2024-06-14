import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Lobby from "./page/Lobby.jsx";
import PostWrite from "./page/post/PostWrite.jsx";

import { MemberInfo } from "./page/member/MemberInfo.jsx"; // 라우터 설정
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { CommentComponent } from "./component/Comment/CommentComponent.jsx";
import { PostView } from "./page/post/PostView.jsx";
import PostList from "./page/post/PostList.jsx";
import { PostEdit } from "./page/post/PostEdit.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import LoginProvider from "./component/LoginProvider.jsx";
import { MemberFindPassword } from "./page/member/MemberFindPassword.jsx";
import MemberEdit from "./page/member/MemberEdit.jsx";
import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Nav 와 Outlet 구성
    children: [
      {
        index: true,
        element: <Lobby />,
        // 메인페이지
      },
      // 멤버 페이지
      { path: "signup", element: <MemberSignup /> },
      { path: "login", element: <MemberLogin /> },
      { path: "findPassword", element: <MemberFindPassword /> },
      { path: "memberinfo", element: <MemberInfo /> },
      { path: "member/edit", element: <MemberEdit /> },
      // 게시글 페이지
      { path: "post/write", element: <PostWrite /> },
      { path: "post/:postId", element: <PostView /> },
      { path: "post/:postId/edit", element: <PostEdit /> },
      { path: "post/list", element: <PostList /> },
      // 댓글 페이지
      { path: "comment", element: <CommentComponent /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
