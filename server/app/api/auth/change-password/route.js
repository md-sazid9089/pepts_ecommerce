/**
 * ============================================================================
 * AUTH — CHANGE PASSWORD
 * PUT /api/auth/change-password
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
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return apiResponse.validationError("Current and new passwords are required")
    }

    await authService.changePassword(user.userId, currentPassword, newPassword)
    
    return apiResponse.success(null, "Password changed successfully")
  } catch (error) {
    if (error.code === "INVALID_PASSWORD") {
      return apiResponse.error(error.message, 400)
    }
    console.error("PUT /api/auth/change-password error:", error)
    return apiResponse.serverError("Failed to change password", error)
  }
}
