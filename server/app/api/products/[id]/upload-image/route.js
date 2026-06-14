/**
 * ============================================================================
 * PRODUCT IMAGE UPLOAD
 * POST   /api/products/:id/upload-image
 * DELETE /api/products/:id/upload-image
 *
 * Uploads images to Cloudinary and saves URLs to ProductImage table in MySQL.
 * Requires: admin JWT token
 * Body (POST): multipart/form-data, field name "images" (up to 10 files)
 * Body (DELETE, optional): { imageId: "..." } — omit to delete ALL images
 * ============================================================================
 */

import { v2 as cloudinary } from "cloudinary"
import apiResponse from "@/src/utils/apiResponse"
import prisma from "@/src/lib/prisma"
import { verifyRequest } from "@/src/lib/verifyRequest"

// Configure Cloudinary from environment variables
// .trim() guards against \r\n line endings or accidental whitespace in .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key:    process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
})

// ─── POST /api/products/:id/upload-image ────────────────────────────────────
export async function POST(request, { params }) {
  try {
    // ── FIX: Diagnostic log — confirms env vars are set without exposing values ──
    console.log("[upload-image] CLOUDINARY CONFIG CHECK:", {
      cloud:  !!process.env.CLOUDINARY_CLOUD_NAME,
      key:    !!process.env.CLOUDINARY_API_KEY,
      secret: !!process.env.CLOUDINARY_API_SECRET,
    })

    // 1. Auth check
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    // 2. Parse product ID — schema uses Int, params.id is always a string
    const { id: rawId } = await params
    const id = parseInt(rawId, 10)
    if (isNaN(id)) return apiResponse.error("Invalid product ID — must be an integer", 400)
    console.log("[upload-image] productId (parsed int):", id)

    // 3. Confirm product exists (also validates ownership scope)
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return apiResponse.notFound(`Product "${id}" not found`)
    console.log("[upload-image] product found:", product.title)

    // 4. Parse multipart form data
    let formData
    try {
      formData = await request.formData()
    } catch (err) {
      console.error("[upload-image] formData parse error:", err.message)
      return apiResponse.error("Invalid form data — ensure Content-Type is multipart/form-data", 400)
    }

    const files = formData.getAll("images")
    if (!files || files.length === 0) {
      return apiResponse.error("No image files provided. Include files under field name 'images'.", 400)
    }
    if (files.length > 10) {
      return apiResponse.error("Maximum 10 images allowed per upload.", 400)
    }
    console.log("[upload-image] files received:", files.length)

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

    const uploadedUrls = []

    for (const file of files) {
      // Validate type
      if (!allowedTypes.includes(file.type)) {
        return apiResponse.error(
          `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF.`, 400
        )
      }
      // Validate size
      if (file.size > MAX_SIZE) {
        return apiResponse.error("File too large. Maximum size is 10 MB.", 400)
      }

      console.log("[upload-image] uploading:", file.name, "| type:", file.type, "| size:", file.size)

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // ── FIX: tags must be strings — id is an Int, must be coerced ──
      // Passing an integer to Cloudinary tags causes a silent upload error
      // in some SDK versions, preventing secure_url from being returned.
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder:    "pepta/products",
            public_id: `product_${id}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            transformation: [
              { width: 1200, height: 1200, crop: "limit" },
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
            // FIX: coerce id to String — Cloudinary tags must be strings
            tags: ["product", String(id)],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(buffer)
      })

      // ── FIX: Log Cloudinary result for Vercel diagnostics ──
      console.log("[upload-image] CLOUDINARY RESULT:", JSON.stringify({
        public_id:  uploadResult?.public_id,
        secure_url: uploadResult?.secure_url,
        format:     uploadResult?.format,
        bytes:      uploadResult?.bytes,
        http_code:  uploadResult?.http_code,
      }))

      // ── FIX: Validate secure_url before saving to DB ──
      if (!uploadResult?.secure_url) {
        throw new Error(
          "Cloudinary did not return a secure_url — upload may have failed silently. " +
          `Cloudinary response: ${JSON.stringify(uploadResult)}`
        )
      }

      uploadedUrls.push(uploadResult.secure_url)
    }

    console.log("[upload-image] all uploads done, saving to DB. urls:", uploadedUrls)

    // Find current number of images for this product to get the next order index
    const currentCount = await prisma.productImage.count({
      where: { productId: id }
    })

    if (uploadedUrls.length > 0) {
      const created = await prisma.productImage.createMany({
        data: uploadedUrls.map((url, index) => ({
          url,
          order:     currentCount + index,
          productId: id,   // id is already parseInt'd Int — matches schema
        })),
      })
      console.log("[upload-image] created new ProductImage records:", created.count)
    }

    console.log("[upload-image] POST complete — success")
    return apiResponse.success(
      { urls: uploadedUrls },
      `${uploadedUrls.length} image(s) uploaded successfully`
    )

  } catch (error) {
    // ── FIX: Expose full error for Vercel function log inspection ──
    console.error("[upload-image] POST ERROR FULL:", {
      message: error?.message,
      code:    error?.code,
      meta:    error?.meta,
      stack:   error?.stack?.split("\n").slice(0, 8).join("\n"),
    })
    return apiResponse.serverError(`Upload failed: ${error.message}`, error)
  }
}

// ─── DELETE /api/products/:id/upload-image ──────────────────────────────────
// Removes product image(s) from Cloudinary and ProductImage table.
// Body (optional): { imageId: "..." } — omit to delete ALL images for the product.
export async function DELETE(request, { params }) {
  try {
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized("Authentication required")
    if (user.role !== "admin") return apiResponse.forbidden("Admin access required")

    const { id: rawId } = await params
    const id = parseInt(rawId, 10)
    if (isNaN(id)) return apiResponse.error("Invalid product ID — must be an integer", 400)

    // Security: confirm product exists (ownership anchor)
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return apiResponse.notFound(`Product "${id}" not found`)

    // Optional: single-image deletion if imageId provided in body
    let imageId = null
    try {
      const body = await request.json()
      imageId = body?.imageId ?? null
    } catch { /* no body — will delete all */ }

    // Always scope whereClause to this productId (security check)
    const whereClause = imageId
      ? { id: imageId, productId: id }
      : { productId: id }

    const productImages = await prisma.productImage.findMany({ where: whereClause })

    if (productImages.length === 0) {
      return apiResponse.notFound("No images found for this product")
    }

    // Delete from Cloudinary first — DB record is preserved if Cloudinary fails
    for (const img of productImages) {
      try {
        const urlParts = img.url.split("/")
        const uploadIndex = urlParts.indexOf("upload")
        if (uploadIndex === -1) continue // skip non-Cloudinary URLs
        const afterUpload = urlParts.slice(uploadIndex + 1).join("/")
        // Strip version segment (v1234567) if present
        const segments = afterUpload.split("/")
        const withoutVersion =
          segments[0].startsWith("v") && /^v\d+$/.test(segments[0])
            ? segments.slice(1).join("/")
            : afterUpload
        const publicId = withoutVersion.replace(/\.[^.]+$/, "")
        await cloudinary.uploader.destroy(publicId)
        console.log("[upload-image] Cloudinary destroyed:", publicId)
      } catch (err) {
        console.error("[upload-image] Cloudinary destroy failed for:", img.url, err.message)
        return apiResponse.serverError(
          `Failed to delete image from Cloudinary: ${err.message}`
        )
      }
    }

    // Delete ProductImage records from database
    await prisma.productImage.deleteMany({ where: whereClause })

    return apiResponse.success(
      null,
      `${productImages.length} image(s) removed successfully`
    )
  } catch (error) {
    console.error("[upload-image] DELETE ERROR FULL:", {
      message: error?.message,
      code:    error?.code,
      meta:    error?.meta,
    })
    return apiResponse.serverError(`Delete failed: ${error.message}`, error)
  }
}
