/**
 * ============================================================================
 * AUTH — UPDATE PROFILE
 * PUT /api/auth/profile
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as authService from "@/src/services/auth.service"

function verifyJwt(request) {
  const authHeader = request.headers.get("authorization")
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function PUT(request) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")

    const body = await request.json()
    const updatedUser = await authService.updateProfile(user.userId, body)
    
    return apiResponse.success(updatedUser, "Profile updated successfully")
  } catch (error) {
    console.error("PUT /api/auth/profile error:", error)
    return apiResponse.serverError("Failed to update profile", error)
  }
}
