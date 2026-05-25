/**
 * ============================================================================
 * GET /api/products/featured
 * Returns up to 8 active products from the "Most Demanding" category.
 * Static segment — resolved by Next.js App Router BEFORE /api/products/[id]
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { name: "Most Demanding" },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id:          true,
        title:       true,
        price:       true,
        stock:       true,
        brand:       true,
        moq:         true,
        imageUrl:    true,
        createdAt:   true,
        category:    { select: { name: true } },
        images:      { orderBy: { order: "asc" }, take: 1 },
        bulkPrices:  {
          select: { minQuantity: true, maxQuantity: true, price: true, unit: true },
          orderBy: { minQuantity: "asc" },
        },
        reviews: {
          where:  { status: "approved" },
          select: { rating: true },
        },
      },
    })

    // Shape the data to match the standard product shape ProductCard expects
    const data = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Math.round(
              (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length) * 10
            ) / 10
          : 4.5

      return {
        id:           p.id,
        title:        p.title,
        price:        p.price,
        stock:        p.stock,
        inStock:      p.stock > 0,
        brand:        p.brand,
        moq:          p.moq,
        // ProductCard reads imageUrl for the primary image
        imageUrl:     p.imageUrl ?? (p.images[0]?.url ?? null),
        images:       p.images,
        category:     p.category?.name ?? null,
        bulkPrices:   p.bulkPrices,
        rating:       avgRating,
        reviewCount:  p.reviews.length,
        createdAt:    p.createdAt,
      }
    })

    const response = apiResponse.success(data, "Featured products fetched successfully")
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    )
    return response
  } catch (error) {
    console.error("GET /api/products/featured error:", error)
    return apiResponse.serverError("Failed to fetch featured products", error)
  }
}
