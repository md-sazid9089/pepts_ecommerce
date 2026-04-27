/**
 * ============================================================================
 * INQUIRY MANAGEMENT
 * GET    /api/inquiries/:id — get inquiry details (admin)
 * PUT    /api/inquiries/:id — update inquiry (admin)
 * DELETE /api/inquiries/:id — delete inquiry (admin)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as inquiriesService from "@/src/services/inquiries.service"

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

export async function PUT(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    const body = await request.json()

    const updated = await inquiriesService.updateInquiry(id, body)
    return apiResponse.success(updated, "Inquiry updated successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return apiResponse.notFound(error.message)
    }
    console.error("PUT /api/inquiries/:id error:", error)
    return apiResponse.serverError("Failed to update inquiry", error)
  }
}
