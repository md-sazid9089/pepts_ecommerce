'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { products, categories } from '@/data/products';
import { FiFilter, FiArrowLeft, FiX, FiStar, FiSearch } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './Search.module.css';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '999999');
  
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search query filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Price filter
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // relevant
        result.sort((a, b) => b.isFeatured - a.isFeatured);
    }

    return result;
  }, [query, category, minPrice, maxPrice, sortBy]);

  const handleQuickView = (product) => {
    // Opens quick view modal for the product
    // Future implementation: modal state managementoduct
    // Future implementation: modal state management
  };

  const buildFilterUrl = (newParams) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (minPrice > 0) params.set('minPrice', minPrice);
    if (maxPrice < 999999) params.set('maxPrice', maxPrice);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return `/search?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <FiArrowLeft size={20} /> Back
        </Link>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {query ? `Search Results for "${query}"` : 'Browse Products'}
          </h1>
          <p className={styles.resultCount}>Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Filters Sidebar */}
        <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>Filters</h3>
            <button
              className={styles.closeFilters}
              onClick={() => setShowFilters(false)}
            >
              <FiX />
            </button>
          </div>

          {/* Category Filter */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Category</h4>
            <div className={styles.filterOptions}>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={buildFilterUrl({ category: cat.id })}
                  className={`${styles.filterOption} ${category === cat.id ? styles.active : ''}`}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Price Range</h4>
            <div className={styles.priceOptions}>
              {[
                { label: 'Under $10,000', min: 0, max: 10000 },
                { label: '$10,000 - $50,000', min: 10000, max: 50000 },
                { label: '$50,000 - $100,000', min: 50000, max: 100000 },
                { label: 'Above $100,000', min: 100000, max: 999999 },
              ].map((range, idx) => (
                <Link
                  key={idx}
                  href={buildFilterUrl({ minPrice: range.min, maxPrice: range.max })}
                  className={`${styles.priceOption} ${
                    minPrice === range.min && maxPrice === range.max ? styles.active : ''
                  }`}
                >
                  {range.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Rating</h4>
            <div className={styles.ratingOptions}>
              {[4.5, 4, 3.5, 3].map(rating => (
                <div key={rating} className={styles.ratingOption}>
                  <span style={{color: '#FFC107', marginRight: '4px'}}>
                    {[...Array(Math.floor(rating))].map((_, i) => <FiStar key={i} fill="currentColor" size={12} />)}
                  </span> {rating}+
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Sort Bar */}
          <div className={styles.sortBar}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={18} /> Filters
            </button>
            <div className={styles.sortSelect}>
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.select}
              >
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className={styles.grid}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}><FiSearch size={48} /></div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <Link href="/products" className={styles.noResultsBtn}>
                View All Products
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
