import type z from "zod";

import type { ApiResponse } from "@/lib/api";
import type { loginSchema } from "@/features/auth/validations";

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
