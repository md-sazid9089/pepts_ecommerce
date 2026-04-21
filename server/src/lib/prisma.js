/**
 * ============================================================================
 * PRISMA CLIENT SINGLETON
 * ============================================================================
 * This implements the Next.js best-practice Prisma instantiation pattern.
 * 
 * WHY A SINGLETON?
 * During development with hot module reloading, the module gets re-imported
 * multiple times, which would create new PrismaClient instances and exhaust
 * the connection pool. The singleton pattern ensures we reuse the same client.
 * 
 * In production (built code), this creates exactly one client instance.
 * ============================================================================
 */

let prisma

// Determine environment
const isDevelopment = process.env.NODE_ENV === "development"

// Initialize Prisma Client (singleton)
if (!global.prisma) {
  global.prisma = new (require("@prisma/client").PrismaClient)({
    // Log database queries in development for debugging
    log: isDevelopment
      ? ["query", "error", "warn"]
      : ["error"],
  })
}

prisma = global.prisma

/**
 * ✅ Disconnect handler for graceful shutdown
 * Ensures database connection is closed properly when the server stops
 */
if (isDevelopment) {
  // In development, attach cleanup to global object for hot reload
  if (!global.prismaDisconnect) {
    global.prismaDisconnect = async () => {
      await prisma.$disconnect()
    }
  }
}

module.exports = prisma
