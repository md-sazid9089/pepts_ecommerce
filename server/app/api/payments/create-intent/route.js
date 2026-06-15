/**
 * ============================================================================
 * POST /api/payments/create-intent
 * ============================================================================
 * Creates a Stripe PaymentIntent for the given cart items.
 * Requires a valid JWT (cookie or Authorization header).
 * Returns { clientSecret } — the frontend uses this to mount Stripe Elements.
 *
 * Body: { items: [{ productId, quantity, price }], userId? }
 * ============================================================================
 */

import { z } from 'zod'
import apiResponse from '@/src/utils/apiResponse'
import { verifyRequest } from '@/src/lib/verifyRequest'
import stripe from '@/src/lib/stripe'
import prisma from '@/src/lib/prisma'

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.union([z.string(), z.number()]),
        quantity: z.coerce.number().int().positive(),
        price: z.number().positive().optional(),
      })
    )
    .min(1, 'At least one item is required'),
})

export async function POST(request) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const user = verifyRequest(request)
    if (!user) return apiResponse.unauthorized('Authentication required')

    // ── Parse body ───────────────────────────────────────────────────────────
    let body
    try {
      body = await request.json()
    } catch {
      return apiResponse.error('Invalid JSON in request body', 400)
    }

    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      const errors = {}
      parsed.error.errors.forEach((e) => { errors[e.path.join('.')] = e.message })
      return apiResponse.validationError('Validation failed', errors)
    }

    const { items } = parsed.data

    // ── Calculate total in cents ──────────────────────────────────────────────
    const productIds = items.map((item) => parseInt(item.productId, 10))
    if (productIds.some((id) => isNaN(id))) {
      return apiResponse.validationError('Validation failed', {
        productId: 'Each productId must be a valid integer',
      })
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { bulkPrices: { orderBy: { minQuantity: 'desc' } } },
    })
    const productMap = new Map(products.map((product) => [product.id, product]))

    let totalAmount = 0
    for (const item of items) {
      const productId = parseInt(item.productId, 10)
      const product = productMap.get(productId)
      if (!product) {
        return apiResponse.notFound(`Product "${productId}" not found`)
      }

      const tier = product.bulkPrices.find((priceTier) => item.quantity >= priceTier.minQuantity)
      const unitPrice = tier?.price ?? product.price
      totalAmount += unitPrice * item.quantity
    }

    const totalCents = Math.round(totalAmount * 100)

    if (totalCents < 50) {
      return apiResponse.error('Order total must be at least $0.50', 400)
    }

    // ── Create PaymentIntent ─────────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.userId,
        itemCount: String(items.length),
        userEmail: user.email || '',
        amount: String(Math.round(totalAmount * 100) / 100),
      },
    })

    return apiResponse.success(
      {
        clientSecret: paymentIntent.client_secret,
        amount: Math.round(totalAmount * 100) / 100,
      },
      'Payment intent created'
    )
  } catch (error) {
    console.error('POST /api/payments/create-intent error:', error)
    return apiResponse.serverError('Failed to create payment intent', error)
  }
}
