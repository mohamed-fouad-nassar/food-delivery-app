import axios, { type InternalAxiosRequestConfig } from "axios";
import { queryClient } from "../App";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiRefresh = axios.create({
  baseURL: "http://localhost:3000/api/auth/refresh",
  withCredentials: true,
});

api.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    const userData = queryClient.getQueryData<{ token: string }>(["user"]);
    if (userData?.token)
      req.headers["Authorization"] = `Bearer ${userData?.token}`;
    return req;
  },
  (err) => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiRefresh.post("/");
        const { token } = response.data;
        queryClient.setQueryData(["user"], (oldData: any) => ({
          ...oldData,
          token: token,
        }));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        queryClient.setQueryData(["user"], null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);
