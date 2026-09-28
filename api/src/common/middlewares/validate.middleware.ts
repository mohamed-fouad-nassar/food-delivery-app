import {
  validationResult,
  type ValidationChain,
  type ValidationError,
} from "express-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import { httpStatus } from "../types/http-status";

export const validate = (rules: ValidationChain[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      rules.map((rule) => rule.run(req, { stopOnFirstError: true } as any)),
    );

    const errors = validationResult(req).formatWith(
      ({ msg }: ValidationError) => msg,
    );
    if (!errors.isEmpty()) {
      console.log("Validation Errors: ", errors.mapped());

      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "Validation Error",
        data: { errors: errors.mapped() },
      });
    } else next();
  };
};
