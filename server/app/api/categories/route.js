/**
 * ============================================================================
 * CATEGORIES — PUBLIC READ / ADMIN WRITE
 * GET  /api/categories — returns the 4 protected categories (whitelist)
 * POST /api/categories — upsert by name (idempotent, used for seeding)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"
import { verifyRequest } from "@/src/lib/verifyRequest"

// ── The only 4 categories that exist in this platform (case-sensitive) ──────
const PROTECTED_CATEGORIES = ["Our Design", "Custom Build", "Popular", "Most Demanding"]

export async function GET() {
  try {
    // Fetch only the 4 whitelisted categories, preserving defined order
    const rows = await prisma.category.findMany({
      where:  { name: { in: PROTECTED_CATEGORIES }, isActive: true },
      select: {
        id:   true,
        name: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    })

    // Sort into the canonical display order regardless of DB insertion order
    const ordered = PROTECTED_CATEGORIES
      .map((name) => rows.find((r) => r.name === name))
      .filter(Boolean)                     // drop any that aren't in DB yet
      .map((r) => ({
        id:           r.id,
        name:         r.name,
        productCount: r._count.products,
      }))

    const response = apiResponse.success(ordered, "Categories fetched successfully")
    // 5-minute public cache — categories rarely change
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    return response
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return apiResponse.serverError("Failed to fetch categories", error)
  }
}

export async function POST(request) {
  try {
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const body = await request.json().catch(() => null)
    if (!body?.name?.trim()) {
      return apiResponse.error("Category name is required", 400)
    }

    const name = body.name.trim()

    const category = await prisma.category.upsert({
      where:  { name },
      update: {
        isActive: true,
        ...(body.description !== undefined && { description: body.description }),
        ...(body.icon       !== undefined && { icon:        body.icon        }),
      },
      create: {
        name,
        description: body.description ?? null,
        icon:        body.icon        ?? null,
        isActive:    true,
      },
    })

    return apiResponse.created(
      { id: category.id, name: category.name },
      "Category upserted successfully"
    )
  } catch (error) {
    console.error("POST /api/categories error:", error)
    return apiResponse.serverError("Failed to upsert category", error)
  }
}
