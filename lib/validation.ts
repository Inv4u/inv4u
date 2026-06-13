// Input validation for the public lead form. Mirrors the client-side checks
// but is the authoritative gate — never trust the browser.

export const NAME_MIN = 2;
export const NAME_MAX = 100;

// Pragmatic email shape check. Deliberately not RFC-5322-exhaustive: it rejects
// obvious garbage without bouncing legitimate addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function isValidName(name: string): boolean {
  const len = name.trim().length;
  return len >= NAME_MIN && len <= NAME_MAX;
}

/**
 * Israeli mobile/landline validation.
 * Accepts, after stripping spaces / dashes / parentheses:
 *   - Local:        0XXXXXXXXX  (10 digits, leading 0 — e.g. 0506445570)
 *   - International: +972XXXXXXXXX or 972XXXXXXXXX (drops the leading 0)
 * The national significant number is 9 digits (e.g. 50 644 5570).
 */
export function isValidIsraeliPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // +972 / 972 international form -> 9 national digits, first digit 2-9.
  if (/^\+?972[2-9]\d{8}$/.test(cleaned)) return true;
  // Local form: 0 + 9 national digits, first national digit 2-9.
  if (/^0[2-9]\d{8}$/.test(cleaned)) return true;
  return false;
}
