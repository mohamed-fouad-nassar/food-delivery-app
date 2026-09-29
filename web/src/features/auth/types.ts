import type z from "zod";

import type {
  UserRole,
  UserStatus,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgetPasswordSchema,
} from "@/features/auth/validations";
import type { ApiResponse } from "@/lib/api";

type AuthUser = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
};

// Login
export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginUser = {
  user: AuthUser;
  token: string;
};
export type LoginSuccessResponse = ApiResponse<LoginUser>;

// Register
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterUser = {
  user: AuthUser;
  emailPreviewUrl: string;
};
export type RegisterSuccessResponse = ApiResponse<RegisterUser>;

// Activate User
export type ActivateUser = {
  user: AuthUser;
  token: string;
};
export type ActiveUserSuccessResponse = ApiResponse<ActivateUser>;

// Forget Password
export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;
export type ForgetPasswordUser = string;
export type ForgetPasswordSuccessResponse = ApiResponse<ForgetPasswordUser>;

// Reset Password
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordSuccessResponse = ApiResponse<null>;

// Logout
export type LogoutSuccessResponse = ApiResponse<null>;
