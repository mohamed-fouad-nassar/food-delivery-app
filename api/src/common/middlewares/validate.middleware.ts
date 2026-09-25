import type { NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult, type ValidationChain } from "express-validator";
import { httpStatus } from "../types/http-status";

export const validate = (rules: ValidationChain[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors: ", errors.array());
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "Validation Error",
        data: { errors: errors.array() },
      });
    } else next();
  };
};
