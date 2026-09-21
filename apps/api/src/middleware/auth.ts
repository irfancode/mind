import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, TokenPayload } from "../lib/jwt.js";
import { UnauthorizedError } from "../lib/errors.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  const token = authHeader.slice(7);
  try {
    request.user = verifyToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      request.user = verifyToken(authHeader.slice(7));
    } catch {
      // Token invalid, continue without user
    }
  }
}
