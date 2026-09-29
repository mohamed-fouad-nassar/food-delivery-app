import type z from "zod";

import type {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
} from "@/features/auth/validations";
import type { ApiResponse } from "@/lib/api";

// Login
export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  status: string;
};
export type LoginSuccessResponse = ApiResponse<LoginUser>;

// Register
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterUser = {};
export type RegisterSuccessResponse = ApiResponse<RegisterUser>;

// Activate User
export type ActivateUser = {};
export type ActiveUserSuccessResponse = ApiResponse<ActivateUser>;

// Forget Password
export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;
export type ForgetPasswordUser = {};
export type ForgetPasswordSuccessResponse = ApiResponse<ForgetPasswordUser>;
