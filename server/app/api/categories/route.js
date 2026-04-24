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
    return apiResponse.success(categories, "Categories fetched successfully")
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return apiResponse.serverError("Failed to fetch categories", error)
  }
}
