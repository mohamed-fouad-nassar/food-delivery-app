import type { RegistrationUserRoles } from "../../common/types/user-role";

export interface RegisterUserDto {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  role: RegistrationUserRoles;
}
