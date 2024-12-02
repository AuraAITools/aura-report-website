import { useNotifications } from "@/components/notifications/notification-store";
import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  return config;
}

export const apiClient = Axios.create({
  baseURL: process.env.API_URL,
});

apiClient.interceptors.request.use(authRequestInterceptor);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response.data.message || error.message;
    useNotifications.getState().addNotification({
      type: "error",
      title: "Error",
      message,
    });

    // if (error.response?.status === 401) {
    //   const searchParams = new URLSearchParams();
    //   const redirectTo =
    //     searchParams.get("redirectTo") || window.location.pathname;
    //   window.location.href = paths.auth.login.getHref(redirectTo);
    // }

    return Promise.reject(error);
  }
);
