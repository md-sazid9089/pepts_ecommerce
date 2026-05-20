/**
 * ============================================================================
 * PAYMENTS API SERVICE
 * ============================================================================
 * Handles payment-related API calls to the backend.
 * ============================================================================
 */

import apiClient from '@/services/apiClient'

export const paymentsApi = {
  /**
   * Create a Stripe PaymentIntent
   * @param {Array} items - Cart items with productId, quantity, price
   * @param {Object} customerInfo - Customer details (name, email, address, etc.)
   * @returns {Promise<{ clientSecret, paymentIntentId, amount }>}
   */
  createIntent: async (items, customerInfo = {}) => {
    const result = await apiClient.post('/api/payments/create-intent', {
      items,
      customerInfo,
    })
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create payment intent')
    }
    
    return result.data
  },
}
