import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/http";
import { verifyToken } from "../utils/token";
import { httpStatus } from "../types/http-status";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function protect(req: AuthRequest, _: Response, next: NextFunction) {
  let token: string | undefined;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  )
    token = req.headers["authorization"].split(" ")[1];

  if (!token)
    return next(
      new HttpError(401, httpStatus.FAIL, "No token provided. Login Required!"),
    );

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
}
