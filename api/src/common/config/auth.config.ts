const authConfig = {
  access_secret: process.env.ACCESS_TOKEN_SECRET as string,
  access_secret_expires_in: process.env
    .ACCESS_TOKEN_SECRET_EXPIRES_IN as string,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET as string,
  refresh_secret_expires_in: process.env
    .REFRESH_TOKEN_SECRET_EXPIRES_IN as string,
  email_verification_secret: process.env.EMAIL_VERIFICATION_SECRET as string,
  reset_password_secret: process.env.RESET_PASSWORD_SECRET as string,
  hash_token_secret: process.env.HASH_TOKEN_SECRET as string,
  email_verification_secret_expires_in: process.env
    .EMAIL_VERIFICATION_SECRET_EXPIRES_IN as string,
  reset_password_secret_expires_in: process.env
    .RESET_PASSWORD_SECRET_EXPIRES_IN as string,
};

export default authConfig;
