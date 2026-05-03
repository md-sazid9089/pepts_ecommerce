/**
 * ============================================================================
 * CATEGORY BY ID
 * GET    /api/categories/:id — get category details (public)
 * DELETE /api/categories/:id — delete category (admin, protected categories blocked)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"

// The 4 categories that can never be deleted
const PROTECTED_CATEGORIES = ["Our Design", "Custom Build", "Popular", "Most Demanding"]

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
    const category = await prisma.category.findUnique({
      where:  { id },
      select: {
        id:          true,
        name:        true,
        description: true,
        icon:        true,
        isActive:    true,
        createdAt:   true,
        _count:      { select: { products: { where: { isActive: true } } } },
      },
    })

    if (!category) return apiResponse.notFound("Category not found")

    return apiResponse.success(
      { ...category, productCount: category._count.products },
      "Category fetched successfully"
    )
  } catch (error) {
    console.error("GET /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to fetch category", error)
  }
}

export async function DELETE(request, { params }) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const user = verifyJwt(request)
    if (!user)              return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params

    // ── Resolve the category to check its name ───────────────────────────────
    const category = await prisma.category.findUnique({
      where:  { id },
      select: { id: true, name: true },
    })

    if (!category) return apiResponse.notFound("Category not found")

    // ── Block deletion of protected categories ───────────────────────────────
    if (PROTECTED_CATEGORIES.includes(category.name)) {
      return apiResponse.forbidden(
        `"${category.name}" is a protected category and cannot be deleted`
      )
    }

    // ── Safe to delete ───────────────────────────────────────────────────────
    await prisma.category.update({
      where: { id },
      data:  { isActive: false },   // soft-delete; matches the existing pattern
    })

    return apiResponse.success(null, "Category deleted successfully")
  } catch (error) {
    console.error("DELETE /api/categories/:id error:", error)
    return apiResponse.serverError("Failed to delete category", error)
  }
}
