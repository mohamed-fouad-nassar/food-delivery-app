const appConfig = {
  port: parseInt(process.env.PORT as string),
  cors_origin: process.env.CORS_ORIGIN as string,
};

export default appConfig;
