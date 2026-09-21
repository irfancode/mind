import { prisma } from "@mind/db";
import { FeedItem, Feed } from "@mind/shared-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const FEED_SIZE = 12;

export async function getFeed(
  userId: string,
  cursor?: string
): Promise<Feed> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const followingIds = (
    await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })
  ).map((f) => f.followingId);

  // If not following anyone, show popular content from the platform
  const authorIds = followingIds.length > 0 ? [userId, ...followingIds] : undefined;

  const where: any = {
    moderationAction: { in: ["ALLOW", "ADD_CONTEXT"] },
  };

  if (authorIds) {
    where.authorId = { in: authorIds };
  }

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
      reactions: {
        select: { type: true },
      },
      context: true,
    },
    orderBy: { createdAt: "desc" },
    take: FEED_SIZE + 1,
  });

  const hasMore = thoughts.length > FEED_SIZE;
  const items = thoughts.slice(0, FEED_SIZE);

  const feedItems: FeedItem[] = items.map((thought) => {
    const reactionCounts = {} as Record<string, number>;
    for (const r of thought.reactions) {
      reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    }

    let score = 0;
    let reason = "From your network";

    if (thought.authorId === userId) {
      score = 100;
      reason = "Your thought";
    } else if (followingIds.includes(thought.authorId)) {
      score = 80;
      reason = "From someone you follow";
    }

    if (thought.classification === "EVIDENCE_BACKED") {
      score += 10;
      reason = "Evidence-backed content";
    }

    if (user.feedVibe === "CURIOUS" && thought.type === "QUESTION") {
      score += 5;
    }
    if (user.feedVibe === "CREATIVE" && thought.type === "IDEA") {
      score += 5;
    }

    const ageBoost = thought.createdAt.getTime() > Date.now() - 3600000 ? 20 : 0;
    score += ageBoost;

    return {
      thought: {
        ...thought,
        reactionCounts: reactionCounts as Any,
      } as Any,
      score,
      reason,
    };
  });

  feedItems.sort((a, b) => b.score - a.score);

  return {
    items: feedItems,
    isCaughtUp: !hasMore,
    nextCursor: hasMore ? items[items.length - 1].id : undefined,
  };
}
