/**
 * ============================================================================
 * AUTH — LOGIN
 * POST /api/auth/login
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"
import { loginSchema } from "@/src/validators/auth.validator"

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

    return apiResponse.success({ user, token }, "Login successful")
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
