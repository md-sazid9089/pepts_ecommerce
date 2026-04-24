/**
 * ============================================================================
 * AUTH — REGISTER
 * POST /api/auth/register
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"
import { registerSchema } from "@/src/validators/auth.validator"

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

    return apiResponse.created(
      { user, token },
      "Account created successfully"
    )
  } catch (error) {
    if (error.code === "DUPLICATE_EMAIL") {
      return apiResponse.error(error.message, 409)
    }
    console.error("POST /api/auth/register error:", error)
    return apiResponse.serverError("Failed to create account", error)
  }
}
