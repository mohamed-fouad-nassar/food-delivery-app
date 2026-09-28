import type {
  LoginFormValues,
  RegisterFormValues,
  LoginSuccessResponse,
  RegisterSuccessResponse,
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

export async function logoutApi() {
  console.log("LOGOUT USER");
}

export async function refreshApi() {
  console.log("REFRESH USER TOKEN");
}

export async function forgetPasswordApi() {
  console.log("FORGET USER PASSWORD API");
}

export async function resetPasswordApi() {
  console.log("RESET USER PASSWORD API");
}

export async function activateUserAccount() {
  console.log("ACTIVATE USER ACCOUNT API");
}
