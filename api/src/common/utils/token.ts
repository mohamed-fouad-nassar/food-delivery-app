import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpError } from "./http";
import authConfig from "../config/auth.config";
import { httpStatus } from "../types/http-status";
import type { UserRole } from "../types/user-role";
import { tokenTypes, type TokenTypes } from "../types/token";

interface JwtRefreshPayload {
  id: string;
  type: TokenTypes;
}
interface JwtPayload extends JwtRefreshPayload {
  role: UserRole;
}
interface JwtVerificationPayload extends JwtRefreshPayload {
  email: string;
}
interface JwtResetPasswordPayload extends JwtVerificationPayload {}

// Access Token
export const generateAccessToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role, type: tokenTypes.ACCESS }, authConfig.access_secret, {
    expiresIn: authConfig.access_secret_expires_in as any,
  });
export const verifyToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, authConfig.access_secret) as JwtPayload;
  if (payload.type !== tokenTypes.ACCESS)
    throw new HttpError(400, httpStatus.FAIL, "Invalid Token Type");
  return payload;
};

// Refresh Token
export const generateRefreshToken = (id: string): string =>
  jwt.sign({ id, type: tokenTypes.REFRESH }, authConfig.refresh_secret, {
    expiresIn: authConfig.refresh_secret_expires_in as any,
  });
export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  const payload = jwt.verify(
    token,
    authConfig.refresh_secret,
  ) as JwtRefreshPayload;
  if (payload.type !== tokenTypes.REFRESH)
    throw new HttpError(400, httpStatus.FAIL, "Invalid Token Type");
  return payload;
};

// Validation Token
export const generateVerificationToken = (id: string, email: string): string =>
  jwt.sign(
    { id, email, type: tokenTypes.EMAIL_VERIFICATION },
    authConfig.email_verification_secret,
    {
      expiresIn: authConfig.email_verification_secret_expires_in as any,
    },
  );
export const verifyVerificationToken = (
  token: string,
): JwtVerificationPayload => {
  const payload = jwt.verify(
    token,
    authConfig.email_verification_secret,
  ) as JwtVerificationPayload;
  if (payload.type !== tokenTypes.EMAIL_VERIFICATION)
    throw new HttpError(400, httpStatus.FAIL, "Invalid Token Type");
  return payload;
};

// Reset Password Token
export const generateResetPasswordToken = (id: string, email: string): string =>
  jwt.sign(
    { id, email, type: tokenTypes.PASSWORD_RESET },
    authConfig.reset_password_secret,
    {
      expiresIn: authConfig.reset_password_secret_expires_in as any,
    },
  );
export const verifyResetPasswordToken = (
  token: string,
): JwtResetPasswordPayload => {
  const payload = jwt.verify(
    token,
    authConfig.reset_password_secret,
  ) as JwtResetPasswordPayload;
  if (payload.type !== tokenTypes.PASSWORD_RESET)
    throw new HttpError(400, httpStatus.FAIL, "Invalid Token Type");
  return payload;
};

// Hash Tokens
export const hashToken = (token: string): string =>
  crypto
    .createHmac("sha256", authConfig.hash_token_secret)
    .update(token)
    .digest("hex");
