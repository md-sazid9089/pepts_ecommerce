/**
 * ============================================================================
 * CATEGORIES
 * GET  /api/categories — list all active categories with product counts (public)
 * POST /api/categories — create a new category (admin)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as categoriesService from "@/src/services/categories.service"

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
    const categories = await categoriesService.getAll()
    return apiResponse.success(categories, "Categories fetched successfully")
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return apiResponse.serverError("Failed to fetch categories", error)
  }
}

export async function POST(request) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const body = await request.json()
    if (!body.name) return apiResponse.validationError("Name is required")

    const category = await categoriesService.create(body)
    return apiResponse.created(category, "Category created successfully")
  } catch (error) {
    console.error("POST /api/categories error:", error)
    return apiResponse.serverError("Failed to create category", error)
  }
}
