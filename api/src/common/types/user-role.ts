export enum userRole {
  ADMIN = "ADMIN",
  RESTAURANT_OWNER = "RESTAURANT_OWNER",
  CUSTOMER = "CUSTOMER",
  DELIVERY = "DELIVERY",
}
export type UserRole = `${userRole}`;

export const registrationUserRoles = [
  userRole.CUSTOMER,
  userRole.DELIVERY,
  userRole.RESTAURANT_OWNER,
] as const;
export type RegistrationUserRoles = (typeof registrationUserRoles)[number];
