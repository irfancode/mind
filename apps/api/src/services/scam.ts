import { ScamFlag } from "@mind/shared-types";

interface ScamCheckResult {
  isSuspicious: boolean;
  riskScore: number;
  flags: ScamFlag[];
  recommendation: string;
}

const FINANCIAL_PATTERNS = [
  { pattern: /\b(send|transfer|wire|pay)\b.*\b\d+|(\$?\d+).*\b(send|transfer|wire|pay)\b/i, type: "FINANCIAL_REQUEST", severity: "HIGH" as const },
  { pattern: /\b(singpass|cpf|bank)\s+(password|login|otp|pin|account)\b/i, type: "CREDENTIAL_REQUEST", severity: "CRITICAL" as const },
  { pattern: /\b(crypto|bitcoin|ethereum|invest)\b.*\b(return|profit|guarantee|double)\b/i, type: "INVESTMENT_SCAM", severity: "HIGH" as const },
  { pattern: /\b(double|triple)\s+your\s+money\b/i, type: "INVESTMENT_SCAM", severity: "HIGH" as const },
  { pattern: /\b(you\s+have\s+won|won\s+a\s+prize|congratulations)\b.*\b(claim|click|collect)\b/i, type: "PRIZE_SCAM", severity: "MEDIUM" as const },
  { pattern: /\b(claim\s+your\s+prize|click\s+here\s+to\s+claim)\b/i, type: "PRIZE_SCAM", severity: "MEDIUM" as const },
  { pattern: /\b(urgent|immediately|act\s+now|expire|limited\s+time)\b.*\b(pay|send|transfer)\b/i, type: "URGENCY_MANIPULATION", severity: "HIGH" as const },
  { pattern: /\b(pay|send|transfer)\b.*\b(urgent|immediately|act\s+now)\b/i, type: "URGENCY_MANIPULATION", severity: "HIGH" as const },
];

const MOVETOOTHER_PATTERNS = [
  { pattern: /\b(whatsapp|telegram|signal|wechat|line)\b.*\b(me|us|chat|there|continue)\b/i, type: "PLATFORM_SWITCH", severity: "MEDIUM" as const },
  { pattern: /\b(continue|chat|talk)\b.*\b(whatsapp|telegram|signal|wechat|line)\b/i, type: "PLATFORM_SWITCH", severity: "MEDIUM" as const },
  { pattern: /\b(text\s+me|call\s+me|dm\s+me)\b.*\b(number|phone)?\b/i, type: "CONTACT_REQUEST", severity: "MEDIUM" as const },
];

const ROMANCE_SCAM_PATTERNS = [
  { pattern: /\b(i\s+love\s+you)\b.*\b(send|money|transfer|pay)\b/i, type: "ROMANCE_SCAM", severity: "HIGH" as const },
  { pattern: /\b(send|money|transfer|pay)\b.*\b(i\s+love\s+you)\b/i, type: "ROMANCE_SCAM", severity: "HIGH" as const },
  { pattern: /\b(i\s+love\s+you)\b.*\b(urgent|need|help)\b/i, type: "ROMANCE_SCAM", severity: "HIGH" as const },
];

export function checkForScams(content: string, accountAgeDays: number): ScamCheckResult {
  const flags: ScamFlag[] = [];
  let totalRisk = 0;

  for (const { pattern, type, severity } of FINANCIAL_PATTERNS) {
    if (pattern.test(content)) {
      const severityScore = { LOW: 10, MEDIUM: 30, HIGH: 60, CRITICAL: 90 }[severity];
      totalRisk += severityScore;
      flags.push({
        type,
        description: `Detected ${type.toLowerCase().replace(/_/g, " ")} pattern`,
        severity,
      });
    }
  }

  for (const { pattern, type, severity } of MOVETOOTHER_PATTERNS) {
    if (pattern.test(content)) {
      totalRisk += 20;
      flags.push({
        type,
        description: `Attempt to move conversation to another platform`,
        severity,
      });
    }
  }

  for (const { pattern, type, severity } of ROMANCE_SCAM_PATTERNS) {
    if (pattern.test(content)) {
      const severityScore = { LOW: 10, MEDIUM: 30, HIGH: 60, CRITICAL: 90 }[severity];
      totalRisk += severityScore;
      flags.push({
        type,
        description: `Romance scam indicator detected`,
        severity,
      });
    }
  }

  if (accountAgeDays < 3) {
    totalRisk += 30;
    flags.push({
      type: "NEW_ACCOUNT",
      description: "Account is less than 3 days old",
      severity: "MEDIUM",
    });
  }

  const riskScore = Math.min(totalRisk, 100);

  let recommendation = "No issues detected.";
  if (riskScore >= 70) {
    recommendation = "High scam risk. Consider blocking this interaction.";
  } else if (riskScore >= 40) {
    recommendation = "Moderate scam indicators. Proceed with caution.";
  } else if (riskScore >= 20) {
    recommendation = "Minor indicators detected. Stay alert.";
  }

  return {
    isSuspicious: riskScore >= 40,
    riskScore,
    flags,
    recommendation,
  };
}
