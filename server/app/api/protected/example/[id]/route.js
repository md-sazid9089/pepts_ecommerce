/**
 * ============================================================================
 * PROTECTED ROUTE EXAMPLE HANDLER
 * ============================================================================
 * This route handler demonstrates a PROTECTED endpoint that requires
 * Bearer token authentication via middleware.
 * 
 * ROUTE: GET /api/protected/example
 * 
 * AUTHENTICATION REQUIREMENT:
 * Authorization header must contain a valid Bearer token
 * Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * 
 * The middleware.js file validates this and adds user info to request
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import exampleService from "@/src/services/example.service"

/**
 * ✅ GET /api/protected/example/:id
 * Fetches a single example - PROTECTED ROUTE (requires authentication)
 * 
 * URL PARAMETERS:
 * - id: string - The example ID
 * 
 * REQUEST HEADERS:
 * Authorization: Bearer <valid_jwt_token>
 * 
 * RESPONSE (200 OK):
 * {
 *   success: true,
 *   code: 200,
 *   message: "Example fetched successfully",
 *   data: {
 *     id: "ex_1",
 *     title: "...",
 *     description: "...",
 *     price: 29.99
 *   }
 * }
 * 
 * ERROR RESPONSES:
 * - 401 Unauthorized: No token or invalid token
 * - 404 Not Found: Example doesn't exist
 * - 500 Internal Server Error: Database operation failed
 * 
 * CURL EXAMPLE:
 * curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    // ✅ Validate ID parameter
    if (!id || typeof id !== "string") {
      return apiResponse.error("Invalid example ID", 400)
    }

    // ✅ Call service layer
    const example = await exampleService.getById(id)

    // ✅ Check if example exists
    if (!example) {
      return apiResponse.notFound(`Example with ID "${id}" not found`)
    }

    // ✅ Return success response
    return apiResponse.success(example, "Example fetched successfully")
  } catch (error) {
    console.error("GET /api/protected/example/:id error:", error)
    return apiResponse.serverError("Failed to fetch example", error)
  }
}

/**
 * ✅ DELETE /api/protected/example/:id
 * Deletes an example - PROTECTED ROUTE (requires authentication)
 * 
 * URL PARAMETERS:
 * - id: string - The example ID
 * 
 * REQUEST HEADERS:
 * Authorization: Bearer <valid_jwt_token>
 * 
 * RESPONSE (200 OK):
 * {
 *   success: true,
 *   code: 200,
 *   message: "Example deleted successfully",
 *   data: null
 * }
 * 
 * ERROR RESPONSES:
 * - 401 Unauthorized: No token or invalid token
 * - 404 Not Found: Example doesn't exist
 * - 500 Internal Server Error: Database operation failed
 * 
 * CURL EXAMPLE:
 * curl -X DELETE "http://localhost:3000/api/protected/example/ex_1" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // ✅ Validate ID parameter
    if (!id || typeof id !== "string") {
      return apiResponse.error("Invalid example ID", 400)
    }

    // ✅ Call service layer to delete
    const deleted = await exampleService.delete(id)

    // ✅ Check if example was deleted
    if (!deleted) {
      return apiResponse.notFound(`Example with ID "${id}" not found`)
    }

    // ✅ Return success response
    return apiResponse.success(null, "Example deleted successfully")
  } catch (error) {
    console.error("DELETE /api/protected/example/:id error:", error)
    return apiResponse.serverError("Failed to delete example", error)
  }
}

/**
 * ✅ OPTIONS /api/protected/example/:id
 * Handles CORS preflight requests for protected routes
 */
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
