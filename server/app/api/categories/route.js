/**
 * ============================================================================
 * CATEGORIES
 * GET /api/categories — list all active categories with product counts (public)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as categoriesService from "@/src/services/categories.service"

export async function GET(request) {
  try {
    const categories = await categoriesService.getAll()
    const response = apiResponse.success(categories, "Categories fetched successfully")
    // Categories rarely change — cache for 5 minutes
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    return response
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return apiResponse.serverError("Failed to fetch categories", error)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body.name) {
      return apiResponse.error("Category name is required", 400)
    }

    const category = await categoriesService.create(body)
    return apiResponse.success(category, "Category created successfully", 201)
  } catch (error) {
    if (error.message.includes("already exists")) {
      return apiResponse.error(error.message, 400)
    }
    console.error("POST /api/categories error:", error)
    return apiResponse.serverError("Failed to create category", error)
  }
}
