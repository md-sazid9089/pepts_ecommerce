/**
 * ============================================================================
 * REVIEW MODERATION & MANAGEMENT
 * PUT    /api/reviews/:id — approve/reject review (admin)
 * DELETE /api/reviews/:id — delete review (admin)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as reviewsService from "@/src/services/reviews.service"

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
    
    if (!body.status) return apiResponse.validationError("Status is required")

    const review = await reviewsService.moderateReview(id, body.status)
    return apiResponse.success(review, `Review ${body.status} successfully`)
  } catch (error) {
    console.error("PUT /api/reviews/:id error:", error)
    return apiResponse.serverError("Failed to moderate review", error)
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    await reviewsService.deleteReview(id)
    return apiResponse.success(null, "Review deleted successfully")
  } catch (error) {
    console.error("DELETE /api/reviews/:id error:", error)
    return apiResponse.serverError("Failed to delete review", error)
  }
}
