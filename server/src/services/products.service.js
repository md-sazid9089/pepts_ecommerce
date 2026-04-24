/**
 * ============================================================================
 * PRODUCTS SERVICE LAYER
 * ============================================================================
 * Handles product database operations and business logic.
 * This layer is used by route handlers and keeps database access
 * separated from HTTP request handling.
 * ============================================================================
 */

import prisma from "@/lib/prisma"

const DEFAULT_CATEGORY_NAME = "General"

function mapProduct(product) {
  const name = product.title || "Untitled Product"
  const categoryName = product.category?.name || null

  return {
    id: product.id,
    name,
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
    category: categoryName,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    inStock: product.stock > 0,
    image: `https://via.placeholder.com/400?text=${encodeURIComponent(name)}`,
    reviews: 0,
    rating: 4.7,
    moq: 1,
    tieredPricing: [],
  }
}

export async function getAll(page = 1, pageSize = 20, filters = {}) {
  try {
    const skip = (page - 1) * pageSize

    const where = {}

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters.category) {
      where.category = {
        name: { equals: filters.category, mode: "insensitive" },
      }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return {
      items: items.map(mapProduct),
      total,
    }
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
}

export async function getById(productId) {
  try {
    if (!productId) return null

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    })

    return product ? mapProduct(product) : null
  } catch (error) {
    throw new Error(`Failed to fetch product by ID: ${error.message}`)
  }
}

export async function createProduct(data) {
  try {
    if (!data?.title || typeof data.title !== "string" || data.title.trim() === "") {
      throw new Error("Title is required")
    }

    if (!data?.description || typeof data.description !== "string" || data.description.trim() === "") {
      throw new Error("Description is required")
    }

    const price = Number(data.price)
    if (Number.isNaN(price) || price < 0) {
      throw new Error("Price must be a number greater than or equal to 0")
    }

    const stock = data.stock === undefined || data.stock === "" ? 0 : Number(data.stock)
    if (Number.isNaN(stock) || stock < 0) {
      throw new Error("Stock must be a non-negative integer")
    }

    const categoryName = (data.categoryName || data.category || DEFAULT_CATEGORY_NAME).trim() || DEFAULT_CATEGORY_NAME

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
        title: data.title.trim(),
        description: data.description.trim(),
        price,
        stock: Number.isInteger(stock) ? stock : Math.round(stock),
        categoryId: category.id,
      },
      include: { category: true },
    })

    return mapProduct(product)
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }
}

export default {
  getAll,
  getById,
  createProduct,
}