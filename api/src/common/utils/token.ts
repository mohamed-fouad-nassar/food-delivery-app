import jwt from "jsonwebtoken";
import authConfig from "../config/auh.config";
import type { UserRole } from "../types/user-role";

interface JwtRefreshPayload {
  id: string;
}
interface JwtPayload extends JwtRefreshPayload {
  role: UserRole;
}
interface JwtVerificationPayload extends JwtRefreshPayload {
  email: string;
}

export const generateAccessToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role }, authConfig.access_secret, {
    expiresIn: authConfig.access_secret_expires_in as any,
  });

export const generateRefreshToken = (id: string): string =>
  jwt.sign({ id }, authConfig.refresh_secret, {
    expiresIn: authConfig.refresh_secret_expires_in as any,
  });

export const generateVerificationToken = (id: string, email: string): string =>
  jwt.sign({ id, email }, authConfig.email_verification_secret, {
    expiresIn: "24h",
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, authConfig.access_secret) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, authConfig.refresh_secret) as JwtRefreshPayload;

export const verifyVerificationToken = (token: string) =>
  jwt.verify(
    token,
    authConfig.email_verification_secret,
  ) as JwtVerificationPayload;
