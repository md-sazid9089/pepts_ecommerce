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
 * Get a category by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getById(id) {
  try {
    return await prisma.category.findUnique({
      where: { id, isActive: true },
    })
  } catch (error) {
    throw new Error(`Failed to fetch category by ID: ${error.message}`)
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
 * @returns {Promise<object>}
 */
export async function create(data) {
  try {
    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
      },
    })
  } catch (error) {
    throw new Error(`Failed to create category: ${error.message}`)
  }
}

/**
 * Update a category
 * @param {string} id
 * @param {object} data - Fields to update
 * @returns {Promise<object>}
 */
export async function update(id, data) {
  try {
    return await prisma.category.update({
      where: { id },
      data,
    })
  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`)
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

export default { getAll, getById, getByName, create, update, deleteCategory }
