import { body, query, type ValidationChain } from "express-validator";
import { registrationUserRoles } from "../../common/types/user-role";

export const registerRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .isMobilePhone("ar-EG")
    .withMessage("Phone number must be valid Egyptian phone number"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be text")
    .isLength({ max: 50 })
    .withMessage("First name is too long"),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Last name must be text")
    .isLength({ max: 50 })
    .withMessage("Last name is too long"),
  body("role")
    .notEmpty()
    .withMessage("User role is required")
    .isIn(registrationUserRoles)
    .withMessage("Invalid user role"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
];

export const loginRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const requestResetPasswordTokenRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
];

export const resetPasswordRules: ValidationChain[] = [
  query("token").notEmpty().withMessage("Token must be provided"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
];
