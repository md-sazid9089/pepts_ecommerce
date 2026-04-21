import { useState } from 'react';
import { categories, brands } from '@/data/products';
import { 
  FiSliders, FiX, FiChevronDown, FiChevronUp, FiStar,
  FiSmartphone, FiShoppingBag, FiHome, FiBox
} from 'react-icons/fi';
import { FaPalette, FaFootballBall } from 'react-icons/fa';

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  resetBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    cursor: 'pointer',
    textAlign: 'left',
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  filterOptionActive: {
    backgroundColor: '#f0f3ff',
    color: '#667eea',
    fontWeight: '600',
  },
  filterCount: {
    marginLeft: 'auto',
    backgroundColor: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  priceInputs: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontFamily: 'inherit',
  },
  priceSep: {
    color: '#d1d5db',
    fontWeight: '600',
  },
  priceSlider: {
    width: '100%',
    height: '4px',
    borderRadius: '4px',
    background: '#e5e7eb',
    outline: 'none',
  },
  priceRange: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  starRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  mobileTrigger: {
    display: 'none',
    width: '100%',
    padding: '10px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  activeIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'none',
    zIndex: 40,
  },
  sidebarOpen: {
    display: 'flex',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '300px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    zIndex: 50,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
  },
  drawerFooter: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
  },
};

// Map icon names to actual icon components
const iconMap = {
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiBox,
  FaPalette,
  FaFootballBall,
};

// Separate component to avoid "Cannot create components during render" lint error
const FilterContent = ({ 
  filters, 
  onChange, 
  onReset, 
  productCount, 
  sections, 
  toggleSection 
}) => (
  <div className={styles.content}>
    {/* Reset */}
    <div className={styles.filterHeader}>
      <div className={styles.filterTitle}>
        <FiSliders size={16} />
        <span>Filters</span>
      </div>
      <button onClick={onReset} className={styles.resetBtn}>Clear All</button>
    </div>

    {/* Category */}
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => toggleSection('category')}>
        <span>Category</span>
        {sections.category ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {sections.category && (
        <div className={styles.sectionBody}>
          <label className={`${styles.filterOption} ${!filters.category ? styles.filterOptionActive : ''}`}>
            <input type="radio" name="category" value="" checked={!filters.category}
              onChange={() => onChange('category', '')} />
            All Categories
            <span className={styles.filterCount}>{productCount}</span>
          </label>
          {categories.map(cat => {
            const IconComponent = iconMap[cat.icon];
            return (
              <label key={cat.id} className={`${styles.filterOption} ${filters.category === cat.id ? styles.filterOptionActive : ''}`}>
                <input type="radio" name="category" value={cat.id}
                  checked={filters.category === cat.id}
                  onChange={() => onChange('category', cat.id)} />
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {IconComponent && <IconComponent size={14} />}
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>

    {/* Price Range */}
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => toggleSection('price')}>
        <span>Price Range</span>
        {sections.price ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {sections.price && (
        <div className={styles.sectionBody}>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={e => onChange('minPrice', e.target.value)}
              className={styles.priceInput}
              id="filter-min-price"
              min="0"
            />
            <span className={styles.priceSep}>â€”</span>
            <input
              type="number"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={e => onChange('maxPrice', e.target.value)}
              className={styles.priceInput}
              id="filter-max-price"
              min="0"
            />
          </div>
          <input
            type="range"
            min="0"
            max="250000"
            step="1000"
            value={filters.maxPrice || 250000}
            onChange={e => onChange('maxPrice', e.target.value)}
            className={styles.priceSlider}
            id="filter-price-slider"
          />
          <div className={styles.priceRange}>
            <span>$0</span><span>$2,50,000</span>
          </div>
          {[
            { label: 'Under $1,000', min: 0, max: 1000 },
            { label: '$1,000 â€“ $5,000', min: 1000, max: 5000 },
            { label: '$5,000 â€“ $20,000', min: 5000, max: 20000 },
            { label: '$20,000 â€“ $50,000', min: 20000, max: 50000 },
            { label: 'Over $50,000', min: 50000, max: '' },
          ].map(range => (
            <label key={range.label} className={styles.filterOption}>
              <input type="radio" name="priceRange"
                checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                onChange={() => { onChange('minPrice', range.min); onChange('maxPrice', range.max); }} />
              {range.label}
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Brand */}
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => toggleSection('brand')}>
        <span>Brand</span>
        {sections.brand ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {sections.brand && (
        <div className={styles.sectionBody}>
          {brands.map(brand => (
            <label key={brand} className={styles.checkOption}>
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) || false}
                onChange={e => {
                  const current = filters.brands || [];
                  if (e.target.checked) onChange('brands', [...current, brand]);
                  else onChange('brands', current.filter(b => b !== brand));
                }}
              />
              {brand}
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Rating */}
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => toggleSection('rating')}>
        <span>Min Rating</span>
        {sections.rating ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {sections.rating && (
        <div className={styles.sectionBody}>
          {[4, 3, 2, 1].map(r => (
            <label key={r} className={`${styles.filterOption} ${filters.minRating == r ? styles.filterOptionActive : ''}`}>
              <input type="radio" name="rating" value={r}
                checked={filters.minRating == r}
                onChange={() => onChange('minRating', r)} />
              <span className={styles.starRow}>
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} size={13} fill={i <= r ? '#FFD700' : 'none'}
                    stroke={i <= r ? '#FFD700' : '#ccc'} />
                ))}
                <span>& Up</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function Filters({ filters, onChange, onReset, productCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sections, setSections] = useState({ category: true, price: true, brand: true, rating: true });

  const toggleSection = (key) => setSections(s => ({ ...s, [key]: !s[key] }));

  const contentProps = {
    filters,
    onChange,
    onReset,
    productCount,
    sections,
    toggleSection
  };

  return (
    <>
      {/* Mobile trigger */}
      <button className={styles.mobileTrigger} onClick={() => setMobileOpen(true)} id="open-filters-btn">
        <FiSliders size={16} /> Filters
        {(filters.category || filters.minPrice || filters.maxPrice || filters.minRating || filters.brands?.length) && (
          <span className={styles.activeIndicator} />
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className={styles.sidebar}>
        <FilterContent {...contentProps} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="overlay" onClick={() => setMobileOpen(false)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <span>Filters</span>
              <button onClick={() => setMobileOpen(false)}><FiX size={20} /></button>
            </div>
            <FilterContent {...contentProps} />
            <div className={styles.drawerFooter}>
              <button onClick={() => { onReset(); setMobileOpen(false); }} className="btn btn-outline btn-full">Clear All</button>
              <button onClick={() => setMobileOpen(false)} className="btn btn-primary btn-full">
                Show {productCount} Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

