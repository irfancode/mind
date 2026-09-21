# MIND — A Place for Human Thought

> A social media platform built for Singapore that optimizes for **meaning × trust × usefulness × human connection** — not addiction.

![MIND Platform](https://img.shields.io/badge/platform-MIND-blue?style=for-the-badge)
![Singapore](https://img.shields.io/badge/market-🇸🇬_Singapore-red?style=for-the-badge)
![Users](https://img.shields.io/badge/users-1%2C000-green?style=for-the-badge)
![Thoughts](https://img.shields.io/badge/thoughts-6%2C166-purple?style=for-the-badge)

---

## What is MIND?

MIND is a reimagined social media platform designed from the ground up for Singapore's diverse, multilingual society. It replaces the toxic engagement-maximization model with a **human-centered approach** that values thoughtful discourse, community trust, and genuine connection.

### Core Philosophy

| Traditional Social Media | MIND |
|--------------------------|------|
| Maximize engagement | Maximize meaning |
| Infinite scroll | 12 items, then "You're caught up" |
| Retweets/Shares | Share-with-intent (with why) |
| Like/Heart reactions | 6 semantic reactions |
| Anonymous accounts | Human Passport (identity proof) |
| Algorithmic manipulation | Transparent feed scoring |
| Reactive moderation | 5-layer pre-amplification moderation |

---

## Features

### Human Passport
Every account has a cryptographic identity proof — you're talking to real people, not bots.

### 6 Semantic Reactions
Instead of a single "like," express what you actually think:

| Reaction | Meaning |
|----------|---------|
| 🙏 **Appreciate** | "This adds value to the conversation" |
| 🔧 **Useful** | "This is practical and actionable" |
| 💡 **Interesting** | "This makes me think" |
| 📚 **Learned Something** | "I didn't know this before" |
| 🤝 **Relate** | "I feel this too" |
| ⚖️ **Disagree** | "I see it differently" (constructive) |

### Share-with-Intent
When you share someone's thought, you must declare *why*:
- Agree / Disagree
- Useful / Interesting
- Asking a Question
- Adding Context

No more mindless retweets. Every share carries meaning.

### 5-Layer Pre-Amplification Moderation

```
Layer 1: Automated Rules (spam, scam patterns)
    ↓
Layer 2: Content Classification (opinion vs evidence)
    ↓
Layer 3: Community Signals (trust scores)
    ↓
Layer 4: Context Verification (fact-checking)
    ↓
Layer 5: Human Review (edge cases)
```

### Context Layers
Claims get tagged with evidence sources. See *why* something is amplified.

### Age-Appropriate UI
- **CHILD** (Under 16): Simplified, safe, restricted interactions
- **SENIOR** (60+): Larger text, simpler navigation
- **STANDARD** (Everyone else): Full experience

### Feed Vibe Selection
Choose your experience:
- 🧘 Calm — Peaceful and thoughtful
- 🔍 Curious — Learning and discovery
- 🇸🇬 Local — Singapore-focused
- 🌍 Global — World perspectives
- 💼 Professional — Career and industry
- 🎨 Creative — Art and expression
- 👨‍👩‍👧‍👦 Family — Safe for all ages

---

## Singapore Context

MIND is built specifically for Singapore:

| Feature | Singapore Adaptation |
|---------|---------------------|
| Languages | English, 中文, Bahasa Melayu, தமிழ் |
| Names | Chinese, Malay, Indian, Eurasian naming conventions |
| Food References | Chicken rice, laksa, teh tarik, kopi o |
| Locations | Tampines, Jurong, Maxwell, Marina Bay, and more |
| Singlish | Naturally integrated phrases ("Wah, damn shiok sia!") |
| Topics | HDB, COE, CPF, PSLE, hawker culture, MRT |
| Regulations | POFMA, IMDA, Online Safety Act compliant |

---

## Tech Stack

```
mind/
├── apps/
│   ├── api/          # Fastify + TypeScript backend
│   └── web/          # React + Vite + Tailwind frontend
├── packages/
│   ├── shared-types/ # TypeScript interfaces & enums
│   └── db/           # Prisma schema & seed data
├── docker-compose.yml # PostgreSQL setup
└── turbo.json        # Monorepo configuration
```

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3 |
| **Backend** | Fastify 4, TypeScript 5 |
| **Database** | PostgreSQL 16, Prisma 5 |
| **Monorepo** | Turborepo 2 |
| **Auth** | JWT + Human Passport |
| **Testing** | Custom test runner (46 tests) |

---

## Synthetic Data

The platform comes populated with **realistic Singapore discussion data**:

| Metric | Count |
|--------|-------|
| 👥 Users | 1,000 |
| 💭 Thoughts | 6,166 |
| 💬 Replies | 6,102 |
| 👏 Reactions | 15,061 |
| ↗️ Shares | 1,329 |
| 🔗 Follows | 27,747 |

### 50 Discussion Topics

Covering all major Singapore issues:

| Category | Topics |
|----------|--------|
| **Cost of Living** | Hawker prices, COE, grocery bills, salary adequacy |
| **Housing** | BTO wait times, resale prices, EC vs BTO |
| **Healthcare** | Medical inflation, polyclinic waits, mental health |
| **Education** | PSLE stress, university fees, tuition culture |
| **Employment** | Fresh grad salaries, foreign talent, gig economy |
| **Transport** | MRT breakdowns, Grab prices, cycling safety |
| **Food & Culture** | Hawker preservation, Singlish, kopi vs teh |
| **Weather** | Climate change, sustainability, rain |
| **Government** | Budget 2026, CPF, NS, foreign policy |
| **Social** | Youth mental health, dating, racial harmony |

---

## Quick Start

### Prerequisites
- Node.js ≥ 20
- Docker (for PostgreSQL)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/mind.git
cd mind
npm install
```

### 2. Start Database

```bash
docker-compose up -d
```

### 3. Setup Database

```bash
cp .env.example .env
DATABASE_URL="postgresql://mind:mind_dev@localhost:5432/mind_dev?schema=public" npx prisma db push --workspace=packages/db
```

### 4. Seed Data (Optional — 1,000 users)

```bash
DATABASE_URL="postgresql://mind:mind_dev@localhost:5432/mind_dev?schema=public" npx ts-node --esm packages/db/src/seed-massive.ts
```

### 5. Start Development

```bash
npm run dev
```

### 6. Open

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/feed` | Get personalized feed |
| GET | `/api/feed/why?thoughtId=` | Why am I seeing this? |
| POST | `/api/thoughts` | Create thought |
| GET | `/api/thoughts/:id` | Get thought |
| DELETE | `/api/thoughts/:id` | Delete thought |
| POST | `/api/reactions` | Add reaction |
| POST | `/api/shares` | Share with intent |
| POST | `/api/follow/:userId` | Follow/unfollow |
| GET | `/api/users/:id/profile` | Get profile |
| GET | `/api/trust/passport/:id` | Get Human Passport |

---

## Testing

```bash
# Run API tests (46 tests)
cd apps/api && npx tsx src/test-runner.ts

# Type checking
npm run typecheck

# Build all
npm run build
```

### Test Coverage

| Module | Tests |
|--------|-------|
| Moderation Engine | 15 |
| Scam Detection | 10 |
| Content Classification | 6 |
| Edge Cases | 10 |
| Scam Edge Cases | 5 |
| **Total** | **46** |

---

## Project Structure

```
mind/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── index.ts              # Fastify server
│   │   │   ├── routes/               # API routes
│   │   │   │   ├── auth.ts           # Registration & onboarding
│   │   │   │   ├── thoughts.ts       # Thought CRUD
│   │   │   │   ├── feed.ts           # Feed + "why am I seeing this"
│   │   │   │   ├── reactions.ts      # 6 semantic reactions
│   │   │   │   ├── shares.ts         # Share-with-intent
│   │   │   │   ├── social.ts         # Follow/unfollow
│   │   │   │   └── trust.ts          # Human Passport, context
│   │   │   ├── services/             # Business logic
│   │   │   │   ├── moderation.ts     # 5-layer pre-amplification
│   │   │   │   ├── scam.ts           # Scam detection
│   │   │   │   ├── feed.ts           # Feed scoring algorithm
│   │   │   │   └── thoughts.ts       # Thought classification
│   │   │   ├── middleware/           # Auth middleware
│   │   │   ├── lib/                  # Utilities
│   │   │   └── test-runner.ts        # 46 comprehensive tests
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── App.tsx               # Routing & auth guards
│       │   ├── context/              # React contexts
│       │   │   ├── AuthContext.tsx    # Authentication state
│       │   │   └── FeedContext.tsx    # Feed state management
│       │   ├── components/
│       │   │   ├── onboarding/       # 4-step registration
│       │   │   ├── feed/             # ThoughtCard, ShareButton
│       │   │   ├── composer/         # Thought composer
│       │   │   ├── reactions/        # ReactionBar
│       │   │   └── trust/            # ContextBadge, TrustSignals
│       │   ├── pages/
│       │   │   ├── HomePage.tsx      # Feed with "caught up" model
│       │   │   ├── ProfilePage.tsx   # User profile
│       │   │   └── TrustPage.tsx     # Trust & safety info
│       │   ├── styles/
│       │   │   ├── senior.css        # Senior-friendly styles
│       │   │   ├── child.css         # Child-safe styles
│       │   │   └── simple.css        # Simplified styles
│       │   └── lib/
│       │       └── api.ts            # API client
│       ├── tailwind.config.js        # Custom theme
│       └── package.json
├── packages/
│   ├── shared-types/
│   │   └── src/
│   │       ├── enums.ts              # All enumerations
│   │       ├── interfaces.ts         # TypeScript interfaces
│   │       └── contracts.ts          # API contracts
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Database schema (10 models)
│   │   └── src/
│   │       ├── index.ts              # Prisma client
│   │       ├── seed.ts               # Basic seed (5 users)
│   │       └── seed-massive.ts       # Full seed (1,000 users)
│   └── package.json
├── docker-compose.yml                # PostgreSQL
├── turbo.json                        # Turborepo config
├── tsconfig.base.json                # Shared TypeScript config
└── package.json                      # Root workspace config
```

---

## Database Schema

```prisma
model User {
  id                String    @id @default(cuid())
  displayName       String
  ageGroup          AgeGroup
  preferredLanguages Language[]
  feedVibe          FeedVibe
  uiMode            UIMode
  isHumanVerified   Boolean
  trustSignals      TrustSignal[]
  humanPassportId   String?
  thoughts          Thought[]
  reactions         Reaction[]
  shares            Share[]
  following         Follow[]  @relation("following")
  followers         Follow[]  @relation("followers")
}

model Thought {
  id           String    @id @default(cuid())
  authorId     String
  author       User      @relation(fields: [authorId], references: [id])
  type         ThoughtType
  content      String
  language     Language?
  replyToId    String?
  replyTo      Thought?  @relation("replies", fields: [replyToId], references: [id])
  replies      Thought[] @relation("replies")
  reactions    Reaction[]
  shares       Share[]
  context      Context?
  // ... moderation fields
}
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built with care for Singapore's diverse, multilingual community.

> "A place where thoughts are valued, not weaponized."

---

**Made with 🧠 in Singapore**
