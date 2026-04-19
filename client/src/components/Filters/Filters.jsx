'use client';

import { useState } from 'react';
import { categories, brands } from '@/data/products';
import { 
  FiSliders, FiX, FiChevronDown, FiChevronUp, FiStar,
  FiSmartphone, FiShoppingBag, FiHome, FiBox
} from 'react-icons/fi';
import { FaPalette, FaFootballBall } from 'react-icons/fa';
import styles from './Filters.module.css';

// Map icon names to actual icon components
const iconMap = {
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiBox,
  FaPalette,
  FaFootballBall,
};

export default function Filters({ filters, onChange, onReset, productCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sections, setSections] = useState({ category: true, price: true, brand: true, rating: true });

  const toggleSection = (key) => setSections(s => ({ ...s, [key]: !s[key] }));

  const FilterContent = () => (
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
              <span className={styles.priceSep}>—</span>
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
              { label: '$1,000 – $5,000', min: 1000, max: 5000 },
              { label: '$5,000 – $20,000', min: 5000, max: 20000 },
              { label: '$20,000 – $50,000', min: 20000, max: 50000 },
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
        <FilterContent />
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
            <FilterContent />
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
