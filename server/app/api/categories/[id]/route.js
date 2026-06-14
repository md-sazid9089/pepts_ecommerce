/**
 * ============================================================================
 * CATEGORY BY ID
 * GET    /api/categories/:id — get category details (public)
 * DELETE /api/categories/:id — delete category (admin, protected categories blocked)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"
import { verifyRequest } from "@/src/lib/verifyRequest"

// The 4 categories that can never be deleted
const PROTECTED_CATEGORIES = ["Our Design", "Custom Build", "Popular", "Most Demanding"]



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
    const user = verifyRequest(request)
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

    // Check assigned products first:
    const assignedCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (assignedCount > 0) {
      return Response.json({
        success: false,
        error: `Cannot delete — ${assignedCount} product(s) are assigned to this category. Please reassign them first.`
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });

    return Response.json({ success: true });

  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error)
    return Response.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}
