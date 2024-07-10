import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Lobby from "./pages/lobby/Lobby.jsx";
import PostWrite from "./pages/post/PostWrite.jsx";

import { MemberInfo } from "./pages/member/MemberInfo.jsx"; // 라우터 설정
import { MemberSignup } from "./pages/member/MemberSignup.jsx";
import { PostView } from "./pages/post/PostView.jsx";
import PostList from "./pages/post/PostList.jsx";
import { PostEdit } from "./pages/post/PostEdit.jsx";
import { MemberLogin } from "./pages/member/MemberLogin.jsx";
import { LoginProvider } from "./components/ui/LoginProvider.jsx";
import { MemberFindPassword } from "./pages/member/MemberFindPassword.jsx";
import MemberEdit from "./pages/member/MemberEdit.jsx";
import axios from "axios";
import MemberAdmin from "./pages/member/MemberAdmin.jsx";
import MemberInfoAdmin from "./pages/member/MemberInfoAdmin.jsx";
import { PostLikeList } from "./pages/post/PostLikeList.jsx";
import { PostMdList } from "./pages/post/PostMdList.jsx"; // axios interceptor 설정
import ChatWebSocket from "./component/Chat/ChatWebSocket.jsx";
import ChatListPage from "./component/Chat/ChatListPage.jsx"; // axios interceptor 설정

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
      { path: "memberAdminPage", element: <MemberAdmin /> },
      { path: "member/:memberId", element: <MemberInfoAdmin /> },
      // 게시글 페이지
      { path: "post/write", element: <PostWrite /> },
      { path: "post/:postId", element: <PostView /> },
      { path: "post/:postId/edit", element: <PostEdit /> },
      { path: "post/list", element: <PostList /> },
      // MD 게시글 페이지
      { path: "post/mdList", element: <PostMdList /> },
      // 좋아요한 게시글 목록 페이지
      { path: "post/likeList/:memberId", element: <PostLikeList /> },
      { path: "/websocket", element: <ChatWebSocket /> },
      { path: "chatList", element: <ChatListPage /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  );
}

export default App;
