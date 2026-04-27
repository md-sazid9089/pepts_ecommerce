/**
 * ============================================================================
 * PRISMA CLIENT SINGLETON
 * ============================================================================
 * Implements the Next.js recommended Prisma singleton pattern using ES Modules.
 *
 * WHY A SINGLETON?
 * During development with hot module reloading, the module gets re-imported
 * multiple times which would create new PrismaClient instances and exhaust
 * the connection pool. The global cache pattern prevents this.
 * 
 * On serverless (like Vercel), each function invocation is isolated, so we
 * need to use global storage to cache the client across invocations.
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client"

/**
 * @type {PrismaClient}
 */
let prisma

try {
  // Use global pattern for both dev and production (serverless)
  if (!global._prismaClient) {
    console.log("[Prisma] Creating new PrismaClient instance")
    console.log("[Prisma] Database URL exists:", !!process.env.DATABASE_URL)
    global._prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      errorFormat: "pretty",
    })
  } else {
    console.log("[Prisma] Reusing existing global PrismaClient instance")
  }

  prisma = global._prismaClient
} catch (error) {
  console.error("[Prisma] Failed to initialize PrismaClient:", error)
  throw error
}

export default prisma
