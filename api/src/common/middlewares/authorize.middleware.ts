import type { NextFunction, Response } from "express";

import { HttpError } from "../utils/http";
import { httpStatus } from "../types/http-status";
import type { AuthRequest } from "./protect.middleware";
import type { UserRole } from "../../generated/prisma/enums";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, _: Response, next: NextFunction) => {
    if (!req.user)
      return next(
        new HttpError(401, httpStatus.FAIL, "No user provided. Login Required"),
      );

    if (!allowedRoles.includes(req.user?.role))
      return next(
        new HttpError(
          403,
          httpStatus.FAIL,
          "You don't have permissions to access this route",
        ),
      );

    next();
  };
}
