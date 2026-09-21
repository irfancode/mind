import { FastifyInstance } from "fastify";
import { prisma } from "@mind/db";
import { AgeGroup, FeedVibe, Language, UIMode } from "@mind/shared-types";
import { signToken } from "../lib/jwt.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { authMiddleware } from "../middleware/auth.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", async (request, reply) => {
    const { displayName, preferredLanguages, ageGroup, feedVibe } = request.body as {
      displayName: string;
      preferredLanguages: Language[];
      ageGroup: AgeGroup;
      feedVibe: FeedVibe;
    };

    if (!displayName || displayName.length < 1 || displayName.length > 50) {
      throw new BadRequestError("Display name must be 1-50 characters");
    }

    if (!preferredLanguages || preferredLanguages.length === 0) {
      throw new BadRequestError("At least one language is required");
    }

    if (!ageGroup) {
      throw new BadRequestError("Age group is required");
    }

    const uiMode =
      ageGroup === AgeGroup.UNDER_13 || ageGroup === AgeGroup.AGE_13_15
        ? UIMode.CHILD
        : ageGroup === AgeGroup.AGE_60_PLUS
        ? UIMode.SENIOR
        : UIMode.STANDARD;

    const user = await prisma.user.create({
      data: {
        displayName,
        preferredLanguages,
        ageGroup,
        feedVibe: feedVibe || FeedVibe.CALM,
        uiMode,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED"],
        humanPassportId: `hp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      },
    });

    const token = signToken({
      userId: user.id,
      displayName: user.displayName,
      ageGroup: user.ageGroup,
      uiMode: user.uiMode,
      isHumanVerified: user.isHumanVerified,
    });

    return reply.status(201).send({ user, token });
  });

  app.post("/api/auth/onboarding/step1", async (request, reply) => {
    const { displayName } = request.body as { displayName: string };
    if (!displayName || displayName.length < 1 || displayName.length > 50) {
      throw new BadRequestError("Display name must be 1-50 characters");
    }
    return reply.send({ valid: true, displayName });
  });

  app.post("/api/auth/onboarding/step2", async (request, reply) => {
    const { preferredLanguages } = request.body as { preferredLanguages: Language[] };
    if (!preferredLanguages || preferredLanguages.length === 0) {
      throw new BadRequestError("At least one language is required");
    }
    return reply.send({ valid: true, preferredLanguages });
  });

  app.post("/api/auth/onboarding/step3", async (request, reply) => {
    const { ageGroup } = request.body as { ageGroup: AgeGroup };
    if (!ageGroup || !Object.values(AgeGroup).includes(ageGroup)) {
      throw new BadRequestError("Valid age group is required");
    }
    return reply.send({ valid: true, ageGroup });
  });

  app.post("/api/auth/onboarding/step4", async (request, reply) => {
    const { feedVibe } = request.body as { feedVibe: FeedVibe };
    if (!feedVibe || !Object.values(FeedVibe).includes(feedVibe)) {
      throw new BadRequestError("Valid feed vibe is required");
    }
    return reply.send({ valid: true, feedVibe });
  });

  app.get("/api/auth/me", { preHandler: [authMiddleware] }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
    });
    if (!user) throw new NotFoundError("User");
    return { user };
  });
}
