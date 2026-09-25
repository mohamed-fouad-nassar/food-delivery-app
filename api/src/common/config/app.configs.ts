const appConfig = {
  port: parseInt(process.env.PORT as string),
  cors_origin: process.env.CORS_ORIGIN as string,
  resend_api_key: process.env.RESEND_API_KEY as string,
  node_env: process.env.NODE_ENV as string,
};

export default appConfig;
