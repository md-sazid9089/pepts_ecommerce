/**
 * ============================================================================
 * AUTH — REGISTER
 * POST /api/auth/register
 * ============================================================================
 * On success, sets an httpOnly cookie containing the JWT so the user is
 * immediately authenticated without the token ever touching JavaScript.
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"
import { registerSchema } from "@/src/validators/auth.validator"

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
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => {
        errors[e.path.join(".")] = e.message
      })
      return apiResponse.validationError("Validation failed", errors)
    }

    const { user, token } = await authService.register(parsed.data)

    // Return user data in body — token lives in httpOnly cookie only
    const res = apiResponse.created({ user }, "Account created successfully")
    res.headers.set('Set-Cookie', buildAuthCookie(token))
    return res
  } catch (error) {
    if (error.code === "DUPLICATE_EMAIL") {
      return apiResponse.error(error.message, 409)
    }
    console.error("POST /api/auth/register error:", error)
    return apiResponse.serverError("Failed to create account", error)
  }
}
