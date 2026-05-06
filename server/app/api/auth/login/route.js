/**
 * ============================================================================
 * AUTH — LOGIN
 * POST /api/auth/login
 * ============================================================================
 * On success, sets an httpOnly cookie containing the JWT instead of returning
 * the token in the response body. The cookie is inaccessible to JavaScript,
 * eliminating the XSS token-theft attack vector.
 *
 * Cookie attributes:
 *   HttpOnly  — JS cannot read it
 *   Secure    — HTTPS only (production only; omitted in dev)
 *   SameSite=Strict — not sent in cross-site requests
 *   Max-Age=86400   — 24 hours (matches JWT_EXPIRY)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"
import { loginSchema } from "@/src/validators/auth.validator"

/** Build the Set-Cookie header value for the auth token */
function buildAuthCookie(token) {
  const isProd = process.env.NODE_ENV === 'production'
  const parts = [
    `authToken=${token}`,
    'HttpOnly',
    ...(isProd ? ['Secure'] : []),
    'SameSite=Strict',
    'Path=/',
    'Max-Age=86400',
  ]
  return parts.join('; ')
}

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    // Zod validation
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => {
        errors[e.path.join(".")] = e.message
      })
      return apiResponse.validationError("Validation failed", errors)
    }

    const { user, token } = await authService.login(parsed.data)

    // Return user data in body — token lives in httpOnly cookie only
    const res = apiResponse.success({ user }, "Login successful")
    res.headers.set('Set-Cookie', buildAuthCookie(token))
    return res
  } catch (error) {
    if (error.code === "INVALID_CREDENTIALS") {
      return apiResponse.unauthorized(error.message)
    }
    if (error.code === "ACCOUNT_INACTIVE") {
      return apiResponse.forbidden(error.message)
    }
    console.error("POST /api/auth/login error:", error)
    return apiResponse.serverError("Failed to login", error)
  }
}
