import prisma from "@/lib/prisma"

/**
 * Get all users with pagination.
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAll(page = 1, pageSize = 20) {
  try {
    const skip = (page - 1) * pageSize
    const take = pageSize

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ])

    return { items, total }
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}

export default {
  getAll,
}
