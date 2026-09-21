import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError } from "../lib/errors.js";
import { checkForScams } from "../services/scam.js";

export async function trustRoutes(app: FastifyInstance) {
  app.get("/api/trust/scam-check", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { content } = request.query as {
      content: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      select: { createdAt: true },
    });

    if (!user) throw new NotFoundError("User");

    const accountAgeDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const result = checkForScams(content, accountAgeDays);

    return reply.send({ result });
  });

  app.get("/api/trust/passport/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        isHumanVerified: true,
        trustSignals: true,
        createdAt: true,
        _count: {
          select: {
            thoughts: true,
            reactions: true,
            followers: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundError("User");

    const moderationStats = await prisma.moderationRecord.groupBy({
      by: ["layer"],
      where: { userId },
      _count: { layer: true },
    });

    return reply.send({
      passport: {
        id: user.id,
        displayName: user.displayName,
        isHumanVerified: user.isHumanVerified,
        trustSignals: user.trustSignals,
        accountCreated: user.createdAt,
        stats: {
          thoughts: user._count.thoughts,
          reactions: user._count.reactions,
          followers: user._count.followers,
        },
        moderationHistory: moderationStats.map((m) => ({
          layer: m.layer,
          count: m._count.layer,
        })),
      },
    });
  });

  app.get("/api/thoughts/:thoughtId/context", async (request, reply) => {
    const { thoughtId } = request.params as { thoughtId: string };

    const context = await prisma.context.findUnique({
      where: { thoughtId },
      include: {
        sources: true,
      },
    });

    return reply.send({ context });
  });

  app.post("/api/reports", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { thoughtId, userId, category, description } = request.body as {
      thoughtId?: string;
      userId?: string;
      category: string;
      description: string;
    };

    const report = await prisma.report.create({
      data: {
        reporterId: request.user!.userId,
        thoughtId,
        userId,
        category: category as any,
        description,
      },
    });

    return reply.status(201).send({ report });
  });
}
