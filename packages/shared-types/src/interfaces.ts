import {
  AgeGroup,
  ThoughtType,
  FeedVibe,
  ReactionType,
  ShareIntent,
  ContentProvenance,
  ContentClassification,
  ModerationLayer,
  ModerationAction,
  ReportCategory,
  AccountStatus,
  Language,
  TrustSignal,
  UIMode,
} from "./enums";

export interface User {
  id: string;
  displayName: string;
  ageGroup: AgeGroup;
  preferredLanguages: Language[];
  feedVibe: FeedVibe;
  uiMode: UIMode;
  isHumanVerified: boolean;
  trustSignals: TrustSignal[];
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  displayName: string;
  isHumanVerified: boolean;
  trustSignals: TrustSignal[];
  createdAt: Date;
}

export interface Thought {
  id: string;
  authorId: string;
  author?: UserProfile;
  type: ThoughtType;
  content: string;
  language: Language;
  provenance: ContentProvenance;
  classification: ContentClassification;
  moderationLayer: ModerationLayer;
  moderationAction: ModerationAction;
  isAmplified: boolean;
  contextId?: string;
  context?: Context;
  replyToId?: string;
  replyTo?: Thought;
  reactions?: Reaction[];
  reactionCounts?: Record<ReactionType, number>;
  shareCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reaction {
  id: string;
  userId: string;
  thoughtId: string;
  type: ReactionType;
  createdAt: Date;
}

export interface Share {
  id: string;
  userId: string;
  thoughtId: string;
  intent: ShareIntent;
  addedContext?: string;
  createdAt: Date;
}

export interface Context {
  id: string;
  thoughtId: string;
  summary: string;
  sources: ContextSource[];
  evidenceQuality: EvidenceQuality;
  conflictingEvidence: string[];
  lastChecked: Date;
  createdAt: Date;
}

export interface ContextSource {
  id: string;
  contextId: string;
  url: string;
  title: string;
  publisher: string;
  publishedAt?: Date;
  reliabilityScore: number;
}

export enum EvidenceQuality {
  STRONG = "STRONG",
  MODERATE = "MODERATE",
  WEAK = "WEAK",
  CONFLICTING = "CONFLICTING",
  UNKNOWN = "UNKNOWN",
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  thoughtId?: string;
  userId?: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  resolvedAt?: Date;
  createdAt: Date;
}

export enum ReportStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export interface FeedItem {
  thought: Thought;
  score: number;
  reason: string;
}

export interface Feed {
  items: FeedItem[];
  isCaughtUp: boolean;
  nextCursor?: string;
}

export interface ModerationResult {
  layer: ModerationLayer;
  action: ModerationAction;
  confidence: number;
  reasons: string[];
  requiresHumanReview: boolean;
}

export interface ScamCheck {
  isSuspicious: boolean;
  riskScore: number;
  flags: ScamFlag[];
  recommendation: string;
}

export interface ScamFlag {
  type: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface OnboardingState {
  step: number;
  displayName?: string;
  preferredLanguages: Language[];
  ageGroup?: AgeGroup;
  feedVibe?: FeedVibe;
  isComplete: boolean;
}

export interface AuthPayload {
  userId: string;
  displayName: string;
  ageGroup: AgeGroup;
  uiMode: UIMode;
  isHumanVerified: boolean;
}
