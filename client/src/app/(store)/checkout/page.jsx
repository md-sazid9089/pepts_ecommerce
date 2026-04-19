'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiCheck, FiMapPin, FiCreditCard, FiPackage, FiSmartphone, FiDollarSign, FiShoppingCart, FiGift, FiMail } from 'react-icons/fi';
import styles from './page.module.css';

const STEPS = [
  { id: 1, label: 'Shipping', icon: FiMapPin },
  { id: 2, label: 'Payment', icon: FiCreditCard },
  { id: 3, label: 'Review', icon: FiPackage },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard },
  { id: 'bkash', label: 'bKash', icon: FiSmartphone },
  { id: 'nagad', label: 'Nagad', icon: FiSmartphone },
  { id: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
];

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, savings, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => 'PPW-' + Math.floor(Math.random() * 900000 + 100000));

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', division: '', zip: '',
  });
  const [payment, setPayment] = useState({ method: 'cod', cardNum: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const shippingFee = totalPrice > 999 ? 0 : 80;
  const finalTotal = totalPrice + shippingFee;

  const handleShippingChange = (e) => {
    setShipping(s => ({ ...s, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validateShipping = () => {
    const errs = {};
    if (!shipping.firstName.trim()) errs.firstName = 'Required';
    if (!shipping.lastName.trim()) errs.lastName = 'Required';
    if (!shipping.phone.trim()) errs.phone = 'Required';
    if (!shipping.email.trim()) errs.email = 'Required';
    if (!shipping.address.trim()) errs.address = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.division.trim()) errs.division = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateShipping()) return;
    if (step < 3) setStep(s => s + 1);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className={styles.successWrap}>
            <div className={styles.successIcon}><FiGift size={64} /></div>
            <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
            <p className={styles.successOrder}>Order ID: <strong>{orderNumber}</strong></p>
            <p className={styles.successMsg}>
              Thank you for your order! We&apos;ll send you a confirmation email and your items will be delivered within 2–5 business days.
            </p>
            <div className={styles.successSteps}>
              {['Order Confirmed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
                <div key={s} className={`${styles.successStep} ${i < 2 ? styles.successStepDone : ''}`}>
                  <div className={styles.successStepDot}>{i < 2 ? <FiCheck size={14} /> : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className={styles.successBtns}>
              <Link href="/" className="btn btn-primary btn-lg">Continue Shopping</Link>
              <Link href="/products" className="btn btn-outline btn-lg">Explore More</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon"><FiShoppingCart size={64} /></div>
            <h1 className="empty-state-title">Nothing to Checkout</h1>
            <p className="empty-state-desc">Add items to your cart first.</p>
            <Link href="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link> <span>&rsaquo;</span>
          <Link href="/cart">Cart</Link> <span>&rsaquo;</span>
          <span>Checkout</span>
        </nav>

        <h1 className={styles.pageTitle}>Checkout</h1>

        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={styles.stepWrap}>
              <div className={`${styles.step} ${step >= s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}>
                <div className={styles.stepCircle}>
                  {step > s.id ? <FiCheck size={16} /> : <s.icon size={16} />}
                </div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${step > s.id ? styles.stepLineDone : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className={styles.checkoutLayout}>
          {/* Form area */}
          <div className={styles.formArea}>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>
                  <FiMapPin className={styles.formIcon} /> Shipping Information
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input id="firstName" name="firstName" className={`${styles.formInput} ${errors.firstName ? styles.inputError : ''}`}
                      value={shipping.firstName} onChange={handleShippingChange} placeholder="Rahim" />
                    {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input id="lastName" name="lastName" className={`${styles.formInput} ${errors.lastName ? styles.inputError : ''}`}
                      value={shipping.lastName} onChange={handleShippingChange} placeholder="Khan" />
                    {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                      value={shipping.phone} onChange={handleShippingChange} placeholder="+880 1700-000000" />
                    {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                      value={shipping.email} onChange={handleShippingChange} placeholder="rahim@example.com" />
                    {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="address">Street Address *</label>
                    <input id="address" name="address" className={`${styles.formInput} ${errors.address ? styles.inputError : ''}`}
                      value={shipping.address} onChange={handleShippingChange} placeholder="House #, Road #, Area" />
                    {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City *</label>
                    <input id="city" name="city" className={`${styles.formInput} ${errors.city ? styles.inputError : ''}`}
                      value={shipping.city} onChange={handleShippingChange} placeholder="Dhaka" />
                    {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="division">Division *</label>
                    <select id="division" name="division" className={`${styles.formInput} ${errors.division ? styles.inputError : ''}`}
                      value={shipping.division} onChange={handleShippingChange}>
                      <option value="">Select Division</option>
                      {['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.division && <span className={styles.errorMsg}>{errors.division}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="zip">ZIP Code</label>
                    <input id="zip" name="zip" className={styles.formInput}
                      value={shipping.zip} onChange={handleShippingChange} placeholder="1200" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>
                  <FiCreditCard className={styles.formIcon} /> Payment Method
                </h2>
                <div className={styles.paymentMethods}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`${styles.payMethod} ${payment.method === m.id ? styles.payMethodActive : ''}`}>
                      <input type="radio" name="payment" value={m.id}
                        checked={payment.method === m.id}
                        onChange={() => setPayment(p => ({ ...p, method: m.id }))} />
                      <span className={styles.payMethodIcon}><m.icon size={20} /></span>
                      <span className={styles.payMethodLabel}>{m.label}</span>
                      {payment.method === m.id && <FiCheck className={styles.payCheck} size={16} />}
                    </label>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className={styles.cardFields}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="cardNum">Card Number</label>
                      <input id="cardNum" className={styles.formInput} placeholder="1234 5678 9012 3456"
                        value={payment.cardNum}
                        onChange={e => setPayment(p => ({ ...p, cardNum: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="expiry">Expiry Date</label>
                      <input id="expiry" className={styles.formInput} placeholder="MM / YY"
                        value={payment.expiry}
                        onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="cvv">CVV</label>
                      <input id="cvv" className={styles.formInput} type="password" placeholder="•••"
                        value={payment.cvv}
                        onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} />
                    </div>
                  </div>
                )}

                {payment.method === 'cod' && (
                  <div className={styles.codNote}>
                    <FiDollarSign size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> <strong>Cash on Delivery</strong> — Pay with cash when your order arrives. Extra $80 COD fee may apply.
                  </div>
                )}

                <div className={styles.secureNote}>
                  🔒 Your payment information is encrypted and secure. We never store card details.
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>
                  <FiPackage className={styles.formIcon} /> Review Your Order
                </h2>

                {/* Shipping summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHeader}>
                    <span><FiMapPin size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Shipping To</span>
                    <button onClick={() => setStep(1)} className={styles.editBtn}>Edit</button>
                  </div>
                  <p className={styles.reviewText}>
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}, {shipping.city}, {shipping.division}<br />
                    <FiSmartphone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {shipping.phone} · <FiMail size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {shipping.email}
                  </p>
                </div>

                {/* Payment summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHeader}>
                    <span>💳 Payment Method</span>
                    <button onClick={() => setStep(2)} className={styles.editBtn}>Edit</button>
                  </div>
                  <p className={styles.reviewText}>
                    {PAYMENT_METHODS.find(m => m.id === payment.method)?.icon}{' '}
                    {PAYMENT_METHODS.find(m => m.id === payment.method)?.label}
                  </p>
                </div>

                {/* Items summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHeader}><span><FiPackage style={{marginRight:'8px'}} /> Items ({totalItems})</span></div>
                  <div className={styles.reviewItems}>
                    {items.map(item => (
                      <div key={item.id} className={styles.reviewItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className={styles.reviewItemImg} />
                        <div className={styles.reviewItemInfo}>
                          <p className={styles.reviewItemName}>{item.name}</p>
                          <p className={styles.reviewItemMeta}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className={styles.reviewItemTotal}>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={styles.navBtns}>
              {step > 1 && (
                <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button className="btn btn-primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
                  Continue →
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} id="place-order-btn"
                  style={{ marginLeft: 'auto', background: 'var(--success)', fontSize: '1rem' }}>
                  🎉 Place Order — {formatPrice(finalTotal)}
                </button>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryItems}>
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className={styles.summaryItemImg} />
                      <span className={styles.summaryItemQty}>{item.quantity}</span>
                    </div>
                    <span className={styles.summaryItemName}>{item.name.substring(0, 28)}…</span>
                    <span className={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className={styles.moreItems}>+{items.length - 3} more item(s)</p>
                )}
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                {savings > 0 && (
                  <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
                    <span>Savings</span><span>−{formatPrice(savings)}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? styles.free : ''}>
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
