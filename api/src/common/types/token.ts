export enum tokenTypes {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export type TokenTypes = `${tokenTypes}`;
