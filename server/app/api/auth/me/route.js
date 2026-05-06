/**
 * ============================================================================
 * AUTH — CURRENT USER PROFILE
 * GET /api/auth/me  (Protected — requires authToken cookie or Bearer header)
 * ============================================================================
 * Reads the JWT from the httpOnly cookie (preferred) or Authorization header
 * (fallback for API tools). Uses the shared verifyRequest helper.
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"
import { verifyRequest } from "@/src/lib/verifyRequest"

export async function GET(request) {
  try {
    const decoded = verifyRequest(request)

    if (!decoded) {
      return apiResponse.unauthorized("Invalid or missing authentication token")
    }

    // Fetch fresh user data from DB
    const user = await authService.getUserById(decoded.userId)
    if (!user) {
      return apiResponse.notFound("User not found")
    }

    return apiResponse.success(user, "Profile fetched successfully")
  } catch (error) {
    console.error("GET /api/auth/me error:", error)
    return apiResponse.serverError("Failed to fetch profile", error)
  }
}
