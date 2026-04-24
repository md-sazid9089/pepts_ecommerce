/**
 * ============================================================================
 * CATEGORIES SERVICE LAYER
 * ============================================================================
 */

import prisma from "@/lib/prisma"

/**
 * Get all active categories
 * @returns {Promise<Array>} list of categories
 */
export async function getAll() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    })

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      productCount: cat._count.products,
      createdAt: cat.createdAt,
    }))
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

/**
 * Get a category by name
 * @param {string} name
 * @returns {Promise<object|null>}
 */
export async function getByName(name) {
  try {
    return await prisma.category.findFirst({
      where: { name, isActive: true },
    })
  } catch (error) {
    throw new Error(`Failed to fetch category: ${error.message}`)
  }
}

export default { getAll, getByName }
