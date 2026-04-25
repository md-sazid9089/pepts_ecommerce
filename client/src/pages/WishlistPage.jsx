import { Link } from 'react-router-dom'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product) => {
    addItem(product, product.moq || 1)
    removeFromWishlist(product.id)
  }

  const s = {
    page: { minHeight: '60vh', padding: '2rem 1.5rem', maxWidth: 1100, margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: '#533638', margin: 0 },
    clearBtn: { padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' },
    empty: { textAlign: 'center', padding: '4rem 1rem' },
    emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
    emptyTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#533638', marginBottom: '0.5rem' },
    emptyText: { color: '#6b7280', marginBottom: '1.5rem' },
    browseBtn: { display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '0.75rem', background: '#533638', color: '#fff', fontWeight: 600, textDecoration: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    card: { background: '#fff', borderRadius: '1rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' },
    cardImg: { width: '100%', height: 200, objectFit: 'cover', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#9ca3af' },
    cardBody: { padding: '1rem' },
    cardTitle: { fontWeight: 700, color: '#111827', marginBottom: '0.25rem', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    cardPrice: { color: '#533638', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' },
    cardActions: { display: 'flex', gap: '0.5rem' },
    addBtn: { flex: 1, padding: '0.6rem', borderRadius: '0.5rem', background: '#533638', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' },
    removeBtn: { padding: '0.6rem 0.75rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' },
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>❤️ My Wishlist {items.length > 0 && <span style={{ fontSize: '1rem', fontWeight: 500, color: '#6b7280' }}>({items.length} items)</span>}</h1>
        {items.length > 0 && (
          <button style={s.clearBtn} onClick={clearWishlist}>Clear All</button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>💔</div>
          <h2 style={s.emptyTitle}>Your wishlist is empty</h2>
          <p style={s.emptyText}>Save products you love and come back to them later.</p>
          <Link to="/products" style={s.browseBtn}>Browse Products</Link>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((product) => (
            <div key={product.id} style={s.card}>
              <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                ) : (
                  <div style={s.cardImg}>🖼️</div>
                )}
              </Link>
              <div style={s.cardBody}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={s.cardTitle}>{product.title || product.name}</div>
                </Link>
                <div style={s.cardPrice}>${(product.price || 0).toFixed(2)}</div>
                {product.moq && (
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.75rem' }}>MOQ: {product.moq} units</div>
                )}
                <div style={s.cardActions}>
                  <button style={s.addBtn} onClick={() => handleAddToCart(product)}>
                    🛒 Add to Cart
                  </button>
                  <button style={s.removeBtn} onClick={() => removeFromWishlist(product.id)} title="Remove">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
