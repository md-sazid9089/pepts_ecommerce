/**
 * ============================================================================
 * AUTH VALIDATOR — Zod schemas for authentication endpoints
 * ============================================================================
 */

import { z } from "zod"

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),

  firstName: z
    .string()
    .trim()
    .min(1, "First name cannot be empty")
    .max(50, "First name too long")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty")
    .max(50, "Last name too long")
    .optional(),
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
})
