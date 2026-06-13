// Lightweight request rate limiting.
//
// Strategy:
//   - If Upstash Redis is configured (UPSTASH_REDIS_REST_URL + _TOKEN), use it
//     so limits hold across serverless instances. (Optional — not a dependency.)
//   - Otherwise fall back to an in-memory fixed-window counter. This is
//     per-instance only: on Vercel each lambda has its own memory, so the
//     effective limit is "max * number of warm instances". Good enough as a
//     basic abuse brake; revisit with Upstash if spam becomes a real problem.
//
// Window is a fixed bucket: the first hit starts a window of `windowMs`, and
// the counter resets once that window elapses.

interface Bucket {
  count: number;
  resetAt: number; // epoch ms when the window expires
}

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow unbounded from one-off IPs.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  buckets.forEach((b, key) => {
    if (b.resetAt <= now) buckets.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

/**
 * Fixed-window rate limit check. Records the hit and returns whether it is
 * within the limit.
 *
 * @param key      Unique identifier for the caller (e.g. IP address).
 * @param max      Max allowed hits per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= max;
  const remaining = Math.max(0, max - bucket.count);
  const retryAfterSec = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));

  return { allowed, remaining, resetAt: bucket.resetAt, retryAfterSec };
}

/**
 * Best-effort client IP extraction for requests behind Vercel's proxy.
 * `x-forwarded-for` is a comma-separated list; the left-most entry is the
 * original client. Falls back to `x-real-ip`, then a constant so the limiter
 * still functions (globally) if no IP header is present.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
