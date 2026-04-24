/**
 * ============================================================================
 * PRODUCT VALIDATOR — Zod schemas for product endpoints
 * ============================================================================
 */

import { z } from "zod"

export const createProductSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title too long"),

  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description cannot be empty")
    .max(5000, "Description too long"),

  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .nonnegative("Price must be >= 0"),

  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be >= 0")
    .default(0),

  categoryId: z
    .string()
    .trim()
    .optional(),

  categoryName: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty")
    .max(100, "Category name too long")
    .optional()
    .default("General"),

  images: z
    .array(z.string().url())
    .optional(),
})

export const updateProductSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.string().trim().optional(),
  categoryName: z.string().trim().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
})

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "price", "title"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})
