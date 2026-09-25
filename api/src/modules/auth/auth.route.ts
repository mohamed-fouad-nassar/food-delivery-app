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
import { validate } from "../../common/middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post(
  "/forget-password",
  validate(requestResetPasswordTokenRules),
  requestResetPasswordToken,
);
router.post("/reset-password", validate(resetPasswordRules), resetPassword);
router.get("/verify", verifyUserEmail);
router.get("/current-user", getCurrentUser);

export default router;
