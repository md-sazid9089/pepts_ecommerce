/**
 * ============================================================================
 * AUTH — LOGOUT
 * POST /api/auth/logout
 * ============================================================================
 * Clears the httpOnly authToken cookie, effectively invalidating the session.
 * This endpoint does NOT require authentication — if the cookie is already
 * gone, clearing it again is a no-op and always returns 200.
 * ============================================================================
 */

import apiResponse from '@/src/utils/apiResponse'

export async function POST() {
  const res = apiResponse.success(null, 'Logged out successfully')

  // Clear the cookie by setting Max-Age=0
  // The Secure flag is omitted here so logout works over HTTP in dev too.
  res.headers.set(
    'Set-Cookie',
    'authToken=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
  )

  return res
}
