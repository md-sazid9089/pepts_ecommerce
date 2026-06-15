/**
 * ============================================================================
 * REVIEW VALIDATOR — Zod schemas for product reviews
 * ============================================================================
 */

import { z } from "zod"

export const createReviewSchema = z.object({
  productId: z
    .coerce.number({ required_error: "Product ID is required", invalid_type_error: "Product ID must be a number" })
    .int("Product ID must be an integer")
    .positive("Product ID must be greater than 0"),

  rating: z
    .number({ required_error: "Rating is required", invalid_type_error: "Rating must be a number" })
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title too long")
    .optional(),

  comment: z
    .string({ required_error: "Review comment is required" })
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .optional(),
})
