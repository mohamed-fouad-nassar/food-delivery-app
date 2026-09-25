import type { NextFunction, Request, Response } from "express";

import { AuthService } from "./auth.service";
import appConfig from "../../common/config/app.configs";
import { catchAsync } from "../../common/utils/catch-async";
import { httpStatus } from "../../common/types/http-status";
import type { LoginUserDto, RegisterUserDto } from "./auth.types";

export const register = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const data: RegisterUserDto = req.body;
    const user = await AuthService.register(data);
    res.json({
      status: httpStatus.SUCCESS,
      message: "Email Registered Successfully. Check you email for activation",
      data: user,
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const data: LoginUserDto = req.body;
    const { user, token, refreshToken } = await AuthService.login(data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents client-side scripts from reading the token (Mitigates XSS)
      secure: appConfig.node_env === "production", // Requires HTTPS in production
      sameSite: "strict", // Protects against Cross-Site Request Forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, // max age in (ms) => 7 days
    });

    res.json({
      status: httpStatus.SUCCESS,
      message: `Welcome Back, ${user.firstName}`,
      data: { user, token },
    });
  },
);

// @TODO: Add the refreshToken encrypted or plain in the user table and then remove it on logout.
export const logout = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    await AuthService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.json({ status: httpStatus.SUCCESS, message: "Good Bye!", data: null });
  },
);

export const requestResetPasswordToken = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { email } = req.body;
    await AuthService.requestResetPasswordToken(email);
    res.json({
      status: httpStatus.SUCCESS,
      message: "Reset Password Email Sent Successfully",
      data: null,
    });
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const { password } = req.body;
    const resetPasswordToken = req.query.token as string;
    await AuthService.resetPassword(password, resetPasswordToken);
    res.json({
      status: httpStatus.SUCCESS,
      message: "Password Updated Successfully",
      data: null,
    });
  },
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const token = await AuthService.refreshToken(refreshToken);
    res.json({
      status: httpStatus.SUCCESS,
      message: "Token Refreshed Successfully",
      data: { token },
    });
  },
);

export const verifyUserEmail = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const verifyToken = req.query.token as string;
    const { user, token, refreshToken } =
      await AuthService.verifyUserEmail(verifyToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents client-side scripts from reading the token (Mitigates XSS)
      secure: appConfig.node_env === "production", // Requires HTTPS in production
      sameSite: "strict", // Protects against Cross-Site Request Forgery (CSRF)
      maxAge: 7 * 24 * 60 * 60 * 1000, // max age in (ms) => 7 days
    });

    res.json({
      status: httpStatus.SUCCESS,
      message: "Email activated Successfully",
      data: { user, token },
    });
  },
);

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, _: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const user = await AuthService.getCurrentUser(accessToken);
    res.json({
      status: httpStatus.SUCCESS,
      message: "User Fetched Successfully",
      data: { user },
    });
  },
);
