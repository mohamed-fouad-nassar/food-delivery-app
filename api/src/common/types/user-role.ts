export enum userRole {
  ADMIN = "admin",
  RESTAURANT_OWNER = "restaurant_owner",
  CUSTOMER = "customer",
  DELIVERY = "delivery",
}

export type UserRole = `${userRole}`;
