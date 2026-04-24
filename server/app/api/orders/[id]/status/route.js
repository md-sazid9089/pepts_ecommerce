/**
 * ============================================================================
 * ORDER STATUS UPDATE
 * PUT /api/orders/:id/status — update order status (admin only)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
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

export async function PUT(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    const body = await request.json()
    
    if (!body.status) return apiResponse.validationError("Status is required")

    const order = await ordersService.updateOrderStatus(id, body.status)
    return apiResponse.success(order, "Order status updated successfully")
  } catch (error) {
    console.error("PUT /api/orders/:id/status error:", error)
    return apiResponse.serverError("Failed to update order status", error)
  }
}
