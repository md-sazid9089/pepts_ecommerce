/**
 * ============================================================================
 * ORDERS
 * GET  /api/orders  — list orders (authenticated user sees their own; admin sees all)
 * POST /api/orders  — create order (authenticated)
 * ============================================================================
 */

import { z } from "zod"
import apiResponse from "@/src/utils/apiResponse"
import * as ordersService from "@/src/services/orders.service"
import { verifyRequest } from "@/src/lib/verifyRequest"
import stripe from "@/src/lib/stripe"
import prisma from "@/src/lib/prisma"


const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "productId is required"),
        quantity: z.number().int().positive("quantity must be > 0"),
      })
    )
    .min(1, "Order must have at least one item"),
  paymentIntentId: z.string().optional(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
})

// ─── GET /api/orders ─────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10)))
    const status = searchParams.get("status") ?? undefined

    let result
    if (user.role === "admin") {
      result = await ordersService.getAllOrders(page, pageSize, status)
    } else {
      result = await ordersService.getUserOrders(user.userId, page, pageSize)
    }

    return apiResponse.paginated(result.items, result.total, page, pageSize, "Orders fetched successfully")
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return apiResponse.serverError("Failed to fetch orders", error)
  }
}

// ─── POST /api/orders ────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const { items, paymentIntentId, ...metadata } = parsed.data

    // ─── Verify payment if paymentIntentId provided ──────────────────────────
    if (paymentIntentId) {
      try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        if (intent.status !== 'succeeded') {
          return apiResponse.error(
            `Payment not completed. Status: ${intent.status}`,
            400
          )
        }

        // Check for duplicate order (idempotency)
        const existing = await prisma.order.findUnique({
          where: { paymentIntentId },
          include: { items: true }
        })
        if (existing) {
          return apiResponse.success(existing, "Order already exists")
        }
      } catch (err) {
        console.error("Stripe verification error:", err)
        return apiResponse.error("Failed to verify payment", 400)
      }
    }

    const order = await ordersService.createOrder(user.userId, items, {
      ...metadata,
      paymentIntentId,
    })
    return apiResponse.created(order, "Order placed successfully")
  } catch (error) {
    if (error.code === "STOCK_VALIDATION_FAILED") {
      return apiResponse.error(error.message, 409, { details: error.details })
    }
    console.error("POST /api/orders error:", error)
    return apiResponse.serverError("Failed to place order", error)
  }
}
