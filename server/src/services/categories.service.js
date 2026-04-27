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

/**
 * Create a new category
 * @param {object} data - { name, description, icon }
 * @returns {Promise<object>} created category
 */
export async function create(data) {
  try {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    })

    if (existing) {
      throw new Error(`Category with name "${data.name}" already exists`)
    }

    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
      },
    })
  } catch (error) {
    throw error
  }
}

/**
 * Delete a category (soft delete)
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteCategory(id) {
  try {
    return await prisma.category.update({
      where: { id },
      data: { isActive: false },
    })
  } catch (error) {
    throw new Error(`Failed to delete category: ${error.message}`)
  }
}

export default { getAll, getByName, create, deleteCategory }
