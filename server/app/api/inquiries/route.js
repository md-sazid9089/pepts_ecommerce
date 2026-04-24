/**
 * ============================================================================
 * INQUIRIES
 * POST /api/inquiries  — submit B2B inquiry (public)
 * GET  /api/inquiries  — list all inquiries (admin only)
 * ============================================================================
 */

import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import * as inquiriesService from "@/src/services/inquiries.service"
import { createInquirySchema } from "@/src/validators/inquiry.validator"

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

// ─── POST /api/inquiries (public) ────────────────────────────────────────────

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const parsed = createInquirySchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join(".")] = e.message })
      return apiResponse.validationError("Validation failed", errors)
    }

    // Optionally attach user if authenticated
    const jwtUser = verifyJwt(request)
    const inquiry = await inquiriesService.createInquiry(parsed.data, jwtUser?.userId ?? null)

    return apiResponse.created(inquiry, "Inquiry submitted successfully. We will contact you shortly.")
  } catch (error) {
    console.error("POST /api/inquiries error:", error)
    return apiResponse.serverError("Failed to submit inquiry", error)
  }
}

// ─── GET /api/inquiries (admin only) ─────────────────────────────────────────

export async function GET(request) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)))
    const status = searchParams.get("status") ?? undefined

    const { items, total } = await inquiriesService.getAllInquiries(page, pageSize, status)
    return apiResponse.paginated(items, total, page, pageSize, "Inquiries fetched successfully")
  } catch (error) {
    console.error("GET /api/inquiries error:", error)
    return apiResponse.serverError("Failed to fetch inquiries", error)
  }
}
