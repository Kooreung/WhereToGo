import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // 여러 컴포넌트가 현재 로그인 정보 사용하기 위해 Context 사용

// 여러 컴포넌트가 현재 로그인 정보 사용하기 위해 Context 사용
export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [memberId, setMemberId] = useState(0);
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  // 로그인 한 날짜(시간) state 에 저장
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  // 로그인 유무 확인 함수
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  // 게시글 권한 확인 함수
  function hasAccessMemberId(param) {
    return memberId == param;
  }

  function hasAccessEmail(param) {
    return email === param;
  }

  function login(token) {
    localStorage.setItem("token", token);
    // jwtDecode(token)으로 토큰의 페이로드(정보)를 가져옴
    const payload = jwtDecode(token);
    // payload 에서 가져온 해당 정보를 상태로 설정함
    setExpired(payload.exp);
    setEmail(payload.email);
    setNickName(payload.nickName);
    setMemberId(payload.sub);
  }

  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setEmail("");
    setNickName("");
    setMemberId(0);
  }

  return (
    <LoginContext.Provider
      value={{
        email: email,
        nickName: nickName,
        memberId: memberId,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccessEmail: hasAccessEmail,
        hasAccessMemberId: hasAccessMemberId,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
