/**
 * ============================================================================
 * PRODUCTS BY ID
 * GET    /api/products/:id  — get product detail (public)
 * PUT    /api/products/:id  — update product (admin only)
 * DELETE /api/products/:id  — soft-delete product (admin only)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as productsService from "@/src/services/products.service"
import { updateProductSchema } from "@/src/validators/product.validator"

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── GET /api/products/:id ───────────────────────────────────────────────────

export async function GET(request, { params }) {
  try {
    // Try different ways to get the ID
    let id
    
    if (typeof params === 'object' && 'id' in params) {
      id = params.id
    } else if (params instanceof Promise) {
      const resolved = await params
      id = resolved.id
    }
    
    if (!id) {
      return apiResponse.error("Invalid product ID", 400)
    }

    const product = await productsService.getById(id)
    if (!product) {
      return apiResponse.notFound(`Product with ID "${id}" not found`)
    }

    return apiResponse.success(product, "Product fetched successfully")
  } catch (error) {
    console.error("GET /api/products/:id error:", error)
    return apiResponse.serverError("Failed to fetch product", error)
  }
}

// ─── PUT /api/products/:id (admin only) ─────────────────────────────────────

export async function PUT(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    if (!id) return apiResponse.error("Invalid product ID", 400)

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    if (Object.keys(parsed.data).length === 0) {
      return apiResponse.error("No update fields provided", 400)
    }

    const product = await productsService.updateProduct(id, parsed.data)
    return apiResponse.success(product, "Product updated successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("PUT /api/products/:id error:", error)
    return apiResponse.serverError("Failed to update product", error)
  }
}

// ─── DELETE /api/products/:id (admin only) ──────────────────────────────────

export async function DELETE(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    if (!id) return apiResponse.error("Invalid product ID", 400)

    await productsService.deleteProduct(id)
    return apiResponse.success(null, "Product deleted successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("DELETE /api/products/:id error:", error)
    return apiResponse.serverError("Failed to delete product", error)
  }
}
