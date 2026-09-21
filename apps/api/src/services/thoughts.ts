import { prisma } from "@mind/db";
import { ThoughtType, ContentClassification, ContentProvenance } from "@mind/shared-types";
import { moderateContent } from "./moderation";

interface CreateThoughtInput {
  authorId: string;
  type: ThoughtType;
  content: string;
  replyToId?: string;
}

export async function createThought(input: CreateThoughtInput) {
  const user = await prisma.user.findUnique({ where: { id: input.authorId } });
  if (!user) throw new Error("User not found");

  const moderation = moderateContent(input.content, user.ageGroup);

  if (moderation.action === "BLOCK") {
    throw new Error("Content blocked by safety systems");
  }

  const classification = classifyContent(input.type, input.content);

  const thought = await prisma.thought.create({
    data: {
      authorId: input.authorId,
      type: input.type,
      content: input.content,
      language: user.preferredLanguages[0] || "en",
      provenance: ContentProvenance.HUMAN_AUTHORED,
      classification,
      moderationLayer: moderation.layer,
      moderationAction: moderation.action,
      isAmplified: moderation.action !== "REDUCE_AMPLIFICATION",
      replyToId: input.replyToId,
    },
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
  });

  await prisma.moderationRecord.create({
    data: {
      thoughtId: thought.id,
      userId: input.authorId,
      layer: moderation.layer,
      action: moderation.action,
      confidence: moderation.confidence,
      reasons: moderation.reasons,
      requiresHumanReview: moderation.requiresHumanReview,
    },
  });

  if (moderation.action === "ADD_CONTEXT") {
    await prisma.context.create({
      data: {
        thoughtId: thought.id,
        summary: "This claim has been flagged for context verification. Sources are being reviewed.",
        evidenceQuality: "UNKNOWN" as any,
        conflictingEvidence: [],
      },
    });
  }

  return { thought, moderation };
}

function classifyContent(type: ThoughtType, content: string): ContentClassification {
  if (type === ThoughtType.QUESTION) return ContentClassification.OPINION;
  if (type === ThoughtType.MOMENT) return ContentClassification.PERSONAL_EXPERIENCE;

  const claimPatterns = [
    /\b(studies?\s+show|research\s+proves|data\s+shows)\b/i,
    /\b(\d+%|\d+\s*percent)\b/i,
    /\b(according\s+to|reported\s+by)\b/i,
  ];

  const hasEvidence = /\b(according\s+to|source:|citation:|reference:)\b/i.test(content);
  if (hasEvidence) return ContentClassification.EVIDENCE_BACKED;

  const hasClaim = claimPatterns.some((p) => p.test(content));
  if (hasClaim) return ContentClassification.CLAIM;

  return ContentClassification.OPINION;
}
