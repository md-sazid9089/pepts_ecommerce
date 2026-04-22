import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch, FaFilter, FaTimes, FaChevronRight, FaBox, FaStar } from "react-icons/fa"

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },

  // Hero Banner
  heroBanner: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    color: "#ffffff",
    padding: "4rem 2rem",
    textAlign: "center",
    marginBottom: "3rem",
    position: "relative",
    overflow: "hidden",
  },
  heroBannerContent: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  heroBannerTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    margin: "0 0 1rem 0",
    letterSpacing: "0.5px",
  },
  heroBannerSubtitle: {
    fontSize: "1.125rem",
    color: "#e2e8f0",
    margin: 0,
    fontWeight: 400,
  },

  // Breadcrumb
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#94a3b8",
    marginBottom: "1.5rem",
    justifyContent: "center",
  },
  breadcrumbItem: {
    color: "#94a3b8",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  breadcrumbItemHover: {
    color: "#ffffff",
  },
  breadcrumbActive: {
    color: "#ffffff",
    fontWeight: 600,
  },

  // Main Container
  mainContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 1.5rem 3rem 1.5rem",
  },
  mainContainerMobile: {
    gridTemplateColumns: "1fr",
    gap: "1rem",
  },

  // Sidebar
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  sidebarMobile: {
    display: "none",
  },
  sidebarMobileOpen: {
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 40,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  sidebarContent: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    width: "100%",
  },
  sidebarMobileContent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    maxWidth: "300px",
    height: "100vh",
    overflowY: "auto",
    background: "#ffffff",
    padding: "1.5rem 1rem",
    zIndex: 41,
  },

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  sidebarTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#6b7280",
    display: "none",
    padding: 0,
  },
  closeBtnShow: {
    display: "flex",
  },

  filterGroup: {
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  filterGroupLast: {
    borderBottom: "none",
  },
  filterLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
  },
  filterOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  filterCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  filterCheckboxInput: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
    accentColor: "#1e293b",
  },
  filterCheckboxLabel: {
    fontSize: "0.875rem",
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
    flex: 1,
  },

  // Content Area
  contentArea: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },

  // Top Controls
  topControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "1rem",
    flexWrap: "wrap",
  },
  topControlsMobile: {
    flexWrap: "wrap",
  },

  searchBox: {
    position: "relative",
    flex: 0,
    minWidth: "300px",
  },
  searchIcon: {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "0.625rem 0.75rem 0.625rem 2.25rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  searchInputFocus: {
    borderColor: "#1e293b",
    boxShadow: "0 0 0 3px rgba(30, 41, 59, 0.1)",
  },

  filterToggle: {
    display: "none",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 500,
    color: "#111827",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  filterToggleMobile: {
    display: "flex",
  },
  filterToggleHover: {
    borderColor: "#1e293b",
    backgroundColor: "#f3f4f6",
  },

  sortSelect: {
    padding: "0.625rem 0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  sortSelectHover: {
    borderColor: "#1e293b",
  },

  // Results Count
  resultsInfo: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },

  // Categories Grid
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  categoriesGridMobile: {
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },

  // Category Card
  categoryCard: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
  },
  categoryCardHover: {
    transform: "translateY(-4px)",
  },

  categoryImageContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "0.75rem",
    backgroundColor: "#f3f4f6",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e5e7eb",
    transition: "all 0.3s ease",
  },
  categoryImageContainerHover: {
    borderColor: "#1e293b",
    boxShadow: "0 4px 12px rgba(30, 41, 59, 0.1)",
  },

  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  categoryImageHover: {
    transform: "scale(1.05)",
  },

  categoryBadge: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    color: "#ffffff",
    padding: "0.375rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "none",
  },

  categoryInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  categoryName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    textAlign: "center",
  },

  categoryMeta: {
    display: "none",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.8rem",
    color: "#6b7280",
  },

  categoryMetaIcon: {
    fontSize: "0.75rem",
  },

  categoryDescription: {
    display: "none",
    fontSize: "0.8rem",
    color: "#9ca3af",
    margin: 0,
  },

  categoryButton: {
    padding: "0.625rem 1rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    color: "#111827",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
    fontFamily: "inherit",
  },
  categoryButtonHover: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    borderColor: "#1e293b",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#6b7280",
  },
  emptyStateIcon: {
    fontSize: "3rem",
    color: "#d1d5db",
    marginBottom: "1rem",
  },
  emptyStateTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.5rem",
  },
  emptyStateText: {
    fontSize: "0.95rem",
    color: "#6b7280",
  },
}

