/**
 * ============================================================================
 * REVIEWS MODERATION — Admin
 * GET   /api/reviews/moderation  — get review queue (admin)
 * PATCH /api/reviews/moderation/:id  — approve/reject review (admin)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import { z } from "zod"
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

export async function GET(request) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") ?? "pending"
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)))

    const { items, total } = await reviewsService.getAllReviews(status, page, pageSize)
    return apiResponse.paginated(items, total, page, pageSize, "Reviews fetched successfully")
  } catch (error) {
    console.error("GET /api/reviews/moderation error:", error)
    return apiResponse.serverError("Failed to fetch reviews", error)
  }
}

const moderateSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    required_error: "status is required",
  }),
})

export async function PATCH(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    if (!id) return apiResponse.error("Invalid review ID", 400)

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = moderateSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const review = await reviewsService.moderateReview(id, parsed.data.status)
    return apiResponse.success(review, `Review ${parsed.data.status} successfully`)
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("PATCH /api/reviews/moderation/:id error:", error)
    return apiResponse.serverError("Failed to moderate review", error)
  }
}
