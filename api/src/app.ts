import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
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

// API Health check
app.get("/api/health", (_, res) => {
  res.json({ message: "API is running 🚀" });
});

// APP ROUTES WILL BE THERE

// APP ERROR HANDLING LIKE notFound, and errorHandler

export default app;
