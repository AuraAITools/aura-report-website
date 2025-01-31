import { useNotifications } from "@/components/notifications/notification-store";
import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json";
  }
  config.withCredentials = true;
  return config;
}

export const apiClient = Axios.create({
  baseURL: "/",
});

apiClient.interceptors.request.use(authRequestInterceptor);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response.data.message || error.message;

    // all error response will trigger toasts
    useNotifications.getState().addNotification({
      type: "error",
      title: "Failed to sync data with server",
      message: message,
    });

    return Promise.reject(error);
  },
);
