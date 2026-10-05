import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";

import appConfig from "./common/config/app.configs";
import { notFound } from "./common/middlewares/not-found.middleware";
import { errorHandler } from "./common/middlewares/error-handler.middleware";

import authRoute from "./modules/auth/auth.route";
import { globalLimiter } from "./common/middlewares/rate-limit.middleware";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: appConfig.cors_origin,
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api", globalLimiter);

app.get("/api/health", (_, res) => {
  res.json({ message: "API is running 🚀" });
});

app.use("/api/auth", authRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
