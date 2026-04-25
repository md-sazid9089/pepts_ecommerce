/**
 * ============================================================================
 * AUTH SERVICE LAYER
 * ============================================================================
 * Handles user registration, login, and profile retrieval.
 * Uses bcryptjs for password hashing and jsonwebtoken for JWT signing.
 * ============================================================================
 */

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"

/**
 * Sign a JWT token for a given user payload
 * @param {{ id: string, email: string, role: string }} user
 * @returns {string} signed JWT
 */
function signToken(user) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set")
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  )
}

/**
 * Strip sensitive fields from a user record before returning to client
 * @param {object} user - Prisma user record
 * @returns {object} safe user object
 */
function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

/**
 * Register a new user account
 * @param {{ email: string, password: string, firstName?: string, lastName?: string }} data
 * @returns {{ user: object, token: string }}
 */
export async function register({ email, password, firstName, lastName }) {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const err = new Error("An account with this email already exists")
    err.code = "DUPLICATE_EMAIL"
    throw err
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: email.toLowerCase() === 'maruflol62@gmail.com' ? "admin" : "customer",
    },
  })

  const token = signToken(user)
  return { user: sanitizeUser(user), token }
}

/**
 * Login with email and password
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Use same message for both "not found" and "wrong password" to prevent enumeration
    const err = new Error("Invalid email or password")
    err.code = "INVALID_CREDENTIALS"
    throw err
  }

  if (!user.isActive) {
    const err = new Error("This account has been deactivated")
    err.code = "ACCOUNT_INACTIVE"
    throw err
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    const err = new Error("Invalid email or password")
    err.code = "INVALID_CREDENTIALS"
    throw err
  }

  const token = signToken(user)

  // Ensure admin role for specific admin email if not already set
  if (user.email.toLowerCase() === 'maruflol62@gmail.com' && user.role !== 'admin') {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    })
    user.role = 'admin' // Update object before returning
  }

  return { user: sanitizeUser(user), token }
}

/**
 * Get a user by ID (for /api/auth/me)
 * @param {string} userId
 * @returns {object|null} sanitized user or null
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { orders: true, inquiries: true },
      },
    },
  })
  return user ? sanitizeUser(user) : null
}

export default { register, login, getUserById }
