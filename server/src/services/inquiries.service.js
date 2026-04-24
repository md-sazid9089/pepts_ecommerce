/**
 * ============================================================================
 * INQUIRIES SERVICE LAYER
 * ============================================================================
 * Handles B2B wholesale inquiry submission and admin management.
 * ============================================================================
 */

import prisma from "@/lib/prisma"

/**
 * Create a new B2B inquiry
 * @param {object} data - Inquiry data
 * @param {string|null} userId - Optional user ID if logged in
 * @returns {Promise<object>} created inquiry
 */
export async function createInquiry(data, userId = null) {
  try {
    return await prisma.inquiry.create({
      data: {
        userId: userId || null,
        companyName: data.companyName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        productName: data.productName,
        productId: data.productId || null,
        requestedQuantity: data.requestedQuantity,
        message: data.message || null,
        status: "new",
      },
    })
  } catch (error) {
    throw new Error(`Failed to create inquiry: ${error.message}`)
  }
}

/**
 * Get all inquiries (admin)
 * @param {number} page
 * @param {number} pageSize
 * @param {string} [status] - filter by status
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAllInquiries(page = 1, pageSize = 20, status) {
  try {
    const skip = (page - 1) * pageSize
    const where = status ? { status } : {}

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
      }),
      prisma.inquiry.count({ where }),
    ])

    return { items, total }
  } catch (error) {
    throw new Error(`Failed to fetch inquiries: ${error.message}`)
  }
}

/**
 * Update inquiry status and notes (admin)
 * @param {string} inquiryId
 * @param {{ status?: string, notes?: string, assignedTo?: string }} updates
 * @returns {Promise<object>}
 */
export async function updateInquiry(inquiryId, updates) {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } })
    if (!inquiry) {
      const err = new Error("Inquiry not found")
      err.code = "NOT_FOUND"
      throw err
    }

    return await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        ...(updates.status && { status: updates.status }),
        ...(updates.notes !== undefined && { notes: updates.notes }),
        ...(updates.assignedTo !== undefined && { assignedTo: updates.assignedTo }),
      },
    })
  } catch (error) {
    if (error.code === "NOT_FOUND") throw error
    throw new Error(`Failed to update inquiry: ${error.message}`)
  }
}

export default { createInquiry, getAllInquiries, updateInquiry }
