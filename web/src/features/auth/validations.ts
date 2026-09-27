import z from "zod";

export const userRoles = [
  { label: "Customer", value: "CUSTOMER" },
  { label: "Restaurant Owner", value: "RESTAURANT_OWNER" },
  { label: "Delivery", value: "DELIVERY" },
] as const;
const userRolesValues = userRoles.map((u) => u.value);
const userEnum = z.enum(userRolesValues);
export type UserRole = z.infer<typeof userEnum>;

export const registerSchema = z
  .object({
    firstName: z
      .string("First name is required")
      .min(3, "First name must be at least 3 characters")
      .max(25, "First name cannot exceed 25 characters")
      .trim(),
    lastName: z
      .string("First name is required")
      .min(3, "First name must be at least 3 characters")
      .max(25, "First name cannot exceed 25 characters")
      .trim()
      .optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z
      .string("Phone number is required")
      .min(1, "Phone number is required")
      .regex(
        /^01[0125][0-9]{8}$/,
        "Invalid Egyptian phone number. Must start with 010, 011, 012, or 015 and be 11 digits long",
      ),
    role: z.enum(userRolesValues),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string("Repeat password is required")
      .nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const registerDefaultValues = {
  firstName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: userRoles.at(0)?.value,
};
export interface RegisterUserDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
}

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
export const loginDefaultValues = {
  email: "cust1@gmail.com",
  password: "qwer1234",
};
export interface LoginUserDto {
  email: string;
  password: string;
}
