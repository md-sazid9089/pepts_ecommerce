/**
 * ============================================================================
 * ORDER CANCELLATION
 * POST /api/orders/:id/cancel — cancel an order
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

export async function POST(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")

    const { id } = await params
    
    // Optional: check if the order belongs to the user or if they are admin
    const order = await ordersService.getOrderById(id)
    if (!order) return apiResponse.notFound("Order not found")
    
    if (order.userId !== user.userId && user.role !== "admin") {
      return apiResponse.forbidden("You do not have permission to cancel this order")
    }

    const cancelledOrder = await ordersService.cancelOrder(id)
    return apiResponse.success(cancelledOrder, "Order cancelled successfully")
  } catch (error) {
    console.error("POST /api/orders/:id/cancel error:", error)
    return apiResponse.serverError("Failed to cancel order", error)
  }
}
