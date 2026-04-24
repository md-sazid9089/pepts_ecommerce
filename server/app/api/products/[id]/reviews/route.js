/**
 * ============================================================================
 * REVIEWS BY PRODUCT
 * GET  /api/products/:id/reviews — get approved reviews for a product
 * POST /api/products/:id/reviews — submit a new review for a product
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as reviewsService from "@/src/services/reviews.service"
import { createReviewSchema } from "@/src/validators/review.validator"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)

    const result = await reviewsService.getProductReviews(id, page, pageSize)
    return apiResponse.success(result, "Reviews fetched successfully")
  } catch (error) {
    console.error("GET /api/products/:id/reviews error:", error)
    return apiResponse.serverError("Failed to fetch reviews", error)
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    let body = await request.json()
    body.productId = id

    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const review = await reviewsService.createReview(parsed.data)
    return apiResponse.created(review, "Review submitted successfully")
  } catch (error) {
    console.error("POST /api/products/:id/reviews error:", error)
    return apiResponse.serverError("Failed to submit review", error)
  }
}
