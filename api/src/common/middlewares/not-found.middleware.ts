import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/http";
import { httpStatus } from "../types/http-status";

export const notFound = (req: Request, _: Response, next: NextFunction) => {
  return next(
    new HttpError(404, httpStatus.FAIL, `Rout ${req.originalUrl} Not Found`),
  );
};
