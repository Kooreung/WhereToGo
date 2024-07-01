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
import { LoginProvider } from "./component/LoginProvider.jsx";
import { MemberFindPassword } from "./page/member/MemberFindPassword.jsx";
import MemberEdit from "./page/member/MemberEdit.jsx";
import axios from "axios";
import MemberAdminPage from "./page/member/MemberAdminPage.jsx";
import MemberInfoAdmin from "./page/member/MemberInfoAdmin.jsx";
import { PostLikeList } from "./page/post/PostLikeList.jsx";
import { PostMdList } from "./page/post/PostMdList.jsx"; // axios interceptor 설정

// axios interceptor 설정
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
      // TODO 전체 페이지 네이밍 규칙 동일하게 설정 필요
      // TODO MODAL 규칙 동일하게 하단으로 설정 필요
      { path: "signup", element: <MemberSignup /> },
      { path: "login", element: <MemberLogin /> },
      { path: "findPassword", element: <MemberFindPassword /> },
      { path: "memberinfo", element: <MemberInfo /> },
      { path: "member/edit", element: <MemberEdit /> },
      { path: "memberAdminPage", element: <MemberAdminPage /> },
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
      // 댓글 페이지
      { path: "comment", element: <CommentComponent /> },
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
