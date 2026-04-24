/**
 * ============================================================================
 * REVIEW VALIDATOR — Zod schemas for product reviews
 * ============================================================================
 */

import { z } from "zod"

export const createReviewSchema = z.object({
  productId: z
    .string({ required_error: "Product ID is required" })
    .min(1, "Product ID cannot be empty"),

  rating: z
    .number({ required_error: "Rating is required", invalid_type_error: "Rating must be a number" })
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  title: z
    .string({ required_error: "Review title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title too long"),

  comment: z
    .string({ required_error: "Review comment is required" })
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment too long"),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .optional(),
})
