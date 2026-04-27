import prisma from "@/src/lib/prisma"
import apiResponse from "@/src/utils/apiResponse"

export async function GET() {
  try {
    // 1. Check DB Connectivity
    await prisma.$queryRaw`SELECT 1`
    
    return apiResponse.success({
      status: "online",
      database: "connected",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    }, "API is running and database is connected")
  } catch (error) {
    console.error("Health check failed:", error)
    return apiResponse.serverError("API is online but database connection failed", {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    })
  }
}
