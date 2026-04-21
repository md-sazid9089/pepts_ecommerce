// // import Image from 'next/image'; // Use <img> instead // Use <img> instead
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext';
import { FiX, FiTrash2, FiShoppingBag, FiPlus, FiMinus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { formatPrice } from '@/data/products';


export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, savings, moqViolations, isValidOrder } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>
            <FiShoppingBag size={20} />
            <h2>My Cart</h2>
            <span className={styles.itemCount}>{totalItems}</span>
          </div>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FiShoppingBag size={48} /></div>
              <p className="empty-state-title">Your cart is empty</p>
              <p className="empty-state-desc">Add products to your cart and they&apos;ll appear here.</p>
              <button onClick={closeCart} className="btn btn-primary">Start Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <Image src={item.image} alt={item.name} className={styles.itemImg} width={100} height={100} loading="lazy" />
                <div className={styles.itemInfo}>
                  <Link href={`/product/${item.id}`} onClick={closeCart} className={styles.itemName}>
                    {item.name}
                  </Link>
                  
                  {/* MOQ Warning - B2B */}
                  {item.moq && item.quantity < item.moq && (
                    <div className={styles.moqWarning}>
                      âš ï¸ Need {item.moq - item.quantity} more units (MOQ: {item.moq})
                    </div>
                  )}
                  
                  <div className={styles.itemPrice}>
                    <span className={styles.price}>{formatPrice(item.price)}</span>
                    <span className={styles.origPrice}>{formatPrice(item.originalPrice)}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.qtyControl}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.removeBtn}
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className={styles.sidebarFooter}>
            {/* MOQ Violation Alert - B2B */}
            {!isValidOrder && moqViolations.length > 0 && (
              <div className={styles.moqAlert}>
                <FiAlertCircle size={20} />
                <div>
                  <strong>MOQ Not Met</strong>
                  <p>Items: {moqViolations.map(v => v.name).join(', ')}</p>
                </div>
              </div>
            )}
            
            {savings > 0 && (
              <div className={styles.savingsRow}>
                <span><FiCheckCircle size={16} style={{marginRight: '4px'}} /> You&apos;re saving</span>
                <span className={styles.savingsAmt}>{formatPrice(savings)}</span>
              </div>
            )}

            {/* B2B: Next Tier Preview */}
            {items.length > 0 && items.some(item => item.tieredPricing) && (
              <div className={styles.nextTierPreview}>
                <p className={styles.nextTierTitle}>Unlock Bulk Savings:</p>
                {items
                  .filter(item => item.tieredPricing)
                  .map(item => {
                    const nextTier = item.tieredPricing?.find(t => t.min > item.quantity);
                    if (nextTier && item.quantity < nextTier.min) {
                      const itemsNeeded = nextTier.min - item.quantity;
                      const savingsAtNextTier = (item.price - nextTier.price) * nextTier.min;
                      return (
                        <div key={item.id} className={styles.tierInfo}>
                          <small>Add {itemsNeeded} more {item.name.substring(0, 15)}... â†’ ${nextTier.price}/unit</small>
                          <small className={styles.tierSavings}>Save ${Math.round(savingsAtNextTier)}</small>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span className={styles.totalAmt}>{formatPrice(totalPrice)}</span>
            </div>
            <p className={styles.shippingNote}>Shipping & taxes calculated at checkout</p>
            <div className={styles.sidebarBtns}>
              <Link href="/cart" onClick={closeCart} className="btn btn-outline btn-full">
                View Cart
              </Link>
              <Link 
                href={isValidOrder ? "/checkout" : "#"}
                onClick={(e) => {
                  if (!isValidOrder) {
                    e.preventDefault();
                  } else {
                    closeCart();
                  }
                }}
                className={`btn btn-primary btn-full ${!isValidOrder ? styles.checkoutDisabled : ''}`}
              >
                {isValidOrder ? 'Checkout â†’' : 'Increase Quantities'}
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}




