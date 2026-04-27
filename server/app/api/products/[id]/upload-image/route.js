/**
 * ============================================================================
 * PRODUCT IMAGE UPLOAD
 * POST /api/products/:id/upload-image
 * Uploads an image to Cloudinary and saves the URL to the product in MySQL.
 * Requires: admin JWT token
 * Body: multipart/form-data with field "image" (file)
 * ============================================================================
 */

import { v2 as cloudinary } from "cloudinary"
import jwt from "jsonwebtoken"
import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ─── Auth Helper ─────────────────────────────────────────────────────────────
function verifyJwt(request) {
  const authHeader = request.headers.get("authorization")
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message)
    return null
  }
}

// ─── POST /api/products/:id/upload-image ────────────────────────────────────
export async function POST(request, { params }) {
  try {
    // 1. Auth check
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    // 2. Get product ID
    const { id } = await params
    if (!id) return apiResponse.error("Invalid product ID", 400)

    // 3. Check product exists
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return apiResponse.notFound(`Product "${id}" not found`)

    // 4. Parse multipart form data
    let formData
    try {
      formData = await request.formData()
    } catch {
      return apiResponse.error("Invalid form data", 400)
    }

    const files = formData.getAll("images")
    if (!files || files.length === 0) {
      return apiResponse.error("No image files provided. Include files under 'images'.", 400)
    }

    if (files.length > 10) {
      return apiResponse.error("Maximum 10 images allowed.", 400)
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    const MAX_SIZE = 10 * 1024 * 1024

    const uploadedUrls = []

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return apiResponse.error(`Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF.`, 400)
      }
      if (file.size > MAX_SIZE) {
        return apiResponse.error("File too large. Maximum size is 10MB.", 400)
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder:         "pepta/products",
            public_id:      `product_${id}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            transformation: [
              { width: 1200, height: 1200, crop: "limit" },
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
            tags: ["product", id],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(buffer)
      })

      uploadedUrls.push(uploadResult.secure_url)
    }

    // Replace all images in DB for this product
    await prisma.productImage.deleteMany({
      where: { productId: id }
    })

    if (uploadedUrls.length > 0) {
      await prisma.productImage.createMany({
        data: uploadedUrls.map((url, index) => ({
          url,
          order: index,
          productId: id,
        })),
      })
    }

    return apiResponse.success(
      { urls: uploadedUrls },
      `${uploadedUrls.length} image(s) uploaded successfully`
    )
  } catch (error) {
    console.error("POST /api/products/:id/upload-image error:", error)
    return apiResponse.serverError("Failed to upload image", error)
  }
}

// ─── DELETE /api/products/:id/upload-image ──────────────────────────────────
// Removes the product image from Cloudinary and clears imageUrl in MySQL
export async function DELETE(request, { params }) {
  try {
    const user = verifyJwt(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return apiResponse.notFound(`Product "${id}" not found`)

    if (product.imageUrl) {
      try {
        const urlParts = product.imageUrl.split("/")
        const folderAndFile = urlParts.slice(-2).join("/")
        const publicId = folderAndFile.replace(/\.[^.]+$/, "")
        await cloudinary.uploader.destroy(publicId)
      } catch {
        console.warn("Could not delete Cloudinary image for product:", id)
      }
    }

    await prisma.product.update({
      where: { id },
      data:  { imageUrl: null },
    })

    return apiResponse.success(null, "Product image removed successfully")
  } catch (error) {
    console.error("DELETE /api/products/:id/upload-image error:", error)
    return apiResponse.serverError("Failed to remove image", error)
  }
}
