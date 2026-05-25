/**
 * ============================================================================
 * EXAMPLE SERVICE LAYER
 * ============================================================================
 * Services contain the business logic and database operations.
 * This layer is separate from the route handlers (controllers) to ensure
 * clean separation of concerns and testability.
 * 
 * RESPONSIBILITIES:
 * - Database queries using Prisma
 * - Business logic and data transformations
 * - Third-party API integrations
 * - Error handling and validation
 * 
 * NEVER directly call services from React components.
 * Services are only used by API route handlers.
 * ============================================================================
 */

import prisma from "@/lib/prisma"

/**
 * ✅ MOCK DATA FOR EXAMPLE
 * In production, all data comes from Prisma queries to the database
 */
const mockExamples = [
  {
    id: "ex_1",
    title: "Example Product 1",
    description: "This is an example product",
    price: 29.99,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ex_2",
    title: "Example Product 2",
    description: "Another example product",
    price: 49.99,
    createdAt: new Date().toISOString(),
  },
]

/**
 * ✅ GET ALL EXAMPLES
 * Fetches all example records from the database with pagination support
 * 
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<object>} - { items: array, total: number }
 * 
 * EXAMPLE USAGE (in route handler):
 * const { items, total } = await exampleService.getAll(1, 10);
 */
export async function getAll(page = 1, pageSize = 10) {
  try {
    // Calculate skip for pagination
    const skip = (page - 1) * pageSize

    // In production, replace this with actual Prisma query:
    // const items = await prisma.example.findMany({
    //   skip,
    //   take: pageSize,
    //   orderBy: { createdAt: 'desc' }
    // });
    // const total = await prisma.example.count();

    // MOCK IMPLEMENTATION
    const items = mockExamples
    const total = mockExamples.length

    return {
      items,
      total,
    }
  } catch (error) {
    throw new Error(`Failed to fetch examples: ${error.message}`)
  }
}

/**
 * ✅ GET EXAMPLE BY ID
 * Fetches a single example by ID
 * 
 * @param {string} id - The example ID
 * @returns {Promise<object|null>} - The example object or null if not found
 * 
 * EXAMPLE USAGE (in route handler):
 * const example = await exampleService.getById(req.params.id);
 * if (!example) return apiResponse.notFound("Example not found");
 */
export async function getById(id) {
  try {
    // In production:
    // const example = await prisma.example.findUnique({
    //   where: { id }
    // });

    // MOCK IMPLEMENTATION
    const example = mockExamples.find((e) => e.id === id)

    return example || null
  } catch (error) {
    throw new Error(`Failed to fetch example: ${error.message}`)
  }
}

/**
 * ✅ CREATE EXAMPLE
 * Creates a new example record in the database
 * 
 * @param {object} data - The example data { title, description, price }
 * @returns {Promise<object>} - The created example
 * 
 * EXAMPLE USAGE (in route handler):
 * const newExample = await exampleService.create({ 
 *   title: "New Product",
 *   description: "Description",
 *   price: 99.99
 * });
 */
export async function create(data) {
  try {
    // Validate required fields
    if (!data.title || !data.description || data.price === undefined) {
      throw new Error("Missing required fields: title, description, price")
    }

    // In production:
    // const example = await prisma.example.create({
    //   data: {
    //     title: data.title,
    //     description: data.description,
    //     price: data.price,
    //   }
    // });

    // MOCK IMPLEMENTATION
    const newExample = {
      id: `ex_${Date.now()}`,
      title: data.title,
      description: data.description,
      price: data.price,
      createdAt: new Date().toISOString(),
    }

    return newExample
  } catch (error) {
    throw new Error(`Failed to create example: ${error.message}`)
  }
}

/**
 * ✅ UPDATE EXAMPLE
 * Updates an existing example record
 * 
 * @param {string} id - The example ID
 * @param {object} data - The fields to update
 * @returns {Promise<object>} - The updated example
 * 
 * EXAMPLE USAGE (in route handler):
 * const updated = await exampleService.update(id, { 
 *   title: "Updated Title"
 * });
 */
export async function update(id, data) {
  try {
    // Check if example exists
    const example = await getById(id)
    if (!example) {
      throw new Error("Example not found")
    }

    // In production:
    // const updated = await prisma.example.update({
    //   where: { id },
    //   data
    // });

    // MOCK IMPLEMENTATION
    const updated = {
      ...example,
      ...data,
    }

    return updated
  } catch (error) {
    throw new Error(`Failed to update example: ${error.message}`)
  }
}

/**
 * ✅ DELETE EXAMPLE
 * Deletes an example record from the database
 * 
 * @param {string} id - The example ID
 * @returns {Promise<boolean>} - True if deleted successfully
 * 
 * EXAMPLE USAGE (in route handler):
 * const deleted = await exampleService.delete(id);
 * if (!deleted) return apiResponse.notFound("Example not found");
 */
export async function delete_(id) {
  try {
    // Check if example exists
    const example = await getById(id)
    if (!example) {
      throw new Error("Example not found")
    }

    // In production:
    // await prisma.example.delete({
    //   where: { id }
    // });

    return true
  } catch (error) {
    throw new Error(`Failed to delete example: ${error.message}`)
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  delete: delete_,
}
