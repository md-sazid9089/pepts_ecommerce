/**
 * ============================================================================
 * BULK PRICING BY PRODUCT
 * GET  /api/bulk-pricing/:productId — get pricing tiers (public)
 * POST /api/bulk-pricing/:productId — upsert a pricing tier (admin only)
 * ============================================================================
 */

import { z } from "zod"
import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as productsService from "@/src/services/products.service"

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

const bulkPriceSchema = z.object({
  minQuantity: z
    .number({ required_error: "minQuantity is required" })
    .int()
    .positive("minQuantity must be > 0"),
  price: z
    .number({ required_error: "price is required" })
    .nonnegative("price must be >= 0"),
  discount: z.number().nonnegative().optional(),
})

// ─── GET /api/bulk-pricing/:productId ───────────────────────────────────────

export async function GET(request, { params }) {
  try {
    const { productId } = await params
    if (!productId) return apiResponse.error("Invalid product ID", 400)

    const tiers = await productsService.getBulkPricing(productId)
    return apiResponse.success({ productId, tiers }, "Bulk pricing fetched successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("GET /api/bulk-pricing/:productId error:", error)
    return apiResponse.serverError("Failed to fetch bulk pricing", error)
  }
}

// ─── POST /api/bulk-pricing/:productId (admin only) ─────────────────────────

export async function POST(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { productId } = await params
    if (!productId) return apiResponse.error("Invalid product ID", 400)

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = bulkPriceSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const tier = await productsService.upsertBulkPrice(productId, parsed.data)
    return apiResponse.created(tier, "Bulk pricing tier saved")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("POST /api/bulk-pricing/:productId error:", error)
    return apiResponse.serverError("Failed to save bulk pricing", error)
  }
}
