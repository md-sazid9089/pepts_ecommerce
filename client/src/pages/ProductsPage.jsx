import { useState, useMemo, useEffect } from 'react';
import { products, categories, brands } from '@/data/products';
import ProductCard from '@/components/ProductCard/ProductCard';
import { FiSliders, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';

const styles = {
  container: {
    backgroundColor: '#F5EDEC',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  pageHeader: {
    backgroundColor: 'white',
    borderBottom: '3px solid #F7B9C4',
    padding: '30px 20px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#533638',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#A0AEC0',
    margin: 0,
  },
  searchBar: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    maxWidth: '500px',
    margin: '20px auto 0',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  searchBtn: {
    padding: '10px 20px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '20px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  filterCard: {
    backgroundColor: '#F5EDEC',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #F5EDEC',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#533638',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#533638',
  },
  filterSection: {
    marginBottom: '16px',
  },
  filterSectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#533638',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    fontSize: '13px',
    color: '#667C7F',
    cursor: 'pointer',
  },
  filterCheckbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#F7B9C4',
  },
  priceInputs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  priceInput: {
    padding: '8px',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '12px',
  },
  clearBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#F5EDEC',
    color: '#533638',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  topControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #F5EDEC',
  },
  filterSummary: {
    fontSize: '12px',
    color: '#667C7F',
  },
  sortControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  sortSelect: {
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  mobileFilterBtn: {
    display: 'flex',
    width: '100%',
    padding: '12px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    gap: '8px',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '10px',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #F5EDEC',
  },
  emptyText: {
    fontSize: '16px',
    color: '#A0AEC0',
    margin: '0 0 20px 0',
  },
  loadMoreBtn: {
    display: 'block',
    margin: '30px auto 0',
    padding: '12px 40px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  sidebarOverlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebarMobile: {
    display: 'none',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: 999,
    overflowY: 'auto',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
  },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [moqRange, setMoqRange] = useState({ min: 0, max: 500 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Inject responsive CSS
  useEffect(() => {
    const styleId = 'products-page-responsive';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @media (max-width: 1024px) {
          [data-products-grid] { grid-template-columns: repeat(3, 1fr) !important; }
          [data-content-wrapper] { grid-template-columns: 240px 1fr !important; }
        }
        @media (max-width: 768px) {
          [data-products-grid] { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          [data-content-wrapper] { grid-template-columns: 1fr !important; }
          [data-sidebar] { display: none !important; }
          [data-filter-btn] { display: flex !important; }
          [data-sidebar-mobile] { display: none !important; }
          [data-sidebar-mobile].active { display: block !important; }
          [data-sidebar-overlay].active { display: block !important; }
        }
        @media (max-width: 480px) {
          [data-products-grid] { grid-template-columns: 1fr !important; gap: 10px !important; }
          [data-page-header] { padding: 20px 12px !important; }
          [data-sort-control] { flex-direction: column !important; width: 100% !important; }
          [data-sort-select] { width: 100% !important; }
          [data-top-controls] { flex-direction: column !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price
    filtered = filtered.filter(p => {
      const price = p.price;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Filter by MOQ
    filtered = filtered.filter(p => {
      const moq = p.moq || 1;
      return moq >= moqRange.min && moq <= moqRange.max;
    });

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => {
        if (selectedTags.includes('New') && !p.isNew) return false;
        if (selectedTags.includes('Best Seller') && !p.isHot) return false;
        if (selectedTags.includes('Bulk Save') && !p.tieredPricing) return false;
        return true;
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
      default:
        return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, moqRange, inStockOnly, selectedTags, sortBy]);

  const visibleProducts = displayedProducts.slice(0, displayCount);
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 10000 });
    setMoqRange({ min: 0, max: 500 });
    setInStockOnly(false);
    setSelectedTags([]);
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader} data-page-header>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>All Products</h1>
          <p style={styles.subtitle}>
            Showing {visibleProducts.length} of {displayedProducts.length} items
          </p>
          
          {/* Global Search */}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchBtn}>
              <FiSearch style={{ display: 'inline', marginRight: '4px' }} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          style={styles.sidebarOverlay}
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Content */}
      <div style={styles.contentWrapper}>
        {/* Sidebar Filters */}
        <aside style={{...styles.sidebar, ...(showFilters ? { display: 'grid' } : {})}}>
          <div style={{...styles.sidebarMobile, ...(showFilters ? { display: 'block' } : {})}}>
            <div style={styles.filterCard}>
              <div style={styles.filterHeader}>
                <h3 style={styles.filterTitle}>
                  <FiSliders size={16} />
                  Filters
                </h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  style={{...styles.closeBtn, display: showFilters ? 'block' : 'none'}}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Categories Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Categories</h4>
                {uniqueCategories.map(cat => (
                  <label key={cat} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.filterCheckbox}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>

              {/* Price Range Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Price Range</h4>
                <div style={styles.priceInputs}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    style={styles.priceInput}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                    style={styles.priceInput}
                  />
                </div>
              </div>

              {/* MOQ Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Minimum Order (MOQ)</h4>
                <div style={styles.priceInputs}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={moqRange.min}
                    onChange={(e) => setMoqRange({ ...moqRange, min: parseInt(e.target.value) || 0 })}
                    style={styles.priceInput}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={moqRange.max}
                    onChange={(e) => setMoqRange({ ...moqRange, max: parseInt(e.target.value) || 500 })}
                    style={styles.priceInput}
                  />
                </div>
              </div>

              {/* Brands Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Brands</h4>
                {uniqueBrands.slice(0, 8).map(brand => (
                  <label key={brand} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.filterCheckbox}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>

              {/* Availability Filter */}
              <div style={styles.filterSection}>
                <label style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.filterCheckbox}
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  In Stock Only
                </label>
              </div>

              {/* Tags Filter */}
              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>Special Tags</h4>
                {['New', 'Best Seller', 'Bulk Save'].map(tag => (
                  <label key={tag} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.filterCheckbox}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>

              {/* Clear Filters */}
              <button 
                onClick={handleClearFilters}
                style={styles.clearBtn}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div style={{...styles.filterCard, display: showFilters ? 'none' : 'block'}}>
            <div style={styles.filterHeader}>
              <h3 style={styles.filterTitle}>
                <FiSliders size={16} />
                Filters
              </h3>
            </div>

            {/* Categories Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Categories</h4>
              {uniqueCategories.map(cat => (
                <label key={cat} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.filterCheckbox}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Price Range Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Price Range</h4>
              <div style={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  style={styles.priceInput}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                  style={styles.priceInput}
                />
              </div>
            </div>

            {/* MOQ Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Minimum Order (MOQ)</h4>
              <div style={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={moqRange.min}
                  onChange={(e) => setMoqRange({ ...moqRange, min: parseInt(e.target.value) || 0 })}
                  style={styles.priceInput}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={moqRange.max}
                  onChange={(e) => setMoqRange({ ...moqRange, max: parseInt(e.target.value) || 500 })}
                  style={styles.priceInput}
                />
              </div>
            </div>

            {/* Brands Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Brands</h4>
              {uniqueBrands.slice(0, 8).map(brand => (
                <label key={brand} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.filterCheckbox}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>

            {/* Availability Filter */}
            <div style={styles.filterSection}>
              <label style={styles.filterOption}>
                <input
                  type="checkbox"
                  style={styles.filterCheckbox}
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                />
                In Stock Only
              </label>
            </div>

            {/* Tags Filter */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Special Tags</h4>
              {['New', 'Best Seller', 'Bulk Save'].map(tag => (
                <label key={tag} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.filterCheckbox}
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>

            {/* Clear Filters */}
            <button 
              onClick={handleClearFilters}
              style={styles.clearBtn}
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{...styles.mobileFilterBtn, display: 'flex'}}
          >
            <FiSliders size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Top Controls */}
          <div style={styles.topControls}>
            <div style={styles.filterSummary}>
              {displayedProducts.length} products found
            </div>
            <div style={styles.sortControl}>
              <span>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {visibleProducts.length > 0 ? (
            <>
              <div style={styles.grid}>
                {visibleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {displayCount < displayedProducts.length && (
                <button 
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  style={styles.loadMoreBtn}
                >
                  Load More
                </button>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>ðŸ˜ž No products match your filters</p>
              <button 
                onClick={handleClearFilters}
                style={styles.clearBtn}
              >
                Clear Filters and Try Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
