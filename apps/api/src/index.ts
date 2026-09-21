import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.js";
import { thoughtRoutes } from "./routes/thoughts.js";
import { feedRoutes } from "./routes/feed.js";
import { reactionRoutes } from "./routes/reactions.js";
import { shareRoutes } from "./routes/shares.js";
import { socialRoutes } from "./routes/social.js";
import { trustRoutes } from "./routes/trust.js";
import { AppError } from "./lib/errors.js";

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

app.register(cors, {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  app.log.error(error);
  return reply.status(500).send({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
  });
});

app.register(authRoutes);
app.register(thoughtRoutes);
app.register(feedRoutes);
app.register(reactionRoutes);
app.register(shareRoutes);
app.register(socialRoutes);
app.register(trustRoutes);

app.get("/api/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString(), service: "mind-api" };
});

const start = async () => {
  const port = parseInt(process.env.PORT || "3001", 10);
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen({ port, host });
    console.log(`🧠 MIND API running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
