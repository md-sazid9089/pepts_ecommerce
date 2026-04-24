/**
 * ============================================================================
 * REVIEWS SERVICE LAYER
 * ============================================================================
 * Handles product review submission and retrieval (with moderation).
 * ============================================================================
 */

import prisma from "@/lib/prisma"

/**
 * Submit a product review (starts as "pending" for moderation)
 * @param {object} data - Review data
 * @returns {Promise<object>} created review
 */
export async function createReview(data) {
  try {
    // Verify the product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: data.productId, isActive: true },
      select: { id: true, title: true },
    })

    if (!product) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return await prisma.review.create({
      data: {
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        email: data.email || null,
        status: "pending",
      },
    })
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to create review: ${error.message}`)
  }
}

/**
 * Get approved reviews for a product
 * @param {string} productId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: Array, total: number, averageRating: number }>}
 */
export async function getProductReviews(productId, page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize

    const [items, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: "approved" },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
        },
      }),
      prisma.review.count({ where: { productId, status: "approved" } }),
      prisma.review.aggregate({
        where: { productId, status: "approved" },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ])

    return {
      items,
      total,
      averageRating: aggregate._avg.rating
        ? Math.round(aggregate._avg.rating * 10) / 10
        : null,
      totalRatings: aggregate._count.rating,
    }
  } catch (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`)
  }
}

/**
 * Get all reviews with pending status (admin moderation queue)
 * @param {string} [status] - "pending" | "approved" | "rejected"
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAllReviews(status = "pending", page = 1, pageSize = 20) {
  try {
    const skip = (page - 1) * pageSize

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { status },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { id: true, title: true } },
        },
      }),
      prisma.review.count({ where: { status } }),
    ])

    return { items, total }
  } catch (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`)
  }
}

/**
 * Moderate a review (admin)
 * @param {string} reviewId
 * @param {"approved" | "rejected"} status
 * @returns {Promise<object>}
 */
export async function moderateReview(reviewId, status) {
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) {
      const err = new Error("Review not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    })
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to moderate review: ${error.message}`)
  }
}

/**
 * Delete a review (admin)
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteReview(id) {
  try {
    return await prisma.review.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error(`Failed to delete review: ${error.message}`)
  }
}

export default {
  createReview,
  getProductReviews,
  getAllReviews,
  moderateReview,
  deleteReview,
}
