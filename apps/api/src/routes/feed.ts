import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth.js";
import { getFeed } from "../services/feed.js";

export async function feedRoutes(app: FastifyInstance) {
  app.get("/api/feed", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { cursor } = request.query as { cursor?: string };
    const feed = await getFeed(request.user!.userId, cursor);
    return reply.send({ feed });
  });

  app.get("/api/feed/why", { preHandler: [authMiddleware] }, async (_request, reply) => {
    return reply.send({
      reason: "Because you follow this topic and this person is in your network",
      factors: [
        "You follow this author",
        "This thought matches your feed vibe",
        "This is recent content from your network",
      ],
    });
  });
}
