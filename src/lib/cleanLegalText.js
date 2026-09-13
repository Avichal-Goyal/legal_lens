// lib/cleanLegalText.js

/**
 * Safe text cleaner. Deliberately NOT an allow-list — allow-lists silently
 * delete any character you forgot to whitelist (+, =, %, parens, etc).
 * Normalize unicode lookalikes, then strip only genuine junk.
 */
export function cleanLegalChunk(text) {
  return String(text)
    .normalize("NFKC") // unifies lookalike minus signs, curly quotes, full-width digits, etc.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u200B-\u200F\uFEFF]/g, "") // control + zero-width chars only
    .replace(/\s+/g, " ")
    .trim();
}