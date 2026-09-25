const authConfig = {
  access_secret: process.env.ACCESS_TOKEN_SECRET as string,
  access_secret_expires_in: process.env
    .ACCESS_TOKEN_SECRET_EXPIRES_IN as string,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET as string,
  refresh_secret_expires_in: process.env
    .REFRESH_TOKEN_SECRET_EXPIRES_IN as string,
  email_verification_secret: process.env.EMAIL_VERIFICATION_SECRET as string,
};

export default authConfig;
