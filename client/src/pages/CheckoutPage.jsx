'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { paymentsApi } from '@/services/api/payments.api'
import { ordersApi } from '@/services/api'

// Initialize Stripe promise
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ─── Payment Form Component ──────────────────────────────────────────────
function StripePaymentForm({ clientSecret, onSuccess, isLoading }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setErrorMsg('Payment system not loaded. Please refresh the page.')
      return
    }

    setIsProcessing(true)
    setErrorMsg('')

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      })

      if (error) {
        setErrorMsg(error.message || 'Payment processing failed')
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent)
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during payment')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMsg && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}>
          {errorMsg}
        </div>
      )}

      <PaymentElement />

      <button
        type="submit"
        disabled={isProcessing || isLoading || !stripe}
        style={{
          width: '100%',
          padding: '0.9rem',
          marginTop: '1.5rem',
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          borderRadius: '0.75rem',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: isProcessing || isLoading ? 'not-allowed' : 'pointer',
          opacity: isProcessing || isLoading ? 0.6 : 1,
        }}
      >
        {isProcessing ? 'Processing payment...' : isLoading ? 'Creating order...' : 'Pay now'}
      </button>
    </form>
  )
}

// ─── Main Checkout Page ──────────────────────────────────────────────────
export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, totalPrice, clearCart, moqViolations } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1=customer info, 2=payment, 3=processing
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    address: '',
  })

  const s = {
    page: { minHeight: '70vh', padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' },
    card: { background: '#F9F5F3', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem', marginTop: '1rem' },
    input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #f1f5f9' },
    orderItem: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' },
    total: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', padding: '1rem 0', marginTop: '0.5rem' },
    button: { width: '100%', padding: '0.9rem', marginTop: '1rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
    errorBox: { background: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#991b1b', marginBottom: '1rem', fontSize: '0.9rem' },
    warningBox: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#92400e', marginBottom: '1rem', fontSize: '0.875rem' },
    emptyText: { textAlign: 'center', paddingTop: '4rem' },
  }

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  // Step 1: Customer Info → Create Payment Intent
  const handleNextStep = async (e) => {
    e?.preventDefault?.()
    setError('')
    setIsSubmitting(true)

    if (!form.name || !form.email) {
      setError('Name and email are required')
      setIsSubmitting(false)
      return
    }

    try {
      const itemsForPayment = items.map(item => ({
        productId: String(item.id || item.productId),
        quantity: item.quantity,
        price: item.price,
      }))

      const result = await paymentsApi.createIntent(itemsForPayment, {
        name: form.name,
        email: form.email,
        company: form.company,
        address: form.address,
      })

      setClientSecret(result.clientSecret)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to create payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 2: Payment Success → Create Order
  const handlePaymentSuccess = async (paymentIntent) => {
    setStep(3)
    setIsSubmitting(true)

    try {
      await ordersApi.create({
        items: items.map(i => ({ productId: String(i.id || i.productId), quantity: i.quantity })),
        paymentIntentId: paymentIntent.id,
        contactName: form.name,
        contactEmail: form.email,
        companyName: form.company,
        shippingAddress: form.address,
      })

      clearCart()
      navigate(`/order-confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${clientSecret}`)
    } catch (err) {
      setError(err.message || 'Failed to create order')
      setStep(2)
      setIsSubmitting(false)
    }
  }

  // Empty cart check
  if (items.length === 0) {
    return (
      <div style={{ ...s.page, ...s.emptyText }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Add products before checkout</p>
        <Link to="/products" style={{ ...s.button, display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '0.75rem 2rem' }}>
          Continue Shopping
        </Link>
      </div>
    )
  }

  // MOQ Warnings
  const hasWarnings = moqViolations.length > 0

  return (
    <div style={s.page}>
      <h1 style={s.title}>Checkout</h1>

      {hasWarnings && (
        <div style={s.warningBox}>
          ⚠️ <strong>MOQ Warning:</strong> {moqViolations.map(v => `${v.title} requires min. ${v.moq} units`).join(', ')}
        </div>
      )}

      <div style={s.grid}>
        {/* Left: Customer Info + Payment */}
        <div style={s.card}>
          {step === 1 && (
            <>
              <div style={s.sectionTitle}>👤 Contact Information</div>
              {error && <div style={s.errorBox}>{error}</div>}

              <form onSubmit={handleNextStep}>
                <label style={s.label}>Full Name *</label>
                <input
                  style={s.input}
                  required
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="John Smith"
                />

                <label style={s.label}>Email *</label>
                <input
                  style={s.input}
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="buyer@company.com"
                />

                <label style={s.label}>Company Name</label>
                <input
                  style={s.input}
                  value={form.company}
                  onChange={handleChange('company')}
                  placeholder="Your Company Ltd."
                />

                <label style={s.label}>Shipping Address</label>
                <input
                  style={s.input}
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder="123 Business Avenue, City, Country"
                />

                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
                  💳 All prices in USD. Secure payment via Stripe.
                </p>

                <button
                  type="submit"
                  style={s.button}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : '→ Proceed to Payment'}
                </button>
              </form>
            </>
          )}

          {step === 2 && clientSecret && (
            <>
              <div style={s.sectionTitle}>💳 Payment Details</div>
              {error && <div style={s.errorBox}>{error}</div>}

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} isLoading={isSubmitting} />
              </Elements>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ color: '#64748b' }}>Processing your payment and creating order...</p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={s.card}>
          <div style={s.sectionTitle}>📋 Order Summary</div>
          {items.map(item => (
            <div key={item.id || item.productId} style={s.orderItem}>
              <span>{item.title || item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={s.total}>
            <span>Total (USD)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem', fontStyle: 'italic' }}>
            FOB — Freight charges calculated after order confirmation
          </p>
        </div>
      </div>
    </div>
  )
}

