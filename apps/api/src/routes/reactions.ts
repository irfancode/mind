import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { ReactionType } from "@mind/shared-types";
import { authMiddleware } from "../middleware/auth.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";

export async function reactionRoutes(app: FastifyInstance) {
  app.post("/api/reactions", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { thoughtId, type } = request.body as {
      thoughtId: string;
      type: ReactionType;
    };

    if (!thoughtId) throw new BadRequestError("thoughtId is required");
    if (!type || !Object.values(ReactionType).includes(type)) {
      throw new BadRequestError("Valid reaction type is required");
    }

    const thought = await prisma.thought.findUnique({ where: { id: thoughtId } });
    if (!thought) throw new NotFoundError("Thought");

    const existing = await prisma.reaction.findUnique({
      where: {
        userId_thoughtId_type: {
          userId: request.user!.userId,
          thoughtId,
          type,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return reply.send({ removed: true, type });
    }

    const reaction = await prisma.reaction.create({
      data: {
        userId: request.user!.userId,
        thoughtId,
        type,
      },
    });

    return reply.status(201).send({ reaction });
  });

  app.get("/api/thoughts/:thoughtId/reactions", async (request, reply) => {
    const { thoughtId } = request.params as { thoughtId: string };

    const reactions = await prisma.reaction.groupBy({
      by: ["type"],
      where: { thoughtId },
      _count: { type: true },
    });

    const counts: Record<string, number> = {};
    for (const r of reactions) {
      counts[r.type] = r._count.type;
    }

    return reply.send({ counts });
  });
}
