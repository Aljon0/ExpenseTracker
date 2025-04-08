import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  const success = (message, duration) =>
    showToast(message, "success", duration);
  const error = (message, duration) => showToast(message, "error", duration);
  const warning = (message, duration) =>
    showToast(message, "warning", duration);
  const info = (message, duration) => showToast(message, "info", duration);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, success, error, warning, info }}
    >
      {children}
    </ToastContext.Provider>
  );
};
