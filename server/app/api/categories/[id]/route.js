/**
 * ============================================================================
 * CATEGORY MANAGEMENT
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

export async function DELETE(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    
    // Check if category has products before deleting (optional safety)
    // For now, simple delete
    await categoriesService.deleteCategory(id)
    return apiResponse.success(null, "Category deleted successfully")
  } catch (error) {
    console.error("DELETE /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to delete category", error)
  }
}
