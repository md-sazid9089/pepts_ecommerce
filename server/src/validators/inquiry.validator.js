/**
 * ============================================================================
 * INQUIRY VALIDATOR — Zod schemas for B2B inquiry submission
 * ============================================================================
 */

import { z } from "zod"

export const createInquirySchema = z.object({
  companyName: z
    .string({ required_error: "Company name is required" })
    .trim()
    .min(1, "Company name cannot be empty")
    .max(255, "Company name too long"),

  contactEmail: z
    .string({ required_error: "Contact email is required" })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  contactPhone: z
    .string()
    .trim()
    .max(30, "Phone number too long")
    .optional(),

  productName: z
    .string({ required_error: "Product name is required" })
    .trim()
    .min(1, "Product name cannot be empty")
    .max(255, "Product name too long"),

  productId: z.string().optional(),

  requestedQuantity: z
    .number({ required_error: "Requested quantity is required", invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),

  message: z
    .string()
    .trim()
    .max(2000, "Message too long")
    .optional(),
})

export const updateInquirySchema = z.object({
  status: z.enum(["new", "replied", "converted", "lost"]).optional(),
  notes: z.string().trim().max(2000).optional(),
  assignedTo: z.string().optional(),
})
