import React, { createContext, useContext, useState } from "react";

// 알림 상태를 관리할 Context를 생성합니다.
export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  // 알림 목록을 상태로 관리합니다.
  const [notifications, setNotifications] = useState([]);

  // 알림을 추가하는 함수입니다.
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  // 알림을 제거하는 함수입니다.
  const removeNotification = () => {
    setNotifications([]);
  };

  // Context의 value로 상태와 함수들을 제공합니다.
  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// 다른 컴포넌트에서 Context를 사용하기 위한 훅입니다.
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
