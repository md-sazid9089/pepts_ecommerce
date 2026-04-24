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
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client"

const isDevelopment = process.env.NODE_ENV === "development"

/**
 * @type {PrismaClient}
 */
let prisma

if (process.env.NODE_ENV === "production") {
  // In production, always create a fresh single instance
  prisma = new PrismaClient({
    log: ["error"],
  })
} else {
  // In development, use global to preserve the instance across hot reloads
  if (!global._prismaClient) {
    global._prismaClient = new PrismaClient({
      log: ["query", "error", "warn"],
    })
  }
  prisma = global._prismaClient
}

export default prisma
