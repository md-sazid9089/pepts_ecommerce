/**
 * ============================================================================
 * SHARED JWT VERIFICATION HELPER
 * ============================================================================
 * Replaces the duplicated local verifyJwt() functions that existed in every
 * route handler. Token source priority:
 *
 *   1. httpOnly cookie  "authToken"  (preferred — not accessible to JS)
 *   2. Authorization: Bearer <token> header (fallback for API tools / Postman)
 *
 * Uses jsonwebtoken for full HMAC-SHA256 signature verification.
 * Returns the decoded payload on success, null on any failure.
 * ============================================================================
 */

import jwt from 'jsonwebtoken'

/**
 * Extract and verify the JWT from a Next.js App Router request.
 *
 * @param {Request} request - The incoming Next.js request object
 * @returns {object|null}   - Decoded JWT payload, or null if invalid/missing
 */
export function verifyRequest(request) {
  // 1. httpOnly cookie (set by login/register routes — XSS-safe)
  const cookieToken = request.cookies?.get?.('authToken')?.value

  // 2. Authorization header fallback (API tools, server-to-server)
  const authHeader = request.headers.get('authorization')
  const headerToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null

  const token = cookieToken || headerToken
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    // Covers: expired, invalid signature, malformed
    return null
  }
}
