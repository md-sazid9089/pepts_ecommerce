/**
 * ============================================================================
 * CATEGORY BY ID
 * GET    /api/categories/:id — get category details
 * PUT    /api/categories/:id — update category (admin)
 * DELETE /api/categories/:id — delete category (admin)
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

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const category = await categoriesService.getById(id)
    if (!category) return apiResponse.notFound("Category not found")
    return apiResponse.success(category, "Category fetched successfully")
  } catch (error) {
    console.error("GET /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to fetch category", error)
  }
}

export async function PUT(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    const body = await request.json()
    const category = await categoriesService.update(id, body)
    return apiResponse.success(category, "Category updated successfully")
  } catch (error) {
    console.error("PUT /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to update category", error)
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    await categoriesService.deleteCategory(id)
    return apiResponse.success(null, "Category deleted successfully")
  } catch (error) {
    console.error("DELETE /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to delete category", error)
  }
}
