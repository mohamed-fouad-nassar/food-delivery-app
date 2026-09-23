import { httpStatus, type HttpStatus } from "../types/http-status";

export class HttpError extends Error {
  public code: number;
  public status: HttpStatus;

  constructor(code: number, status: HttpStatus, msg: string) {
    super(msg || "Internal Server Error");
    this.code = code || 500;
    this.status = status || httpStatus.ERROR;
  }
}
