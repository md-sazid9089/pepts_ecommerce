/**
 * ============================================================================
 * INQUIRY MANAGEMENT
 * GET    /api/inquiries/:id — get inquiry details (admin)
 * PUT    /api/inquiries/:id — update inquiry (admin)
 * DELETE /api/inquiries/:id — delete inquiry (admin)
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as inquiriesService from "@/src/services/inquiries.service"
import { verifyRequest } from "@/src/lib/verifyRequest"



export async function PUT(request, { params }) {
  try {
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    const body = await request.json()

    const updated = await inquiriesService.updateInquiry(id, body)
    return apiResponse.success(updated, "Inquiry updated successfully")
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return apiResponse.notFound(error.message)
    }
    console.error("PUT /api/inquiries/:id error:", error)
    return apiResponse.serverError("Failed to update inquiry", error)
  }
}
