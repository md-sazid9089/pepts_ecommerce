/**
 * ============================================================================
 * REVIEWS
 * GET  /api/reviews?productId=xxx  — list approved reviews for a product (public)
 * POST /api/reviews               — submit a new review (public, pending moderation)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as reviewsService from "@/src/services/reviews.service"
import { createReviewSchema } from "@/src/validators/review.validator"

// ─── GET /api/reviews ────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return apiResponse.validationError("Validation failed", {
        productId: "productId query parameter is required",
      })
    }

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10)))

    const result = await reviewsService.getProductReviews(productId, page, pageSize)

    return apiResponse.success(
      {
        items: result.items,
        averageRating: result.averageRating,
        totalRatings: result.totalRatings,
        pagination: {
          page,
          pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / pageSize),
          hasNextPage: page < Math.ceil(result.total / pageSize),
          hasPreviousPage: page > 1,
        },
      },
      "Reviews fetched successfully"
    )
  } catch (error) {
    console.error("GET /api/reviews error:", error)
    return apiResponse.serverError("Failed to fetch reviews", error)
  }
}

// ─── POST /api/reviews ───────────────────────────────────────────────────────

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const review = await reviewsService.createReview(parsed.data)

    return apiResponse.created(
      review,
      "Review submitted successfully. It will appear after moderation."
    )
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("POST /api/reviews error:", error)
    return apiResponse.serverError("Failed to submit review", error)
  }
}
