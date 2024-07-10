import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function useAuth() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a LoginProvider");
  }
  return context;
}

export function LoginProvider({ children }) {
  const [memberId, setMemberId] = useState(0);
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken && refreshToken) {
      refreshAccessToken(refreshToken, memberId);
    } else if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        if (refreshToken) {
          refreshAccessToken(refreshToken, decodedToken.sub);
        }
      } else {
        login({ accessToken, refreshToken });
      }
    }
  }, []);

  function setLoginState(decodedToken) {
    setMemberId(decodedToken.sub);
    setEmail(decodedToken.email);
    setNickName(decodedToken.nickName);
    setAuthority(decodedToken.scope.split(" "));
    setExpired(decodedToken.exp);
  }

  function refreshAccessToken(oldrefreshToken, memberId) {
    axios
      .post("/api/token/refresh", {
        refreshToken: oldrefreshToken,
        memberId: memberId,
      })
      .then((response) => {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        login(response.data);
      })
      .catch((error) => {
        console.error("토큰 갱신 실패", error);
        logout();
      });
  }

  function isLoggedIn() {
    // 로컬 스토리지에서 accessToken을 가져옵니다.
    const accessToken = localStorage.getItem("accessToken");
    // accessToken이 존재하면 true, 그렇지 않으면 false를 반환합니다.
    return !!accessToken;
  }

  function hasAccessMemberId(param) {
    return memberId == param;
  }

  function hasAccessEmail(param) {
    return email === param;
  }

  function isAdmin() {
    return authority.includes("admin");
  }

  function login(token) {
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("refreshToken", token.refreshToken);
    const decodedToken = jwtDecode(token.accessToken);
    setLoginState(decodedToken);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setExpired(0);
    setEmail("");
    setNickName("");
    setMemberId(0);
    setAuthority([]);
  }

  return (
    <LoginContext.Provider
      value={{
        email,
        nickName,
        memberId,
        login,
        logout,
        isLoggedIn,
        hasAccessEmail,
        hasAccessMemberId,
        isAdmin,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
