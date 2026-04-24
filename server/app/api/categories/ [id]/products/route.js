/**
 * ============================================================================
 * PRODUCTS BY CATEGORY
 * GET /api/categories/:id/products — list products in a category
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as productsService from "@/src/services/products.service"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)

    const { items, total } = await productsService.getAll(page, pageSize, {
      categoryId: id,
    })

    return apiResponse.paginated(items, total, page, pageSize, "Products fetched successfully")
  } catch (error) {
    console.error("GET /api/categories/:id/products error:", error)
    return apiResponse.serverError("Failed to fetch products", error)
  }
}
