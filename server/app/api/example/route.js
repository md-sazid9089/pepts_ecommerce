/**
 * ============================================================================
 * EXAMPLE ROUTE HANDLER (PUBLIC)
 * ============================================================================
 * This is a public API endpoint accessible without authentication.
 * 
 * ROUTE: GET/POST /api/example
 * 
 * Demonstrates:
 * ✅ GET handler - Fetch all examples with pagination
 * ✅ POST handler - Create a new example
 * ✅ Error handling with consistent responses
 * ✅ Request validation
 * ✅ Service layer integration
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import exampleService from "@/src/services/example.service"

/**
 * ✅ GET /api/example
 * Fetches all examples with pagination support
 * 
 * QUERY PARAMETERS:
 * - page: number (default: 1) - The page number
 * - pageSize: number (default: 10) - Items per page
 * 
 * RESPONSE (200 OK):
 * {
 *   success: true,
 *   code: 200,
 *   message: "Examples fetched successfully",
 *   data: {
 *     items: [...],
 *     pagination: { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage }
 *   }
 * }
 * 
 * CURL EXAMPLE:
 * curl -X GET "http://localhost:3000/api/example?page=1&pageSize=10"
 */
export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)

    // ✅ Validate pagination parameters
    if (page < 1) {
      return apiResponse.validationError("Invalid pagination", {
        page: "Page must be greater than 0",
      })
    }
    if (pageSize < 1 || pageSize > 100) {
      return apiResponse.validationError("Invalid pagination", {
        pageSize: "Page size must be between 1 and 100",
      })
    }

    // ✅ Call service layer
    const { items, total } = await exampleService.getAll(page, pageSize)

    // ✅ Return paginated response
    return apiResponse.paginated(
      items,
      total,
      page,
      pageSize,
      "Examples fetched successfully"
    )
  } catch (error) {
    console.error("GET /api/example error:", error)
    return apiResponse.serverError("Failed to fetch examples", error)
  }
}

/**
 * ✅ POST /api/example
 * Creates a new example
 * 
 * REQUEST BODY (JSON):
 * {
 *   "title": "Product Title",
 *   "description": "Product Description",
 *   "price": 29.99
 * }
 * 
 * RESPONSE (201 Created):
 * {
 *   success: true,
 *   code: 201,
 *   message: "Example created successfully",
 *   data: {
 *     id: "ex_123",
 *     title: "...",
 *     description: "...",
 *     price: 29.99,
 *     createdAt: "2024-04-21T..."
 *   }
 * }
 * 
 * ERROR RESPONSES:
 * - 400 Bad Request: Missing or invalid required fields
 * - 500 Internal Server Error: Database operation failed
 * 
 * CURL EXAMPLE:
 * curl -X POST "http://localhost:3000/api/example" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "title": "New Product",
 *     "description": "Amazing product",
 *     "price": 49.99
 *   }'
 */
export async function POST(request) {
  try {
    // ✅ Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    // ✅ Validate required fields
    const errors = {}

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      errors.title = "Title is required and must be a non-empty string"
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim() === "") {
      errors.description = "Description is required and must be a non-empty string"
    }

    if (body.price === undefined || typeof body.price !== "number" || body.price < 0) {
      errors.price = "Price is required and must be a positive number"
    }

    // ✅ Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return apiResponse.validationError("Request validation failed", errors)
    }

    // ✅ Call service layer to create example
    const newExample = await exampleService.create({
      title: body.title.trim(),
      description: body.description.trim(),
      price: body.price,
    })

    // ✅ Return created response
    return apiResponse.created(newExample, "Example created successfully")
  } catch (error) {
    console.error("POST /api/example error:", error)
    return apiResponse.serverError("Failed to create example", error)
  }
}

/**
 * ✅ OPTIONS /api/example
 * Handles CORS preflight requests
 * Required for cross-origin requests from your React frontend
 */
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
