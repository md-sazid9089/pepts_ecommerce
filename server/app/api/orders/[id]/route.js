/**
 * ============================================================================
 * ORDERS BY ID — Status Update
 * PATCH /api/orders/:id — update order status (admin only)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import { z } from "zod"
import apiResponse from "@/src/utils/apiResponse"
import * as ordersService from "@/src/services/orders.service"

function verifyJwt(request) {
  const authHeader = request.headers.get("authorization")
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

const updateStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "completed", "cancelled"], {
    required_error: "status is required",
    invalid_type_error: "Invalid status value",
  }),
})

export async function PATCH(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    if (!id) return apiResponse.error("Invalid order ID", 400)

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = updateStatusSchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const order = await ordersService.updateOrderStatus(id, parsed.data.status)
    return apiResponse.success(order, "Order status updated successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("PATCH /api/orders/:id error:", error)
    return apiResponse.serverError("Failed to update order", error)
  }
}
