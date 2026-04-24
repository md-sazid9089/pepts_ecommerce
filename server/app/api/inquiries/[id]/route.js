/**
 * ============================================================================
 * INQUIRIES BY ID — Admin Update
 * PATCH /api/inquiries/:id  — update status/notes (admin only)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as inquiriesService from "@/src/services/inquiries.service"
import { updateInquirySchema } from "@/src/validators/inquiry.validator"

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

export async function PATCH(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    if (!id) return apiResponse.error("Invalid inquiry ID", 400)

    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = updateInquirySchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    const inquiry = await inquiriesService.updateInquiry(id, parsed.data)
    return apiResponse.success(inquiry, "Inquiry updated successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") return apiResponse.notFound(error.message)
    console.error("PATCH /api/inquiries/:id error:", error)
    return apiResponse.serverError("Failed to update inquiry", error)
  }
}
