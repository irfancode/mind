import {
  AgeGroup,
  ThoughtType,
  FeedVibe,
  ReactionType,
  ShareIntent,
  Language,
  UIMode,
  ReportCategory,
} from "./enums";
import {
  User,
  UserProfile,
  Thought,
  Feed,
  Context,
  ModerationResult,
  ScamCheck,
  Report,
} from "./interfaces";

export interface RegisterRequest {
  displayName: string;
  preferredLanguages: Language[];
  ageGroup: AgeGroup;
  feedVibe: FeedVibe;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  passkeyCredentialId: string;
  passkeySignature: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateThoughtRequest {
  type: ThoughtType;
  content: string;
  replyToId?: string;
}

export interface CreateThoughtResponse {
  thought: Thought;
  moderation: ModerationResult;
}

export interface GetFeedRequest {
  cursor?: string;
  limit?: number;
}

export interface GetFeedResponse {
  feed: Feed;
}

export interface AddReactionRequest {
  thoughtId: string;
  type: ReactionType;
}

export interface ShareThoughtRequest {
  thoughtId: string;
  intent: ShareIntent;
  addedContext?: string;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  user: UserProfile;
}

export interface SearchThoughtsRequest {
  query: string;
  cursor?: string;
  limit?: number;
}

export interface SearchThoughtsResponse {
  thoughts: Thought[];
  nextCursor?: string;
}

export interface GetThoughtContextRequest {
  thoughtId: string;
}

export interface GetThoughtContextResponse {
  context: Context | null;
}

export interface ReportContentRequest {
  thoughtId?: string;
  userId?: string;
  category: ReportCategory;
  description: string;
}

export interface ReportContentResponse {
  report: Report;
}

export interface UpdateProfileRequest {
  displayName?: string;
  feedVibe?: FeedVibe;
  preferredLanguages?: Language[];
  uiMode?: UIMode;
}

export interface ScamCheckRequest {
  thoughtId: string;
  content: string;
}

export interface ScamCheckResponse {
  result: ScamCheck;
}

export interface OnboardingStep1Request {
  displayName: string;
}

export interface OnboardingStep2Request {
  preferredLanguages: Language[];
}

export interface OnboardingStep3Request {
  ageGroup: AgeGroup;
}

export interface OnboardingStep4Request {
  feedVibe: FeedVibe;
}

export interface OnboardingCompleteResponse {
  user: User;
  token: string;
}

export interface WhyAmISeeingThisRequest {
  thoughtId: string;
}

export interface WhyAmISeeingThisResponse {
  reason: string;
  factors: string[];
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}
