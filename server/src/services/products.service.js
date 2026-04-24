/**
 * ============================================================================
 * PRODUCTS SERVICE LAYER
 * ============================================================================
 * Handles product database operations and business logic.
 *
 * FIXES APPLIED:
 * ✅ Removed mode:"insensitive" — SQLite does not support it
 * ✅ Added isActive:true filter on all queries — respects soft-deletes
 * ✅ Added updateProduct and deleteProduct (soft delete)
 * ✅ Includes bulkPrices and real reviews aggregation in getById
 * ✅ Removed hardcoded placeholder image and fake rating
 * ✅ Added sortBy / sortOrder support
 * ============================================================================
 */

import prisma from "@/lib/prisma"

const DEFAULT_CATEGORY_NAME = "General"

/**
 * Map a raw Prisma product record to the API response shape.
 * @param {object} product
 * @param {boolean} [full] - include reviews/bulkPrices
 */
function mapProduct(product, full = false) {
  const base = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    inStock: product.stock > 0,
    categoryId: product.categoryId,
    category: product.category?.name ?? null,
    imageUrl: product.imageUrl ?? null,
    images: product.images ? JSON.parse(product.images) : [],
    specs: product.specs ? JSON.parse(product.specs) : null,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }

  if (full) {
    // Average rating from real approved reviews
    const approvedReviews = product.reviews?.filter((r) => r.status === "approved") ?? []
    const avgRating =
      approvedReviews.length > 0
        ? Math.round((approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length) * 10) / 10
        : null

    return {
      ...base,
      bulkPrices: product.bulkPrices ?? [],
      reviewCount: approvedReviews.length,
      rating: avgRating,
    }
  }

  return base
}

/**
 * Get all active products with pagination, search, and sort.
 * @param {number} page
 * @param {number} pageSize
 * @param {{ search?: string, category?: string, sortBy?: string, sortOrder?: string }} filters
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAll(page = 1, pageSize = 20, filters = {}) {
  try {
    const skip = (page - 1) * pageSize

    const where = { isActive: true }

    // MySQL case-insensitive search using contains (Prisma uses LIKE under the hood;
    // collation on the column handles case — no mode needed for MySQL unlike SQLite)
    if (filters.search) {
      const term = filters.search.trim()
      where.OR = [
        { title:       { contains: term } },
        { description: { contains: term } },
      ]
    }

    if (filters.category) {
      where.category = { name: { equals: filters.category } }
    }

    // Sort configuration
    const sortField = filters.sortBy ?? "createdAt"
    const sortDir   = filters.sortOrder ?? "desc"
    const orderBy   = { [sortField]: sortDir }

    // Select only the fields needed for listing — avoids fetching heavy TEXT columns
    // (specs, images) on every list page load
    const select = {
      id:          true,
      title:       true,
      price:       true,
      stock:       true,
      imageUrl:    true,
      isActive:    true,
      createdAt:   true,
      updatedAt:   true,
      categoryId:  true,
      category:    { select: { id: true, name: true } },
      // description & specs are omitted from list — fetched in getById
    }

    const [rawItems, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: pageSize, orderBy, select }),
      prisma.product.count({ where }),
    ])

    // Map to response shape (specs/images are null in list view — that's fine)
    const items = rawItems.map((p) => ({
      id:         p.id,
      title:      p.title,
      price:      p.price,
      stock:      p.stock,
      inStock:    p.stock > 0,
      imageUrl:   p.imageUrl ?? null,
      categoryId: p.categoryId,
      category:   p.category?.name ?? null,
      isActive:   p.isActive,
      createdAt:  p.createdAt,
      updatedAt:  p.updatedAt,
    }))

    return { items, total }
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
}

/**
 * Get a single product by ID with full detail (bulk pricing + reviews).
 * @param {string} productId
 * @returns {Promise<object|null>}
 */
export async function getById(productId) {
  try {
    if (!productId) return null

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: {
        category: true,
        bulkPrices: { orderBy: { minQuantity: "asc" } },
        reviews: {
          where: { status: "approved" },
          select: { id: true, rating: true, title: true, comment: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    })

    return product ? mapProduct(product, true) : null
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
}

/**
 * Create a new product. Upserts the category if needed.
 * @param {object} data - validated product data
 * @returns {Promise<object>} created product
 */
export async function createProduct(data) {
  try {
    const categoryName = (data.categoryName || DEFAULT_CATEGORY_NAME).trim()

    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        description: `Products in the ${categoryName} category`,
      },
    })

    const product = await prisma.product.create({
      data: {
        title:       data.title.trim(),
        description: data.description.trim(),
        price:       data.price,
        stock:       Math.round(data.stock ?? 0),
        categoryId:  category.id,
        specs:       data.specs ? JSON.stringify(data.specs) : null,
      },
      include: { category: true },
    })

    return mapProduct(product)
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }
}

/**
 * Update an existing product.
 * @param {string} productId
 * @param {object} data - validated update fields
 * @returns {Promise<object>} updated product
 */
export async function updateProduct(productId, data) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } })
    if (!existing) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    // Handle category change
    let categoryId = existing.categoryId
    if (data.categoryName) {
      const cat = await prisma.category.upsert({
        where: { name: data.categoryName.trim() },
        update: {},
        create: {
          name: data.categoryName.trim(),
          description: `Products in the ${data.categoryName.trim()} category`,
        },
      })
      categoryId = cat.id
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.title       !== undefined && { title:       data.title.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.price       !== undefined && { price:       data.price }),
        ...(data.stock       !== undefined && { stock:       Math.round(data.stock) }),
        ...(data.isActive    !== undefined && { isActive:    data.isActive }),
        ...(data.specs       !== undefined && { specs:       JSON.stringify(data.specs) }),
        categoryId,
      },
      include: { category: true },
    })

    return mapProduct(updated)
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to update product: ${error.message}`)
  }
}

/**
 * Soft-delete a product by setting isActive = false.
 * @param {string} productId
 * @returns {Promise<object>} updated product
 */
export async function deleteProduct(productId) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } })
    if (!existing) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
      include: { category: true },
    })
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

/**
 * Get bulk pricing tiers for a product.
 * @param {string} productId
 * @returns {Promise<Array>}
 */
export async function getBulkPricing(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: { bulkPrices: { orderBy: { minQuantity: "asc" } } },
    })

    if (!product) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return product.bulkPrices
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to fetch bulk pricing: ${error.message}`)
  }
}

/**
 * Upsert a bulk pricing tier for a product (admin).
 * @param {string} productId
 * @param {{ minQuantity: number, price: number, discount?: number }} data
 * @returns {Promise<object>}
 */
export async function upsertBulkPrice(productId, data) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return await prisma.bulkPrice.upsert({
      where: { productId_minQuantity: { productId, minQuantity: data.minQuantity } },
      update: { price: data.price, discount: data.discount ?? null },
      create: {
        productId,
        minQuantity: data.minQuantity,
        price: data.price,
        discount: data.discount ?? null,
      },
    })
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to upsert bulk price: ${error.message}`)
  }
}

export default {
  getAll,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBulkPricing,
  upsertBulkPrice,
}