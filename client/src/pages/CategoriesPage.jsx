import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FaSearch, FaBox, FaArrowRight, FaTag } from "react-icons/fa"
import categoriesApi from "@/services/api/categories.api"
import CategoryGridSkeleton from "@/components/skeletons/CategoryGridSkeleton"
import { queryKeys } from "@/lib/queryKeys"
import LoadingSpinner from "@/components/UI/LoadingSpinner"

// ─── Category accent colours ─────────────────────────────────────────────────
const CATEGORY_ACCENTS = {
  "Our Design":     { bg: "#FFF0F3", accent: "#F7B9C4", text: "#533638", emoji: "✨" },
  "Custom Build":   { bg: "#F0F4FF", accent: "#93C5FD", text: "#1E3A8A", emoji: "🔧" },
  "Popular":        { bg: "#FFF7ED", accent: "#FCD34D", text: "#92400E", emoji: "🔥" },
  "Most Demanding": { bg: "#F0FDF4", accent: "#6EE7B7", text: "#065F46", emoji: "⚡" },
}

const DEFAULT_ACCENT = { bg: "#F9F5F3", accent: "#F7B9C4", text: "#533638", emoji: "📦" }

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "var(--font-sans)",
  },

  // Hero
  hero: {
    background: "linear-gradient(135deg, #533638 0%, #3d2829 100%)",
    color: "#ffffff",
    padding: "4rem 2rem 3rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroDeco: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 30% 50%, rgba(247,185,196,0.15) 0%, transparent 60%)," +
      "radial-gradient(ellipse at 70% 50%, rgba(247,185,196,0.10) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: "700px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  heroEyebrow: {
    display: "inline-block",
    backgroundColor: "rgba(247,185,196,0.2)",
    color: "#F7B9C4",
    border: "1px solid rgba(247,185,196,0.4)",
    borderRadius: "20px",
    padding: "4px 16px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    margin: "0 0 0.75rem 0",
    letterSpacing: "-0.5px",
  },
  heroSubtitle: {
    fontSize: "1.05rem",
    color: "rgba(255,255,255,0.75)",
    margin: 0,
  },

  // Content
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
  },

  // Controls bar
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  searchWrap: {
    position: "relative",
    flex: "1",
    minWidth: "220px",
    maxWidth: "380px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#A0AEC0",
    fontSize: "14px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  countBadge: {
    marginLeft: "auto",
    fontSize: "13px",
    color: "#667C7F",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.5rem",
  },

  // Category card
  card: (hovered, accent) => ({
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: `1px solid ${hovered ? accent.accent : "#E2E8F0"}`,
    boxShadow: hovered
      ? `0 12px 32px rgba(0,0,0,0.12)`
      : "0 2px 8px rgba(0,0,0,0.06)",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.25s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  }),
  cardTop: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "14px 14px 0 0",
  },
  imageBox: (accent) => ({
    width: "100%",
    aspectRatio: "4 / 3",
    overflow: "hidden",
    position: "relative",
    borderRadius: "14px 14px 0 0",
    backgroundColor: accent.bg,
  }),
  imageBoxImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    transition: "transform 0.35s ease",
  },
  imageOverlay: (accent) => ({
    position: "absolute",
    inset: 0,
    background: `linear-gradient(to top, ${accent.text}cc 0%, transparent 55%)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "1rem 1rem 0.75rem",
    gap: "6px",
  }),
  overlayName: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  cardName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#533638",
    margin: 0,
    textAlign: "center",
  },
  productCountPill: (accent) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: accent.accent + "33",
    color: accent.text,
    border: `1px solid ${accent.accent}`,
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "12px",
    fontWeight: 600,
  }),
  cardBottom: {
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #EAEAEA",
    marginTop: "auto",
  },
  browseText: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#533638",
  },
  arrowCircle: (hovered, accent) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: hovered ? accent.accent : "#F9F5F3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
    flexShrink: 0,
  }),

  // Empty state
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
  },
  emptyIcon: {
    fontSize: "3rem",
    color: "#CBD5E0",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#2D3748",
    margin: "0 0 0.5rem 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#A0AEC0",
    margin: 0,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [searchTerm, setSearchTerm]   = useState("")
  const [hoveredCard, setHoveredCard] = useState(null)
  const [focused, setFocused]         = useState(false)
  const navigate = useNavigate()

  // Fetch categories from API
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn:  () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const categories = useMemo(
    () => categoriesResponse?.data ?? [],
    [categoriesResponse]
  )

  // Client-side search filter
  const filtered = useMemo(
    () =>
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  )

  // Navigate to /products?category=<name> (filter by name, not id)
  function handleCategoryClick(categoryName) {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading categories…" />
  }

  return (
    <div style={styles.page}>
      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroDeco} />
        <div style={styles.heroInner}>
          <span style={styles.heroEyebrow}>Browse by Category</span>
          <h1 style={styles.heroTitle}>Explore All Categories</h1>
          <p style={styles.heroSubtitle}>
            Browse our complete collection of premium wholesale products
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={styles.content}>
        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.searchWrap}>
            <FaSearch style={styles.searchIcon} />
            <input
              id="category-search"
              type="text"
              placeholder="Search categories…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                ...styles.searchInput,
                ...(focused ? {
                  borderColor: "#533638",
                  boxShadow: "0 0 0 3px rgba(83,54,56,0.12)",
                } : {}),
              }}
            />
          </div>
          {!isLoading && (
            <span style={styles.countBadge}>
              {filtered.length} {filtered.length === 1 ? "category" : "categories"}
            </span>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={styles.grid}>
            {filtered.map((cat) => {
              const accent  = CATEGORY_ACCENTS[cat.name] ?? DEFAULT_ACCENT
              const hovered = hoveredCard === cat.id

              return (
                <div
                  key={cat.id}
                  id={`category-card-${cat.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Browse ${cat.name}`}
                  style={styles.card(hovered, accent)}
                  onMouseEnter={() => setHoveredCard(cat.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCategoryClick(cat.name)}
                  onKeyDown={(e) => e.key === "Enter" && handleCategoryClick(cat.name)}
                >
                  {/* Card top — image with overlay */}
                  <div style={styles.cardTop}>
                    <div style={styles.imageBox(accent)}>
                      <img
                        src={cat.icon || "/images/heroes/marufposterrr.png"}
                        alt={cat.name}
                        style={{
                          ...styles.imageBoxImg,
                          ...(hovered ? { transform: "scale(1.06)" } : {}),
                        }}
                        onError={(e) => { e.target.src = "/images/heroes/marufposterrr.png" }}
                      />
                      <div style={styles.imageOverlay(accent)}>
                        <h3 style={styles.overlayName}>{cat.name}</h3>
                        <span style={styles.productCountPill(accent)}>
                          <FaTag style={{ fontSize: "10px" }} />
                          {cat.productCount ?? 0} {cat.productCount === 1 ? "product" : "products"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom — CTA */}
                  <div style={styles.cardBottom}>
                    <span style={styles.browseText}>Browse Category</span>
                    <div style={styles.arrowCircle(hovered, accent)}>
                      <FaArrowRight style={{ fontSize: "12px", color: "#533638" }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}><FaBox /></div>
            <h3 style={styles.emptyTitle}>No categories found</h3>
            <p style={styles.emptyText}>
              {searchTerm
                ? `No match for "${searchTerm}" — try a different term`
                : "No categories available yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
