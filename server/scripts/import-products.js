/**
 * import-products.js
 * ============================================================================
 * Step 3 of the CUID → Int migration.
 * Re-imports all products from the JSON export with new Int IDs starting at 2500.
 *
 * Run AFTER:
 *   1. node scripts/export-products.js      ← creates products-export.json
 *   2. npx prisma db push --force-reset     ← drops + recreates all tables
 *   3. npx prisma generate                  ← regenerates Prisma client
 *
 * Then run this script:
 *   node scripts/import-products.js
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, "../.env") })

const prisma = new PrismaClient({ log: ["warn", "error"] })

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║        PRODUCT DATA IMPORT (CUID → INT)         ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  const exportPath = resolve(__dirname, "products-export.json")
  const payload = JSON.parse(readFileSync(exportPath, "utf-8"))
  const { products } = payload

  console.log(`► Re-importing ${products.length} products (IDs start at 2500)...\n`)

  // ── Step 1: Ensure the 4 protected categories exist ──────────────────────
  const PROTECTED_CATEGORIES = ["Our Design", "Custom Build", "Popular", "Most Demanding"]
  const categoryMap = {}

  for (const name of PROTECTED_CATEGORIES) {
    const cat = await prisma.category.upsert({
      where:  { name },
      update: {},
      create: { name, isActive: true },
    })
    categoryMap[name] = cat.id
    console.log(`  ✔ Category: "${name}" → ${cat.id}`)
  }
  console.log()

  // ── Step 2: Set AUTO_INCREMENT to 2500 BEFORE inserting ──────────────────
  // (MySQL only — adjusts the starting counter so IDs start at 2500)
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Product\` AUTO_INCREMENT = 2500`)
    console.log("  ✔ AUTO_INCREMENT set to 2500\n")
  } catch (err) {
    console.warn("  ⚠ Could not set AUTO_INCREMENT (may already be set):", err.message)
  }

  // ── Step 3: Insert products in order ─────────────────────────────────────
  let imported = 0
  let failed   = 0

  for (const p of products) {
    try {
      // Resolve category (by name from export, fallback to "Our Design")
      const catName  = p.categoryName || "Our Design"
      const categoryId = categoryMap[catName] || categoryMap["Our Design"]

      // Create product (Prisma will use the next AUTO_INCREMENT value)
      const created = await prisma.product.create({
        data: {
          title:        p.title,
          description:  p.description,
          price:        p.price,
          stock:        p.stock,
          categoryId,
          isActive:     p.isActive,
          imageUrl:     p.imageUrl,
          specs:        p.specs,
          brand:        p.brand,
          casePackSize: p.casePackSize,
          moq:          p.moq ?? 1,
          createdAt:    new Date(p.createdAt),
          updatedAt:    new Date(p.updatedAt),
          // Nested creates for related records
          images: {
            create: (p.images || []).map((img, idx) => ({
              url:   img.url,
              order: img.order ?? idx,
            })),
          },
          bulkPrices: {
            create: (p.bulkPrices || []).map(bp => ({
              minQuantity: bp.minQuantity,
              maxQuantity: bp.maxQuantity ?? null,
              price:       bp.price,
              unit:        bp.unit || "per unit",
              discount:    bp.discount ?? null,
            })),
          },
          reviews: {
            create: (p.reviews || []).map(r => ({
              rating:  r.rating,
              title:   r.title,
              comment: r.comment,
              email:   r.email ?? null,
              status:  r.status || "pending",
              createdAt: new Date(r.createdAt),
            })),
          },
        },
      })

      console.log(`  ✔ [${created.id}] "${created.title}"  (was CUID: ${p.oldCuid})`)
      imported++
    } catch (err) {
      console.error(`  ✘ Failed to import "${p.title}": ${err.message}`)
      failed++
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log(`║  Import complete: ${imported} succeeded, ${failed} failed.${" ".repeat(26 - String(imported).length - String(failed).length)}║`)
  console.log("╚══════════════════════════════════════════════════╝\n")

  if (failed > 0) {
    console.warn("⚠  Some products failed to import. Check errors above.")
    process.exit(1)
  }
}

main()
  .catch(err => { console.error("\n❌ Import failed:", err.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
