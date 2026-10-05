import rateLimit, {
  MINUTE,
  type Options,
  ipKeyGenerator,
} from "express-rate-limit";
import type { Request } from "express";

import { httpStatus } from "../types/http-status";

function generateRateLimitOption(
  limit: number,
  skipSuccess: boolean = false,
): Partial<Options> {
  return {
    limit,
    legacyHeaders: false,
    windowMs: 15 * MINUTE,
    standardHeaders: "draft-8",
    skipSuccessfulRequests: skipSuccess,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? ""),
    message: {
      status: httpStatus.FAIL,
      message: "Too many requests, please try again later",
      data: null,
    },
  };
}

export const globalLimiter = rateLimit(generateRateLimitOption(30));
export const loginLimiter = rateLimit(generateRateLimitOption(10, true));
export const emailLimiter = rateLimit(generateRateLimitOption(3));
export const tokenRedemptionLimiter = rateLimit(generateRateLimitOption(10));
