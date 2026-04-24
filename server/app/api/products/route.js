/**
 * ============================================================================
 * PRODUCTS ROUTE HANDLER
 * ============================================================================
 * Supports public product catalog operations for the PEPTS storefront.
 * This route supports:
 * ✅ GET /api/products
 * ✅ POST /api/products
 * ✅ OPTIONS /api/products
 * ============================================================================
 */

import apiResponse from "@/src/utils/apiResponse"
import * as productsService from "@/src/services/products.service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)
    const search = searchParams.get("search") || undefined
    const category = searchParams.get("category") || undefined

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

    const { items, total } = await productsService.getAll(page, pageSize, {
      search,
      category,
    })

    return apiResponse.paginated(items, total, page, pageSize, "Products fetched successfully")
  } catch (error) {
    console.error("GET /api/products error:", error)
    return apiResponse.serverError("Failed to fetch products", error)
  }
}

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return apiResponse.error("Invalid JSON in request body", 400)
    }

    const errors = {}

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      errors.title = "Title is required and must be a non-empty string"
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim() === "") {
      errors.description = "Description is required and must be a non-empty string"
    }

    const priceValue = Number(body.price)
    if (body.price === undefined || Number.isNaN(priceValue) || priceValue < 0) {
      errors.price = "Price is required and must be a non-negative number"
    }

    const stockValue = body.stock === undefined || body.stock === "" ? 0 : Number(body.stock)
    if (Number.isNaN(stockValue) || stockValue < 0) {
      errors.stock = "Stock must be a non-negative number"
    }

    if (Object.keys(errors).length > 0) {
      return apiResponse.validationError("Request validation failed", errors)
    }

    const createdProduct = await productsService.createProduct({
      title: body.title,
      description: body.description,
      price: priceValue,
      stock: stockValue,
      categoryName: body.categoryName || body.category || "General",
    })

    return apiResponse.created(createdProduct, "Product created successfully")
  } catch (error) {
    console.error("POST /api/products error:", error)
    return apiResponse.serverError("Failed to create product", error)
  }
}

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