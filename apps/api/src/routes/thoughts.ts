import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { ThoughtType } from "@mind/shared-types";
import { authMiddleware } from "../middleware/auth.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../lib/errors.js";
import { createThought } from "../services/thoughts.js";

export async function thoughtRoutes(app: FastifyInstance) {
  app.post("/api/thoughts", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { type, content, replyToId } = request.body as {
      type: ThoughtType;
      content: string;
      replyToId?: string;
    };

    if (!type || !Object.values(ThoughtType).includes(type)) {
      throw new BadRequestError("Valid thought type is required");
    }

    if (!content || content.length < 1 || content.length > 5000) {
      throw new BadRequestError("Content must be 1-5000 characters");
    }

    if (replyToId) {
      const parent = await prisma.thought.findUnique({ where: { id: replyToId } });
      if (!parent) throw new NotFoundError("Parent thought");
    }

    const result = await createThought({
      authorId: request.user!.userId,
      type,
      content,
      replyToId,
    });

    return reply.status(201).send(result);
  });

  app.get("/api/thoughts/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const thought = await prisma.thought.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            isHumanVerified: true,
            trustSignals: true,
            createdAt: true,
          },
        },
        reactions: { select: { type: true, userId: true } },
        context: true,
        replies: {
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
                isHumanVerified: true,
                trustSignals: true,
                createdAt: true,
              },
            },
            reactions: { select: { type: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!thought) throw new NotFoundError("Thought");

    await prisma.thought.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const reactionCounts: Record<string, number> = {};
    for (const r of thought.reactions) {
      reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    }

    return reply.send({
      thought: {
        ...thought,
        reactionCounts,
      },
    });
  });

  app.delete("/api/thoughts/:id", { preHandler: [authMiddleware] }, async (request) => {
    const { id } = request.params as { id: string };
    const thought = await prisma.thought.findUnique({ where: { id } });

    if (!thought) throw new NotFoundError("Thought");
    if (thought.authorId !== request.user!.userId) throw new ForbiddenError("Not your thought");

    await prisma.thought.delete({ where: { id } });
    return { success: true };
  });

  app.get("/api/users/:userId/thoughts", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { cursor, limit = 12 } = request.query as { cursor?: string; limit?: number };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User");

    const where: any = {
      authorId: userId,
      moderationAction: { in: ["ALLOW", "ADD_CONTEXT"] },
    };

    if (cursor) {
      const cursorThought = await prisma.thought.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cursorThought) {
        where.createdAt = { lt: cursorThought.createdAt };
      }
    }

    const thoughts = await prisma.thought.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            isHumanVerified: true,
            trustSignals: true,
            createdAt: true,
          },
        },
        reactions: { select: { type: true } },
        context: true,
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 50),
    });

    return reply.send({ thoughts });
  });
}
