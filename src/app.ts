import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import errorHandler from "./middleware/errorHandler.js";
import { userRouter } from "./presentation/http/routes/userRoutes.js";

export const app = express();

app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(",");
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);
