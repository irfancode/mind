import {
  ModerationLayer,
  ModerationAction,
} from "@mind/shared-types";

const BLOCKED_PATTERNS = [
  /\b(child\s*sex|csam|cp)\b/i,
  /\b(terroris|bomb\s*making|attack\s*plan)\b/i,
  /\b(buy\s*drugs|sell\s*drugs|drug\s*dealing)\b/i,
  /\b(doxx|dox\s*my|find\s*their\s*address)\b/i,
  /\b(suicide\s*method|how\s*to\s*hang)\b/i,
  /\b(nonconsensual|intimate\s*image\s*leak)\b/i,
];

const SCAM_PATTERNS = [
  /\b(send|transfer|wire|pay)\b.*\b\d+|(\$?\d+).*\b(send|transfer|wire|pay)\b/i,
  /\b(send\s*money|transfer\s*funds|wire\s*transfer)\b/i,
  /\b(crypto\s*investment|guaranteed\s*returns|double\s*your\s*money)\b/i,
  /\b(singpass\s*password|otp\s*code|bank\s*login)\b/i,
  /\b(urgent\s*payment|act\s*now|limited\s*time\s*offer)\b/i,
  /\b(click\s*here\s+to\s+claim|you\s+have\s+won)\b/i,
  /\b(whatsapp|telegram|signal)\s+(me|us|chat)\b/i,
];

const GROOMING_INDICATORS = [
  /\b(keep\s*this\s*between\s*us|our\s*little\s*secret)\b/i,
  /\b(don'?t\s*tell\s*(your\s*)?(parents?|mom|dad))\b/i,
  /\b(meet\s*(me|up)\s*(in\s*person|privately))\b/i,
  /\b(send\s*(me\s*)?(photo|pic|picture|selfie))\b/i,
];

const HARASSMENT_INDICATORS = [
  /\b(you'?re?\s*(so\s*)?(stupid|ugly|worthless|deserve\s*to\s*die))\b/i,
  /\b(i'?ll?\s*(find\s*you|kill\s*you|hurt\s*you))\b/i,
  /\b(rape|rapist)\b/i,
];

export interface ModerationResult {
  layer: ModerationLayer;
  action: ModerationAction;
  confidence: number;
  reasons: string[];
  requiresHumanReview: boolean;
}

export function moderateContent(
  content: string,
  _authorAgeGroup: string
): ModerationResult {
  const reasons: string[] = [];
  let layer = ModerationLayer.CLEAN;
  let action = ModerationAction.ALLOW;
  let confidence = 0;
  let requiresHumanReview = false;

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      layer = ModerationLayer.ILLEGAL;
      action = ModerationAction.BLOCK;
      confidence = 0.95;
      reasons.push("Matches illegal content pattern");
      return { layer, action, confidence, reasons, requiresHumanReview: true };
    }
  }

  const scamScore = SCAM_PATTERNS.filter((p) => p.test(content)).length;
  if (scamScore >= 1) {
    layer = ModerationLayer.DANGEROUS_INTERACTION;
    action = ModerationAction.QUARANTINE;
    confidence = 0.85;
    reasons.push("Scam indicators detected");
    requiresHumanReview = true;
  }

  const groomingScore = GROOMING_INDICATORS.filter((p) => p.test(content)).length;
  if (groomingScore >= 1) {
    layer = ModerationLayer.DANGEROUS_INTERACTION;
    action = ModerationAction.QUARANTINE;
    confidence = 0.9;
    reasons.push("Grooming language detected");
    requiresHumanReview = true;
  }

  const harassmentScore = HARASSMENT_INDICATORS.filter((p) => p.test(content)).length;
  if (harassmentScore >= 1) {
    layer = ModerationLayer.DANGEROUS_INTERACTION;
    action = ModerationAction.REDUCE_AMPLIFICATION;
    confidence = 0.8;
    reasons.push("Harassment language detected");
    requiresHumanReview = true;
  }

  const CLAIM_PATTERNS = [
    /\b(studies?\s+show|research\s+proves|data\s+shows|statistics\s+show)\b/i,
    /\b(\d+%|\d+\s*percent)\b/i,
    /\b(according\s+to|reported\s+by|confirmed\s+by)\b/i,
    /\b(singapore'?s?\s+population|gdp|unemployment\s+rate)\b/i,
  ];

  const claimScore = CLAIM_PATTERNS.filter((p) => p.test(content)).length;
  if (claimScore >= 1 && reasons.length === 0) {
    layer = ModerationLayer.MISINFORMATION_RISK;
    action = ModerationAction.ADD_CONTEXT;
    confidence = 0.6;
    reasons.push("Factual claim detected - context check recommended");
  }

  if (reasons.length === 0) {
    confidence = 0.9;
  }

  return { layer, action, confidence, reasons, requiresHumanReview };
}
