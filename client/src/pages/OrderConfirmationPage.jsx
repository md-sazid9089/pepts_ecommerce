'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { FaCheckCircle, FaTimes } from 'react-icons/fa'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()[0]
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading, success, error
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [orderId, setOrderId] = useState('')

  const s = {
    page: { minHeight: '100vh', padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    container: { textAlign: 'center' },
    iconSuccess: { fontSize: '4rem', color: '#10b981', marginBottom: '1rem' },
    iconError: { fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' },
    title: { fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' },
    subtitle: { fontSize: '1rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 },
    orderDetails: { 
      background: '#f8fafc', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #e2e8f0',
      textAlign: 'left'
    },
    detailRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.95rem' },
    detailRowLast: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.95rem' },
    label: { color: '#64748b', fontWeight: 500 },
    value: { color: '#0f172a', fontWeight: 600 },
    buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center' },
    button: { padding: '0.9rem 2rem', borderRadius: '0.75rem', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    buttonPrimary: { background: '#0f172a', color: '#fff' },
    buttonSecondary: { background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' },
    errorDetails: { background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.95rem' },
  }

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pi = searchParams.get('payment_intent')
        const cs = searchParams.get('payment_intent_client_secret')

        if (!pi || !cs) {
          setStatus('error')
          return
        }

        setPaymentIntentId(pi)

        // Use Stripe JS to verify the payment
        const stripe = await stripePromise
        if (!stripe) {
          setStatus('error')
          return
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(cs)

        if (paymentIntent.status === 'succeeded') {
          setPaymentStatus('succeeded')
          
          // Extract order ID from metadata if available
          const orderId = paymentIntent.metadata?.orderId || `#${pi.slice(-8).toUpperCase()}`
          setOrderId(orderId)
          setStatus('success')
        } else if (paymentIntent.status === 'processing') {
          setPaymentStatus('processing')
          setOrderId(`#${pi.slice(-8).toUpperCase()}`)
          setStatus('success')
        } else {
          setPaymentStatus(paymentIntent.status)
          setStatus('error')
        }
      } catch (err) {
        console.error('Payment verification error:', err)
        setStatus('error')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b' }}>Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'success' && paymentStatus === 'succeeded') {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <FaCheckCircle style={s.iconSuccess} />
          <h1 style={s.title}>Order Confirmed! 🎉</h1>
          <p style={s.subtitle}>
            Your payment was processed successfully and your order has been created.
          </p>

          <div style={s.orderDetails}>
            <div style={s.detailRow}>
              <span style={s.label}>Order ID:</span>
              <span style={s.value}>{orderId}</span>
            </div>
            <div style={s.detailRow}>
              <span style={s.label}>Payment Intent:</span>
              <span style={s.value}>{paymentIntentId.slice(-12)}</span>
            </div>
            <div style={s.detailRow}>
              <span style={s.label}>Status:</span>
              <span style={{ ...s.value, color: '#10b981' }}>✓ Paid</span>
            </div>
            <div style={s.detailRowLast}>
              <span style={s.label}>Next Steps:</span>
              <span style={s.value}>We'll contact you within 24 hours</span>
            </div>
          </div>

          <div style={s.buttonGroup}>
            <Link to="/products" style={{ ...s.button, ...s.buttonPrimary }}>
              Continue Shopping
            </Link>
            <Link to="/profile" style={{ ...s.button, ...s.buttonSecondary }}>
              View Order
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success' && paymentStatus === 'processing') {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h1 style={s.title}>Payment Processing</h1>
          <p style={s.subtitle}>
            Your payment is being processed. This may take a few minutes.
          </p>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Order ID: <strong>{orderId}</strong>
          </p>
          <div style={s.buttonGroup}>
            <button 
              onClick={() => window.location.reload()}
              style={{ ...s.button, ...s.buttonPrimary }}
            >
              Refresh Status
            </button>
            <Link to="/products" style={{ ...s.button, ...s.buttonSecondary }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div style={s.page}>
      <div style={s.container}>
        <FaTimes style={s.iconError} />
        <h1 style={s.title}>Payment Failed</h1>
        <p style={s.subtitle}>
          We couldn't complete your payment. Please try again or contact support.
        </p>

        {paymentStatus && (
          <div style={s.errorDetails}>
            <strong>Payment Status:</strong> {paymentStatus}
          </div>
        )}

        <div style={s.buttonGroup}>
          <button 
            onClick={() => navigate('/checkout')}
            style={{ ...s.button, ...s.buttonPrimary }}
          >
            ← Back to Checkout
          </button>
          <Link to="/contact" style={{ ...s.button, ...s.buttonSecondary }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
