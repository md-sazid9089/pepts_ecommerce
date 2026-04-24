/**
 * ============================================================================
 * TELEMETRY — WEB VITALS
 * POST /api/telemetry/web-vitals
 * ============================================================================
 * Mock endpoint to collect web vitals without breaking the frontend
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"

export async function POST(request) {
  try {
    // In a real app, we would save this to a monitoring service or DB
    // const body = await request.json();
    // console.log("[Telemetry] Web Vital:", body);
    
    return apiResponse.success(null, "Telemetry received")
  } catch (error) {
    return apiResponse.success(null, "Telemetry ignored")
  }
}
