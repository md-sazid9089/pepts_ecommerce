/**
 * ============================================================================
 * PRODUCTS SERVICE LAYER
 * ============================================================================
 * Handles product database operations and business logic.
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
    images: product.images?.map((img) => img.url) || [],
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
 * @param {{ search?: string, category?: string, categoryId?: string, sortBy?: string, sortOrder?: string }} filters
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAll(page = 1, pageSize = 20, filters = {}) {
  try {
    const skip = (page - 1) * pageSize

    const where = { isActive: true }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    if (filters.category) {
      where.category = { name: { equals: filters.category } }
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    const sortField = filters.sortBy ?? "createdAt"
    const sortDir = filters.sortOrder ?? "desc"
    const orderBy = { [sortField]: sortDir }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: { category: true, images: true },
      }),
      prisma.product.count({ where }),
    ])

    return {
      items: items.map((p) => mapProduct(p)),
      total,
    }
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
        images: true,
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
 * Create a new product.
 * @param {object} data - validated product data
 * @returns {Promise<object>} created product
 */
export async function createProduct(data) {
  try {
    let categoryId = data.categoryId

    // If no categoryId, use categoryName to find or create
    if (!categoryId) {
      const categoryName = (data.categoryName || DEFAULT_CATEGORY_NAME).trim()
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          description: `Products in the ${categoryName} category`,
        },
      })
      categoryId = category.id
    }

    const product = await prisma.product.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price,
        stock: Math.round(data.stock ?? 0),
        categoryId: categoryId,
        ...(data.images && {
          images: {
            create: data.images.map((url) => ({ url })),
          },
        }),
      },
      include: { category: true, images: true },
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
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    })
    if (!existing) {
      const err = new Error("Product not found")
      err.code = "NOT_FOUND"
      throw err
    }

    let categoryId = data.categoryId || existing.categoryId
    if (!data.categoryId && data.categoryName) {
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

    if (data.images) {
      await prisma.image.deleteMany({ where: { productId } })
      await prisma.image.createMany({
        data: data.images.map((url) => ({ url, productId })),
      })
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: Math.round(data.stock) }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        categoryId,
      },
      include: { category: true, images: true },
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
      include: { category: true, images: true },
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