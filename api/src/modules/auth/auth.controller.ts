import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../common/utils/catch-async";

export const register = catchAsync(
  (_: Request, res: Response, __: NextFunction) => {
    res.json({ message: "Register is Here... 🚀" });
  },
);
