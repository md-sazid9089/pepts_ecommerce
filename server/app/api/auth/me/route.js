/**
 * ============================================================================
 * AUTH — CURRENT USER PROFILE
 * GET /api/auth/me  (Protected — requires Authorization: Bearer <token>)
 * ============================================================================
 * This route is under /api/protected/... conceptually but the client
 * calls /api/auth/me, so we manually verify the JWT here.
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"

export async function GET(request) {
  try {
    // Extract Bearer token
    const authHeader = request.headers.get("authorization")
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null

    if (!token) {
      return apiResponse.unauthorized("Missing Authorization header")
    }

    // Verify JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return apiResponse.unauthorized("Invalid or expired token")
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
