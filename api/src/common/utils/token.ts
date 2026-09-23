import jwt from "jsonwebtoken";
import authConfig from "../config/auh.config";
import type { UserRole } from "../types/user-role";

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const generateAccessToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role }, authConfig.access_secret, {
    expiresIn: authConfig.access_secret_expires_in as any,
  });

export const generateRefreshToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role }, authConfig.refresh_secret, {
    expiresIn: authConfig.refresh_secret_expires_in as any,
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, authConfig.access_secret) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, authConfig.refresh_secret) as JwtPayload;
