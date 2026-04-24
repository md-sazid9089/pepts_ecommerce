/**
 * ============================================================================
 * USER ORDERS
 * GET /api/orders/user — get orders for the logged-in user
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

export async function GET(request) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)

    const result = await ordersService.getUserOrders(user.userId, page, pageSize)
    return apiResponse.paginated(result.items, result.total, page, pageSize, "Orders fetched successfully")
  } catch (error) {
    console.error("GET /api/orders/user error:", error)
    return apiResponse.serverError("Failed to fetch user orders", error)
  }
}
