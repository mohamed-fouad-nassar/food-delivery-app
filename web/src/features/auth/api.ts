import { api } from "@/lib/api";
import type {
  LoginUserDto,
  RegisterUserDto,
} from "@/features/auth/validations";

export async function loginApi(data: LoginUserDto) {
  const res = await api.post("/auth/login", data);
  return res;
}

export async function registerApi(data: RegisterUserDto) {
  console.log("Login Data: ", data);
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
