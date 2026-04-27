import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as usersService from "@/src/services/users.service"
import { z } from "zod"

const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

function verifyJwt(request) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(request) {
  try {
    const admin = verifyJwt(request)
    if (!admin) return apiResponse.unauthorized("Authentication required")
    if (admin.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { searchParams } = new URL(request.url)
    const raw = {
      page: searchParams.get("page") ?? "1",
      pageSize: searchParams.get("pageSize") ?? "20",
    }

    const parsed = userQuerySchema.safeParse(raw)
    if (!parsed.success) {
      return apiResponse.validationError("Invalid query parameters")
    }

    const { page, pageSize } = parsed.data
    const { items, total } = await usersService.getAll(page, pageSize)

    return apiResponse.paginated(items, total, page, pageSize, "Users fetched successfully")
  } catch (error) {
    console.error("GET /api/protected/users error:", error)
    return apiResponse.serverError("Failed to fetch users", error)
  }
}
