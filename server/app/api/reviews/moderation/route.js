/**
 * ============================================================================
 * REVIEWS MODERATION COLLECTION — Admin
 * GET /api/reviews/moderation — get review queue (admin)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as reviewsService from "@/src/services/reviews.service"
import { verifyRequest } from "@/src/lib/verifyRequest"



export async function GET(request) {
  try {
    const user = verifyRequest(request)
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
