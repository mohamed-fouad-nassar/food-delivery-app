import type { FieldValues, UseFormReturn } from "react-hook-form";
import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import APP_CONFIG from "@/lib/env";
import {
  QUERY_KEYS,
  localStoragePersister,
  queryClient,
} from "@/lib/react-query";

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
  baseURL: `${APP_CONFIG.apiBaseUrl}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRefresh = axios.create({
  baseURL: `${APP_CONFIG.apiBaseUrl}/auth/refresh`,
  withCredentials: true,
});

api.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    const userData = queryClient.getQueryData<{ token: string }>(
      QUERY_KEYS.user,
    );
    if (userData?.token)
      req.headers["Authorization"] = `Bearer ${userData?.token}`;
    return req;
  },
  (err) => Promise.reject(err),
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
        const response = await apiRefresh.post<{ data: { token: string } }>(
          "/",
        );
        const { token } = response.data.data;
        queryClient.setQueryData(QUERY_KEYS.user, (oldData: any) => ({
          ...oldData,
          token: token,
        }));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        clearAuthSession();
        if (!originalRequest?.url?.includes("/auth/logout")) {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export function getAxiosErrorMsg(err: unknown) {
  return axios.isAxiosError<ApiErrorResponse>(err)
    ? err.response?.data?.message
    : "Something went wrong";
}

export function handleValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  err: unknown,
) {
  if (!isAxiosError(err)) return;
  const errObj = err.response?.data?.errors || err.response?.data?.data?.errors;
  if (errObj) {
    const errors = Object.entries(errObj);
    errors?.map((errArr) => {
      form.setError(errArr[0] as any, {
        type: "server",
        message: errArr[1] as any,
      });
    });
  } else return;
}

export function clearAuthSession() {
  queryClient.removeQueries({ queryKey: QUERY_KEYS.user });
  void localStoragePersister.removeClient();
  delete api.defaults.headers.common["Authorization"];
  delete apiRefresh.defaults.headers.common["Authorization"];
}
