import type { FieldValues, UseFormReturn } from "react-hook-form";
import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import { QUERY_KEYS, queryClient } from "@/lib/react-query";

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type ValidationErrorResponse<T> = ApiResponse<{
  errors: Partial<Record<keyof T, string>>;
}>;

export type ApiErrorResponse = ApiResponse<unknown>;

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
    if (
      err.response?.status === 401 &&
      originalRequest?.url !== "/auth/login" &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await apiRefresh.post("/");
        const { token } = response.data.data;
        queryClient.setQueryData(QUERY_KEYS.user, (oldData: any) => ({
          ...oldData,
          token: token,
        }));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        queryClient.setQueryData(QUERY_KEYS.user, null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export function getAxiosErrorMsg(err: unknown) {
  return axios.isAxiosError<ApiErrorResponse>(err)
    ? err.response?.data?.message
    : undefined;
}

export function handleValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  err: unknown,
) {
  if (!isAxiosError(err)) return;
  const errors = Object.entries(
    err.response?.data.errors || err.response?.data.data.errors,
  );
  errors?.map((errArr) => {
    form.setError(errArr[0] as any, {
      type: "server",
      message: errArr[1] as any,
    });
  });
}
