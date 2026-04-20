'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiTag, FiBox, FiCheckCircle, FiTruck, FiRefreshCw, FiShoppingCart, FiZap, FiCheck, FiGift, FiArrowRight } from 'react-icons/fi';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, subtotal, savings, clearCart } = useCart();

  const shipping = totalPrice > 999 ? 0 : 80;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className={styles.emptyIcon}><FiShoppingCart size={48} /></div>
            <h1 className="empty-state-title">Your Cart is Empty</h1>
            <p className="empty-state-desc">Looks like you haven&apos;t added anything yet. Start shopping and find amazing deals!</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              <FiShoppingBag size={18} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className={styles.cartHeader}>
          <Link href="/products" className={styles.backLink}>
            <FiArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 className={styles.cartTitle}>
            Shopping Cart <span className={styles.cartCount}>({totalItems} items)</span>
          </h1>
          <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>
        </div>

        <div className={styles.cartLayout}>
          {/* Cart items */}
          <div className={styles.cartItems}>
            {/* Select all bar */}
            <div className={styles.itemsBar}>
              <span className={styles.itemsBarTitle}><FiBox size={14} /> Products ({totalItems})</span>
            </div>

            {items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <Link href={`/product/${item.id}`} className={styles.itemImgWrap}>
                  <Image src={item.image} alt={item.name} className={styles.itemImg} width={120} height={120} loading="lazy" />
                </Link>

                <div className={styles.itemDetails}>
                  <div className={styles.itemTop}>
                    <div>
                      <p className={styles.itemBrand}>{item.brand}</p>
                      <Link href={`/product/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      {item.stock < 20 && (
                        <p className={styles.itemStock}><FiZap size={10} /> Only {item.stock} left</p>
                      )}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className={styles.itemBottom}>
                    <div className={styles.itemPrices}>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className={styles.itemOrigPrice}>{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>

                    <div className={styles.qtyControl}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <div className={styles.itemSubtotal}>
                      <span className={styles.subtotalLabel}>Subtotal</span>
                      <span className={styles.subtotalAmt}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              {/* Coupon */}
              <div className={styles.couponRow}>
                <div className={styles.couponInput}>
                  <FiTag size={15} className={styles.couponIcon} />
                  <input type="text" placeholder="Enter coupon code" id="coupon-input" />
                </div>
                <button className={styles.couponBtn}>Apply</button>
              </div>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
                    <span><FiGift size={14} /> Product Discount</span>
                    <span>−{formatPrice(savings)}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? styles.freeShip : ''}>
                    {shipping === 0 ? <><FiCheck size={14} /> FREE</> : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className={styles.freeShipNote}>
                    Add {formatPrice(999 - totalPrice)} more for Free Shipping!
                  </p>
                )}
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>{formatPrice(finalTotal)}</span>
              </div>

              {savings > 0 && (
                <div className={styles.youSave}>
                  <FiGift /> You save <strong>{formatPrice(savings)}</strong> on this order!
                </div>
              )}

              <Link href="/checkout" className={`btn btn-primary btn-full btn-lg ${styles.checkoutBtn}`} id="proceed-checkout">
                Proceed to Checkout <FiArrowRight size={14} />
              </Link>

              <div className={styles.paymentIcons}>
                <p className={styles.payLabel}>Secure payment with:</p>
                <div className={styles.payBadges}>
                  {['Visa', 'MasterCard', 'bKash', 'Nagad', 'COD'].map(m => (
                    <span key={m} className={styles.payBadge}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className={styles.trustBadges}>
              {[
                { icon: <FiCheckCircle />, text: '100% Secure Checkout' },
                { icon: <FiTruck />, text: 'Fast & Free Delivery' },
                { icon: <FiRefreshCw />, text: '30-Day Easy Returns' },
              ].map(b => (
                <div key={b.text} className={styles.trustItem}>
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
