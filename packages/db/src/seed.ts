import { PrismaClient, AgeGroup, FeedVibe, ThoughtType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MIND database...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        displayName: "Sarah Tan",
        ageGroup: AgeGroup.AGE_25_39,
        preferredLanguages: [Language.en, Language.zh],
        feedVibe: FeedVibe.CALM,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED", "COMMUNITY_MEMBER"],
        humanPassportId: "hp_sarah_001",
      },
    }),
    prisma.user.create({
      data: {
        displayName: "Ahmad bin Hassan",
        ageGroup: AgeGroup.AGE_40_59,
        preferredLanguages: [Language.en, Language.ms],
        feedVibe: FeedVibe.LOCAL,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED"],
        humanPassportId: "hp_ahmad_001",
      },
    }),
    prisma.user.create({
      data: {
        displayName: "Priya Devi",
        ageGroup: AgeGroup.AGE_18_24,
        preferredLanguages: [Language.en, Language.ta],
        feedVibe: FeedVibe.CURIOUS,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED"],
        humanPassportId: "hp_priya_001",
      },
    }),
    prisma.user.create({
      data: {
        displayName: "Chen Wei",
        ageGroup: AgeGroup.AGE_60_PLUS,
        preferredLanguages: [Language.zh, Language.en],
        feedVibe: FeedVibe.FAMILY_FRIENDLY,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED", "COMMUNITY_MEMBER"],
        humanPassportId: "hp_chen_001",
      },
    }),
    prisma.user.create({
      data: {
        displayName: "Little Ming",
        ageGroup: AgeGroup.UNDER_13,
        preferredLanguages: [Language.en, Language.zh],
        feedVibe: FeedVibe.FAMILY_FRIENDLY,
        isHumanVerified: true,
        trustSignals: ["HUMAN_VERIFIED"],
        humanPassportId: "hp_ming_001",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  const thoughts = await Promise.all([
    prisma.thought.create({
      data: {
        authorId: users[0].id,
        type: ThoughtType.THOUGHT,
        content: "I think Singapore needs more shaded walking paths. Walking between MRT stations in the afternoon heat is really tough. What do you all think?",
        classification: "OPINION",
      },
    }),
    prisma.thought.create({
      data: {
        authorId: users[1].id,
        type: ThoughtType.QUESTION,
        content: "Any good prata places near Tampines? My usual spot closed down and I'm craving some roti prata.",
        classification: "OPINION",
      },
    }),
    prisma.thought.create({
      data: {
        authorId: users[2].id,
        type: ThoughtType.IDEA,
        content: "What if hawker centres had AI-assisted queue systems? You could see wait times for each stall on your phone before you even arrive. Would save so much time during lunch rush!",
        classification: "OPINION",
      },
    }),
    prisma.thought.create({
      data: {
        authorId: users[3].id,
        type: ThoughtType.MOMENT,
        content: "Had a wonderful afternoon at Gardens by the Bay with my grandchildren. The new orchid garden is absolutely beautiful. Highly recommend visiting before the school holidays end!",
        classification: "PERSONAL_EXPERIENCE",
      },
    }),
    prisma.thought.create({
      data: {
        authorId: users[0].id,
        type: ThoughtType.THOUGHT,
        content: "According to the 2026 census, Singapore's population grew by 1.2% this year. The growth is mainly driven by immigration rather than natural increase. This has implications for housing and infrastructure planning.",
        classification: "EVIDENCE_BACKED",
        moderationLayer: "MISINFORMATION_RISK",
        moderationAction: "ADD_CONTEXT",
      },
    }),
    prisma.thought.create({
      data: {
        authorId: users[1].id,
        type: ThoughtType.THOUGHT,
        content: "The new MRT line extensions are really going to change how we commute. Being able to get to Punggol directly from the city without transfers is a game changer.",
        classification: "OPINION",
      },
    }),
  ]);

  console.log(`✅ Created ${thoughts.length} thoughts`);

  await prisma.context.create({
    data: {
      thoughtId: thoughts[4].id,
      summary:
        "Singapore's population statistics are published by the Department of Statistics. The 2026 census data confirms population growth trends.",
      evidenceQuality: "STRONG",
      sources: {
        create: [
          {
            url: "https://www.singstat.gov.sg",
            title: "Singapore Census of Population 2026",
            publisher: "Department of Statistics Singapore",
            reliabilityScore: 0.95,
          },
        ],
      },
    },
  });

  console.log("✅ Created context for evidence-backed thought");

  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[0].id },
      { followerId: users[2].id, followingId: users[0].id },
      { followerId: users[2].id, followingId: users[3].id },
      { followerId: users[3].id, followingId: users[0].id },
    ],
  });

  console.log("✅ Created follow relationships");

  await prisma.reaction.createMany({
    data: [
      { userId: users[1].id, thoughtId: thoughts[0].id, type: "APPRECIATE" },
      { userId: users[2].id, thoughtId: thoughts[0].id, type: "RELATE" },
      { userId: users[3].id, thoughtId: thoughts[0].id, type: "USEFUL" },
      { userId: users[0].id, thoughtId: thoughts[1].id, type: "INTERESTING" },
      { userId: users[3].id, thoughtId: thoughts[2].id, type: "LEARNED_SOMETHING" },
      { userId: users[0].id, thoughtId: thoughts[3].id, type: "APPRECIATE" },
    ],
  });

  console.log("✅ Created reactions");

  console.log("\n🎉 MIND database seeded successfully!");
  console.log("\nTest users:");
  users.forEach((u) => console.log(`  - ${u.displayName} (${u.id})`));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
