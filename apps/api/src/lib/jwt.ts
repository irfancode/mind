import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mind-dev-secret-change-in-production";
const JWT_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  displayName: string;
  ageGroup: string;
  uiMode: string;
  isHumanVerified: boolean;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
