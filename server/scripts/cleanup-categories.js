/**
 * cleanup-categories.js
 * ============================================================================
 * ONE-TIME database cleanup script.
 *
 * What it does (in order):
 *  1. Finds all categories NOT in the protected list
 *  2. Re-assigns all products in those "rogue" categories → default category
 *  3. Deletes the rogue categories
 *  4. Upserts the 4 protected categories (creates if missing, activates if soft-deleted)
 *  5. Prints a confirmation table
 *
 * Run from the repo root:
 *   cd server && node --env-file=.env scripts/cleanup-categories.js
 *
 * Or if dotenv is already loaded by Prisma automatically:
 *   cd server && node scripts/cleanup-categories.js
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

// Load .env from the server root
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, "../.env") })

const prisma = new PrismaClient({ log: ["warn", "error"] })

const PROTECTED = ["Our Design", "Custom Build", "Popular", "Most Demanding"]

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║       CATEGORY CLEANUP & SEED SCRIPT            ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  // ── Step 1: Upsert the 4 protected categories first so we have a safe
  //            fallback target for product re-assignment.
  console.log("► Step 1 — Upserting 4 protected categories…")
  const seeded = []
  for (const name of PROTECTED) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    })
    seeded.push(cat)
    console.log(`   ✅  ${cat.name}  (id: ${cat.id})`)
  }

  // Use "Our Design" as the fallback category for re-assignment
  const fallbackCategory = seeded[0]
  console.log(`\n   Default reassignment target → "${fallbackCategory.name}" (${fallbackCategory.id})`)

  // ── Step 2: Find rogue categories
  console.log("\n► Step 2 — Finding categories outside the protected list…")
  const rogueCategories = await prisma.category.findMany({
    where: { name: { notIn: PROTECTED } },
    select: { id: true, name: true, _count: { select: { products: true } } },
  })

  if (rogueCategories.length === 0) {
    console.log("   ✅  No rogue categories found — DB is already clean.")
  } else {
    console.log(`   Found ${rogueCategories.length} rogue category/categories:`)
    rogueCategories.forEach((c) =>
      console.log(`   ⚠️   "${c.name}" (id: ${c.id}) — ${c._count.products} products`)
    )

    const rogueIds = rogueCategories.map((c) => c.id)

    // ── Step 3: Re-assign products in rogue categories → fallback category
    console.log(`\n► Step 3 — Reassigning products from rogue categories → "${fallbackCategory.name}"…`)
    const reassigned = await prisma.product.updateMany({
      where: { categoryId: { in: rogueIds } },
      data:  { categoryId: fallbackCategory.id },
    })
    console.log(`   ✅  ${reassigned.count} product(s) reassigned.`)

    // ── Step 4: Delete rogue categories
    console.log("\n► Step 4 — Deleting rogue categories…")
    const deleted = await prisma.category.deleteMany({
      where: { name: { notIn: PROTECTED } },
    })
    console.log(`   ✅  ${deleted.count} category/categories deleted.`)
  }

  // ── Step 5: Final verification
  console.log("\n► Step 5 — Final state of categories table:")
  const allCategories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  })

  console.log("")
  console.log("  ┌──────────────────────────┬──────────┬────────────────────────────────────┐")
  console.log("  │ Name                     │ Products │ ID                                 │")
  console.log("  ├──────────────────────────┼──────────┼────────────────────────────────────┤")
  allCategories.forEach((c) => {
    const name     = c.name.padEnd(24)
    const count    = String(c._count.products).padStart(8)
    const id       = c.id.padEnd(34)
    const warning  = !PROTECTED.includes(c.name) ? " ⚠️" : ""
    console.log(`  │ ${name} │ ${count} │ ${id} │${warning}`)
  })
  console.log("  └──────────────────────────┴──────────┴────────────────────────────────────┘")

  const unexpected = allCategories.filter((c) => !PROTECTED.includes(c.name))
  if (unexpected.length > 0) {
    console.log("\n  ⚠️  WARNING: Unexpected categories still present (see ⚠️ rows above).")
  } else {
    console.log("\n  ✅  All categories are clean. Only the 4 protected categories remain.")
  }

  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║                   DONE ✅                       ║")
  console.log("╚══════════════════════════════════════════════════╝\n")
}

main()
  .catch((err) => {
    console.error("\n❌ Script failed:", err.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
