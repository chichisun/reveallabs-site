// src/lib/news-jwt.ts — verifies tokens signed by the marketing engine.
// SAME secret on both sides (NEWS_REVIEW_SECRET in both repos' env).
import { jwtVerify } from "jose";

export interface ReviewTokenPayload {
  item_id: string;
  action_scope: "review";
}

function key(): Uint8Array {
  const v = process.env.NEWS_REVIEW_SECRET;
  if (!v) throw new Error("NEWS_REVIEW_SECRET not set");
  return new TextEncoder().encode(v);
}

export async function verifyReviewToken(
  token: string,
): Promise<ReviewTokenPayload> {
  const { payload } = await jwtVerify(token, key(), {
    algorithms: ["HS256"],
  });
  if (payload.action_scope !== "review" || typeof payload.item_id !== "string") {
    throw new Error("invalid token shape");
  }
  return { item_id: payload.item_id, action_scope: "review" };
}
