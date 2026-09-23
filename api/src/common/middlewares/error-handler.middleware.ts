import type { NextFunction, Request, Response } from "express";

import type { HttpError } from "../utils/http";
import { httpStatus } from "../types/http-status";

export const errorHandler = (
  err: HttpError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.log("ERROR: ", err);
  res.status(err.code || 500).json({
    status: err.status || httpStatus.ERROR,
    message: err.message || "Something Went Wrong",
    data: null,
  });
};
