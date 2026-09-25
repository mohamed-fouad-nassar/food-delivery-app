import { Router } from "express";

import {
  login,
  logout,
  register,
  refreshToken,
  resetPassword,
  verifyUserEmail,
  requestResetPasswordToken,
} from "./auth.controller";
import { loginRules, registerRules } from "./auth.validation";
import { validate } from "../../common/middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forget-password", requestResetPasswordToken);
router.post("/reset-password", resetPassword);
router.post("/verify", verifyUserEmail);

export default router;
