import type { Prisma } from "../../generated/prisma/client";
import type { RegistrationUserRoles } from "../../common/types/user-role";

export const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export interface RegisterUserDto {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  role: RegistrationUserRoles;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
