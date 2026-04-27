/**
 * ============================================================================
 * ORDERS SERVICE LAYER
 * ============================================================================
 * Handles order creation and retrieval with stock validation.
 * ============================================================================
 */

import prisma from "@/lib/prisma"

/**
 * Generate a unique order number: ORD-YYYYMMDD-XXXXXXXX
 * @returns {string}
 */
function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `ORD-${date}-${random}`
}

/**
 * Create a new order with stock validation (transactional)
 * @param {string} userId
 * @param {Array<{ productId: string, quantity: number }>} items
 * @param {object} metadata - { shippingAddress, contactName, companyName, contactEmail, contactPhone, notes }
 * @returns {Promise<object>} created order
 */
export async function createOrder(userId, items, metadata = {}) {
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item")
  }

  // Fetch all products in one query
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  })

  // Validate all products exist and have enough stock
  const productMap = new Map(products.map((p) => [p.id, p]))
  const validationErrors = []

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) {
      validationErrors.push(`Product "${item.productId}" not found or unavailable`)
    } else if (product.stock < item.quantity) {
      validationErrors.push(
        `Insufficient stock for "${product.title}": requested ${item.quantity}, available ${product.stock}`
      )
    }
  }

  if (validationErrors.length > 0) {
    const err = new Error(validationErrors.join("; "))
    err.code = "STOCK_VALIDATION_FAILED"
    err.details = validationErrors
    throw err
  }

  // Calculate total
  const totalAmount = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)
    return sum + product.price * item.quantity
  }, 0)

  // Create order + decrement stock in a single transaction
  const order = await prisma.$transaction(async (tx) => {
    // Decrement stock for each item
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        totalAmount: Math.round(totalAmount * 100) / 100,
        status: "pending",
        
        // Metadata fields
        companyName:   metadata.companyName   || null,
        contactName:   metadata.contactName   || null,
        contactEmail:  metadata.contactEmail  || null,
        contactPhone:  metadata.contactPhone  || null,
        shippingAddress: metadata.shippingAddress || null,
        notes:         metadata.notes         || null,

        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: productMap.get(item.productId).price,
          })),
        },
      },
      include: {
        items: {
          include: { product: { select: { id: true, title: true, price: true } } },
        },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    })
  }, {
    timeout: 15000, // Increase timeout for remote DB latency
  })

  return order
}

/**
 * Get orders for a specific user (paginated)
 * @param {string} userId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getUserOrders(userId, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { select: { id: true, title: true, price: true } } },
        },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ])

  return { items, total }
}

/**
 * Get all orders (admin)
 * @param {number} page
 * @param {number} pageSize
 * @param {string} [status] - filter by status
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getAllOrders(page = 1, pageSize = 20, status) {
  const skip = (page - 1) * pageSize
  const where = status ? { status } : {}

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { select: { id: true, title: true } } },
        },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { items, total }
}

/**
 * Update order status (admin)
 * @param {string} orderId
 * @param {string} status
 * @returns {Promise<object>}
 */
export async function updateOrderStatus(orderId, status) {
  const validStatuses = ["pending", "processing", "shipped", "completed", "cancelled"]
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) {
    const err = new Error("Order not found")
    err.code = "NOT_FOUND"
    throw err
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: { include: { product: { select: { id: true, title: true } } } },
      user: { select: { id: true, email: true } },
    },
  })
}

export default { createOrder, getUserOrders, getAllOrders, updateOrderStatus }
