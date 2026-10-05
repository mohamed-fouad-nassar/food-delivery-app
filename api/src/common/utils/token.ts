import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpError } from "./http";
import authConfig from "../config/auth.config";
import { httpStatus } from "../types/http-status";
import type { UserRole } from "../types/user-role";
import { tokenTypes, type TokenTypes } from "../types/token";

const verify = (token: string, secret: string, expected: TokenTypes) => {
  try {
    const payload = jwt.verify(token, secret) as JwtRefreshPayload;
    if (payload.type !== expected)
      throw new HttpError(401, httpStatus.FAIL, "Invalid token type");
    return payload;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, httpStatus.FAIL, "Token expired or invalid");
  }
};

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
  const payload = verify(
    token,
    authConfig.access_secret,
    tokenTypes.ACCESS,
  ) as JwtPayload;
  return payload;
};

// Refresh Token
export const generateRefreshToken = (id: string): string =>
  jwt.sign({ id, type: tokenTypes.REFRESH }, authConfig.refresh_secret, {
    expiresIn: authConfig.refresh_secret_expires_in as any,
  });
export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  return verify(
    token,
    authConfig.refresh_secret,
    tokenTypes.REFRESH,
  ) as JwtRefreshPayload;
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
  return verify(
    token,
    authConfig.email_verification_secret,
    tokenTypes.EMAIL_VERIFICATION,
  ) as JwtVerificationPayload;
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
  return verify(
    token,
    authConfig.reset_password_secret,
    tokenTypes.PASSWORD_RESET,
  ) as JwtResetPasswordPayload;
};

// Hash Tokens
export const hashToken = (token: string): string =>
  crypto
    .createHmac("sha256", authConfig.hash_token_secret)
    .update(token)
    .digest("hex");
