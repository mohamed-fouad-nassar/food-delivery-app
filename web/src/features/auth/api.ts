import type {
  LoginFormValues,
  RegisterFormValues,
  LoginSuccessResponse,
  LogoutSuccessResponse,
  RegisterSuccessResponse,
  ResetPasswordFormValues,
  ForgetPasswordFormValues,
  ActiveUserSuccessResponse,
  ResetPasswordSuccessResponse,
  ForgetPasswordSuccessResponse,
} from "@/features/auth/types";
import { api } from "@/lib/api";

export async function loginApi(
  credentials: LoginFormValues,
): Promise<LoginSuccessResponse> {
  const res = await api.post<LoginSuccessResponse>("/auth/login", credentials);
  return res.data;
}

export async function registerApi(
  data: RegisterFormValues,
): Promise<RegisterSuccessResponse> {
  const res = await api.post<RegisterSuccessResponse>("/auth/register", data);
  return res.data;
}

export async function logoutApi(): Promise<LogoutSuccessResponse> {
  const res = await api.post<LogoutSuccessResponse>("/auth/logout");
  return res.data;
}

export async function forgetPasswordApi(
  data: ForgetPasswordFormValues,
): Promise<ForgetPasswordSuccessResponse> {
  const res = await api.post<ForgetPasswordSuccessResponse>(
    "/auth/forget-password",
    data,
  );
  return res.data;
}

export async function resetPasswordApi(
  data: ResetPasswordFormValues,
  token: string,
) {
  const res = await api.post<ResetPasswordSuccessResponse>(
    `/auth/reset-password?token=${token}`,
    data,
  );
  return res.data;
}

export async function activateUserApi(token: string) {
  const res = await api.get<ActiveUserSuccessResponse>(
    `/auth/verify?token=${token}`,
  );
  return res.data;
}
