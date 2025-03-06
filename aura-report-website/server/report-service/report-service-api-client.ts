import env from "@/utils/env";
import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }
  config.withCredentials = true;
  return config;
}

/**
 * api client used by nextjs proxy to send requests to report service backend
 */
export const reportServiceApiClient = Axios.create({
  baseURL: env.NEXT_PUBLIC_REPORT_SERVICE_URL,
});

reportServiceApiClient.interceptors.request.use(authRequestInterceptor);

reportServiceApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(`error occured:`, error); // TODO: improve
    return Promise.reject(error);
  },
);
