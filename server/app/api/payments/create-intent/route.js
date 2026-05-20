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

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.union([z.string(), z.number()]),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
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
    const totalCents = Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    )

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
      },
    })

    return apiResponse.success(
      { clientSecret: paymentIntent.client_secret },
      'Payment intent created'
    )
  } catch (error) {
    console.error('POST /api/payments/create-intent error:', error)
    return apiResponse.serverError('Failed to create payment intent', error)
  }
}
