import { Router } from "express";

import {
  login,
  logout,
  register,
  refreshToken,
  resetPassword,
  getCurrentUser,
  verifyUserEmail,
  requestResetPasswordToken,
} from "./auth.controller";
import {
  loginRules,
  registerRules,
  resetPasswordRules,
  requestResetPasswordTokenRules,
} from "./auth.validation";
import {
  emailLimiter,
  loginLimiter,
  tokenRedemptionLimiter,
} from "../../common/middlewares/rate-limit.middleware";
import { protect } from "../../common/middlewares/protect.middleware";
import { validate } from "../../common/middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerRules), register);
router.post("/login", loginLimiter, validate(loginRules), login);
router.post("/logout", protect, logout);
router.post("/refresh", protect, tokenRedemptionLimiter, refreshToken);
router.post(
  "/forget-password",
  emailLimiter,
  validate(requestResetPasswordTokenRules),
  requestResetPasswordToken,
);
router.post(
  "/reset-password",
  tokenRedemptionLimiter,
  validate(resetPasswordRules),
  resetPassword,
);
router.get("/verify", tokenRedemptionLimiter, verifyUserEmail);
router.get("/current-user", protect, getCurrentUser);

export default router;
