import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { authMiddleware } from "../middleware/auth.js";
import { NotFoundError, ConflictError } from "../lib/errors.js";

export async function socialRoutes(app: FastifyInstance) {
  app.post("/api/follow/:userId", { preHandler: [authMiddleware] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };

    if (userId === request.user!.userId) {
      throw new ConflictError("Cannot follow yourself");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new NotFoundError("User");

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: request.user!.userId,
          followingId: userId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return reply.send({ following: false });
    }

    await prisma.follow.create({
      data: {
        followerId: request.user!.userId,
        followingId: userId,
      },
    });

    return reply.status(201).send({ following: true });
  });

  app.get("/api/users/:userId/followers", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            displayName: true,
            isHumanVerified: true,
            trustSignals: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reply.send({ followers: followers.map((f) => f.follower) });
  });

  app.get("/api/users/:userId/following", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            displayName: true,
            isHumanVerified: true,
            trustSignals: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reply.send({ following: following.map((f) => f.following) });
  });

  app.get("/api/users/:userId/profile", async (request, reply) => {
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
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundError("User");

    return reply.send({ user });
  });
}
