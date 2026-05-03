// Clears the cached Prisma client before generating a fresh one.
// Called by the build script to force Vercel to regenerate from the current schema.
import { rmSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const prismaDir = resolve(__dirname, "..", "node_modules", ".prisma")

try {
  rmSync(prismaDir, { recursive: true, force: true })
  console.log("✔ Cleared .prisma cache — fresh prisma generate will follow")
} catch (e) {
  console.log("ℹ  No .prisma cache found — skipping clean step")
}