const CATEGORIES_DATA = [
  {
    id: "smartphones",
    name: "Action Figure",
    count: 2500,
    rating: 4.8,
    discount: "Up to 30%",
    image: "/images/categories/catagoryactionfigure.png",
    tag: "Popular",
  },
  {
    id: "laptops",
    name: "Toy",
    count: 1800,
    rating: 4.6,
    discount: "Up to 25%",
    image: "/images/categories/toycatagory.png",
    tag: "New",
  },
  {
    id: "wearables",
    name: "Barbie Dolls",
    count: 3200,
    rating: 4.9,
    discount: "Up to 35%",
    image: "/images/categories/dollcatagory.png",
    tag: "Trending",
  },
  {
    id: "smarthome",
    name: "RC Car",
    count: 950,
    rating: 4.7,
    discount: "Up to 20%",
    image: "/images/categories/rccatagory.png",
    tag: "Hot",
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [hoveredCard, setHoveredCard] = useState(null)
  const [focusedSearch, setFocusedSearch] = useState(false)
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  // Filter categories based on search term
  const filteredCategories = CATEGORIES_DATA.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.count - a.count
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id.localeCompare(a.id)
      default:
        return 0
    }
  })

  const handleCategoryClick = (id) => {
    navigate(`/products?category=${id}`)
  }

  return (
    <div style={styles.pageContainer}>
      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroBannerContent}>
          <div style={styles.breadcrumb}>
            <span
              style={styles.breadcrumbItem}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
            >
              Home
            </span>
            <FaChevronRight style={{ fontSize: "0.625rem" }} />
            <span style={styles.breadcrumbActive}>Categories</span>
          </div>
          <h1 style={styles.heroBannerTitle}>Explore All Categories</h1>
          <p style={styles.heroBannerSubtitle}>Browse our complete collection of premium products and find what you're looking for</p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ ...styles.mainContainer, ...(isMobile ? styles.mainContainerMobile : {}) }}>
        {/* Content Area */}
        <div style={styles.contentArea}>
          {/* Top Controls */}
          <div style={{ ...styles.topControls, ...(isMobile ? styles.topControlsMobile : {}) }}>
            <div style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocusedSearch(true)}
                onBlur={() => setFocusedSearch(false)}
                style={{
                  ...styles.searchInput,
                  ...(focusedSearch ? styles.searchInputFocus : {}),
                }}
              />
            </div>
          </div>

          {/* Categories Grid */}
          {sortedCategories.length > 0 ? (
            <div style={{ ...styles.categoriesGrid, ...(isMobile ? styles.categoriesGridMobile : {}) }}>
              {sortedCategories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    ...styles.categoryCard,
                    ...(hoveredCard === category.id ? styles.categoryCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      ...styles.categoryImageContainer,
                      ...(hoveredCard === category.id ? styles.categoryImageContainerHover : {}),
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        ...styles.categoryImage,
                        ...(hoveredCard === category.id ? styles.categoryImageHover : {}),
                      }}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png"
                      }}
                    />
                    <span style={styles.categoryBadge}>{category.tag}</span>
                  </div>

                  {/* Info */}
                  <div style={styles.categoryInfo}>
                    <h3 style={styles.categoryName}>{category.name}</h3>
                    <div style={styles.categoryMeta}>
                      <FaStar style={{ ...styles.categoryMetaIcon, color: "#fbbf24" }} />
                      <span>{category.rating}</span>
                      <span>·</span>
                      <span>{category.count.toLocaleString()} items</span>
                    </div>
                    <p style={styles.categoryDescription}>{category.discount} off selected items</p>
                  </div>

                  {/* Button */}
                  <button
                    style={styles.categoryButton}
                    onClick={() => handleCategoryClick(category.id)}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.categoryButtonHover)}
                    onMouseLeave={(e) => {
                      Object.assign(e.target.style, {
                        backgroundColor: "#f3f4f6",
                        color: "#111827",
                        borderColor: "#e5e7eb",
                      })
                    }}
                  >
                    Browse Category
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>
                <FaBox />
              </div>
              <h3 style={styles.emptyStateTitle}>No categories found</h3>
              <p style={styles.emptyStateText}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
