/**
 * export-products.js
 * ============================================================================
 * Step 1 of the CUID → Int migration.
 * Exports ALL products and related records to a JSON file so data is
 * preserved before the schema reset.
 *
 * Run from server/:
 *   node scripts/export-products.js
 *
 * Output: server/scripts/products-export.json
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { writeFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, "../.env") })

const prisma = new PrismaClient({ log: ["warn", "error"] })

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║        PRODUCT DATA EXPORT (CUID → INT)         ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  // Export all products with full relations
  const products = await prisma.product.findMany({
    include: {
      images:    true,
      bulkPrices: true,
      reviews:   true,
      orderItems: {
        include: { order: true }
      },
      category:  { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  console.log(`► Exporting ${products.length} products...`)

  const payload = {
    exportedAt: new Date().toISOString(),
    productCount: products.length,
    products: products.map((p, idx) => ({
      // Assign new Int ID starting at 2500
      newId: 2500 + idx,
      oldCuid: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryName: p.category?.name ?? null,
      categoryId: p.categoryId,
      isActive: p.isActive,
      imageUrl: p.imageUrl,
      specs: p.specs,
      brand: p.brand,
      casePackSize: p.casePackSize,
      moq: p.moq,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      images: p.images.map(img => ({
        url:   img.url,
        order: img.order,
      })),
      bulkPrices: p.bulkPrices.map(bp => ({
        minQuantity: bp.minQuantity,
        maxQuantity: bp.maxQuantity,
        price:       bp.price,
        unit:        bp.unit,
        discount:    bp.discount,
      })),
      reviews: p.reviews.map(r => ({
        rating:  r.rating,
        title:   r.title,
        comment: r.comment,
        email:   r.email,
        status:  r.status,
        createdAt: r.createdAt,
      })),
    })),
  }

  const outPath = resolve(__dirname, "products-export.json")
  writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf-8")

  console.log(`\n✅  Exported ${products.length} products → ${outPath}`)
  console.log("\n  CUID → New Int ID mapping:")
  payload.products.forEach(p => {
    console.log(`  ${p.oldCuid}  →  ${p.newId}  "${p.title}"`)
  })

  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║  Export complete. Now run the schema migration.  ║")
  console.log("╚══════════════════════════════════════════════════╝\n")
}

main()
  .catch(err => { console.error("\n❌ Export failed:", err.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
