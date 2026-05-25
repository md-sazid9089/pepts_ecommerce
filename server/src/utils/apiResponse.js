import { NextResponse } from "next/server"

/**
 * ============================================================================
 * API RESPONSE FORMATTER
 * ============================================================================
 * Provides a consistent JSON response structure for all API endpoints.
 * This ensures uniform responses across the entire backend API.
 * 
 * RESPONSE STRUCTURE:
 * {
 *   success: boolean,          // Did the operation succeed?
 *   code: number,              // HTTP status code (e.g., 200, 400, 500)
 *   message: string,           // Human-readable message
 *   data: any,                 // Response data (null if error)
 *   error: object | null,      // Error details (null if success)
 *   timestamp: string,         // ISO timestamp of response
 *   path: string,              // API endpoint path
 * }
 * ============================================================================
 */

/**
 * ✅ SUCCESS RESPONSE
 * Use this when the API operation completes successfully
 * 
 * @param {*} data - The response data to send back
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {NextResponse} - Formatted success response
 * 
 * EXAMPLE:
 * const products = await getProducts();
 * return apiResponse.success(products, "Products fetched successfully");
 */
export const success = (data = null, message = "Success", statusCode = 200) => {
  // CORS headers are handled exclusively by middleware.js — do NOT set them here
  // to avoid duplicate Access-Control-Allow-Origin headers.
  return NextResponse.json(
    {
      success: true,
      code: statusCode,
      message,
      data,
      error: null,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}

/**
 * ✅ ERROR RESPONSE
 * Use this when the API operation fails
 * 
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} errorDetails - Optional detailed error information
 * @returns {NextResponse} - Formatted error response
 * 
 * EXAMPLE:
 * return apiResponse.error("Product not found", 404);
 * return apiResponse.error("Validation failed", 400, { field: "email", reason: "Invalid format" });
 */
export const error = (
  message = "An error occurred",
  statusCode = 400,
  errorDetails = null
) => {
  // CORS headers are handled exclusively by middleware.js — do NOT set them here
  // to avoid duplicate Access-Control-Allow-Origin headers.
  return NextResponse.json(
    {
      success: false,
      code: statusCode,
      message,
      data: null,
      error: errorDetails || {
        message,
        code: statusCode,
      },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}

/**
 * ✅ VALIDATION ERROR RESPONSE
 * Use this when request validation fails (e.g., missing required fields)
 * 
 * @param {string} message - Validation error message
 * @param {object} validationErrors - Object containing field-specific errors
 * @returns {NextResponse} - Formatted validation error response
 * 
 * EXAMPLE:
 * return apiResponse.validationError("Request validation failed", {
 *   email: "Invalid email format",
 *   password: "Must be at least 8 characters"
 * });
 */
export const validationError = (message = "Validation failed", validationErrors = {}) => {
  return NextResponse.json(
    {
      success: false,
      code: 422,
      message,
      data: null,
      error: {
        message,
        code: 422,
        validationErrors,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 422 }
  )
}

/**
 * ✅ UNAUTHORIZED RESPONSE
 * Use this when authentication fails or authorization is denied
 * 
 * @param {string} message - Unauthorized message
 * @returns {NextResponse} - Formatted unauthorized response
 * 
 * EXAMPLE:
 * return apiResponse.unauthorized("Invalid token");
 * return apiResponse.unauthorized("Admin access required");
 */
export const unauthorized = (message = "Unauthorized") => {
  return NextResponse.json(
    {
      success: false,
      code: 401,
      message,
      data: null,
      error: {
        message,
        code: 401,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  )
}

/**
 * ✅ FORBIDDEN RESPONSE
 * Use this when the user is authenticated but lacks permission
 * 
 * @param {string} message - Forbidden message
 * @returns {NextResponse} - Formatted forbidden response
 * 
 * EXAMPLE:
 * return apiResponse.forbidden("You don't have permission to delete this user");
 */
export const forbidden = (message = "Forbidden") => {
  return NextResponse.json(
    {
      success: false,
      code: 403,
      message,
      data: null,
      error: {
        message,
        code: 403,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  )
}

/**
 * ✅ NOT FOUND RESPONSE
 * Use this when a requested resource doesn't exist
 * 
 * @param {string} message - Not found message
 * @returns {NextResponse} - Formatted not found response
 * 
 * EXAMPLE:
 * return apiResponse.notFound("Product not found");
 */
export const notFound = (message = "Resource not found") => {
  return NextResponse.json(
    {
      success: false,
      code: 404,
      message,
      data: null,
      error: {
        message,
        code: 404,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  )
}

/**
 * ✅ SERVER ERROR RESPONSE
 * Use this for unexpected server-side errors
 * 
 * @param {string} message - Error message
 * @param {Error} exception - Optional Error object for logging
 * @returns {NextResponse} - Formatted server error response
 * 
 * EXAMPLE:
 * try {
 *   // Some operation
 * } catch (err) {
 *   return apiResponse.serverError("Failed to process request", err);
 * }
 */
export const serverError = (message = "Internal server error", exception = null) => {
  // In development, include stack trace. In production, omit for security.
  const isDevelopment = process.env.NODE_ENV === "development"
  const errorDetails = isDevelopment && exception ? exception.stack : undefined

  return NextResponse.json(
    {
      success: false,
      code: 500,
      message,
      data: null,
      error: {
        message,
        code: 500,
        ...(isDevelopment && { stack: errorDetails }),
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  )
}

/**
 * ✅ PAGINATED RESPONSE
 * Use this when returning paginated data
 * 
 * @param {array} items - Array of data items
 * @param {number} total - Total count of all items
 * @param {number} page - Current page number
 * @param {number} pageSize - Number of items per page
 * @param {string} message - Success message
 * @returns {NextResponse} - Formatted paginated response
 * 
 * EXAMPLE:
 * const { items, count } = await prisma.product.findMany({...});
 * return apiResponse.paginated(items, count, page, pageSize);
 */
export const paginated = (
  items = [],
  total = 0,
  page = 1,
  pageSize = 10,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / pageSize)

  return NextResponse.json(
    {
      success: true,
      code: 200,
      message,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      error: null,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

/**
 * ✅ CREATED RESPONSE
 * Use this when a resource is successfully created
 * 
 * @param {*} data - The created resource
 * @param {string} message - Success message
 * @returns {NextResponse} - Formatted creation response
 * 
 * EXAMPLE:
 * const newProduct = await createProduct({...});
 * return apiResponse.created(newProduct, "Product created successfully");
 */
export const created = (data = null, message = "Resource created successfully") => {
  return NextResponse.json(
    {
      success: true,
      code: 201,
      message,
      data,
      error: null,
      timestamp: new Date().toISOString(),
    },
    { status: 201 }
  )
}

export default {
  success,
  error,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  paginated,
  created,
}
