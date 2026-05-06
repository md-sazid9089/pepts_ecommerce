/**
 * ============================================================================
 * PRODUCTS COLLECTION — PUBLIC GET / ADMIN POST
 * GET  /api/products   — list products (public)
 * POST /api/products   — create product (admin only, requires JWT with role=admin)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as productsService from "@/src/services/products.service"
import { createProductSchema, productQuerySchema } from "@/src/validators/product.validator"
import { verifyRequest } from "@/src/lib/verifyRequest"



// ─── GET /api/products ───────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const raw = {
      page: searchParams.get("page") ?? "1",
      pageSize: searchParams.get("pageSize") ?? "10",
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    }

    const parsed = productQuerySchema.safeParse(raw)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Invalid query parameters", errors)
    }

    const { page, pageSize, search, category, sortBy, sortOrder } = parsed.data

    // Detect admin — admins see ALL products (including drafts/inactive)
    const user = verifyRequest(request)
    const adminMode = user?.role === "admin"

    const { items, total } = await productsService.getAll(page, pageSize, {
      search,
      category,
      sortBy,
      sortOrder,
      adminMode,
    })

    const response = apiResponse.paginated(items, total, page, pageSize, "Products fetched successfully")

    // React Query handles all client-side caching.
    // The API always returns fresh data — no browser/CDN caching.
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

    return response
  } catch (error) {
    console.error("GET /api/products error:", error)
    return apiResponse.serverError("Failed to fetch products", error)
  }
}


// ─── POST /api/products (admin only) ────────────────────────────────────────

export async function POST(request) {
  try {
    // Auth check — must be admin
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const product = await productsService.createProduct(parsed.data)
    return apiResponse.created(product, "Product created successfully")
  } catch (error) {
    console.error("POST /api/products error:", error)
    return apiResponse.serverError("Failed to create product", error)
  }
}