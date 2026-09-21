import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { ShareIntent } from "@mind/shared-types";
import { authMiddleware } from "../middleware/auth.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";

export async function shareRoutes(app: FastifyInstance) {
  app.post("/api/shares", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { thoughtId, intent, addedContext } = request.body as {
      thoughtId: string;
      intent: ShareIntent;
      addedContext?: string;
    };

    if (!thoughtId) throw new BadRequestError("thoughtId is required");
    if (!intent || !Object.values(ShareIntent).includes(intent)) {
      throw new BadRequestError("Valid share intent is required");
    }

    const thought = await prisma.thought.findUnique({ where: { id: thoughtId } });
    if (!thought) throw new NotFoundError("Thought");

    const share = await prisma.share.create({
      data: {
        userId: request.user!.userId,
        thoughtId,
        intent,
        addedContext,
      },
    });

    await prisma.thought.update({
      where: { id: thoughtId },
      data: { shareCount: { increment: 1 } },
    });

    return reply.status(201).send({ share });
  });

  app.get("/api/thoughts/:thoughtId/shares", async (request, reply) => {
    const { thoughtId } = request.params as { thoughtId: string };

    const shares = await prisma.share.findMany({
      where: { thoughtId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            isHumanVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reply.send({ shares });
  });
}
