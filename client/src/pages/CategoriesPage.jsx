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
  "Our Design":     { overlay: "rgba(83,54,56,0.55)",   badge: "#F7B9C4", badgeText: "#533638", poster: "/images/categories/wq.png" },
  "Custom Build":   { overlay: "rgba(30,58,138,0.55)",  badge: "#93C5FD", badgeText: "#1E3A8A", poster: "/images/categories/panda6.jpg" },
  "Popular":        { overlay: "rgba(120,53,15,0.55)",  badge: "#FCD34D", badgeText: "#78350F", poster: "/images/categories/wp4.png" },
  "Most Demanding": { overlay: "rgba(6,78,59,0.55)",    badge: "#6EE7B7", badgeText: "#065F46", poster: "/images/categories/mos8.png" },
}
const DEFAULT_ACCENT = { overlay: "rgba(30,30,30,0.5)", badge: "#F7B9C4", badgeText: "#533638", poster: "/images/categories/mos8.png" }
const CATEGORY_POSTER = "/images/categories/wq.png"

const CSS = `
  /* ── Card ── */
  .cs-card {
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    box-shadow: 0 4px 16px rgba(74,53,53,0.10);
    transition: transform 0.28s ease, box-shadow 0.28s ease;
    aspect-ratio: 3 / 4;
    background: #f5edec;
  }
  .cs-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(74,53,53,0.18);
  }

  /* ── Image ── */
  .cs-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.45s ease;
  }
  .cs-card:hover .cs-img { transform: scale(1.06); }

  /* ── Gradient overlay ── */
  .cs-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem 1rem 1rem;
    gap: 8px;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.72) 0%,
      rgba(0,0,0,0.35) 45%,
      transparent 75%
    );
  }

  /* ── Badge (category tag at top-left) ── */
  .cs-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }

  /* ── Bottom text ── */
  .cs-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    text-shadow: 0 1px 6px rgba(0,0,0,0.5);
    line-height: 1.25;
  }
  .cs-count {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }
  .cs-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    font-size: 0.85rem;
    align-self: flex-end;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }
  .cs-card:hover .cs-arrow {
    background: rgba(255,255,255,0.35);
  }
  .cs-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "var(--font-sans)",
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
      <style>{CSS}</style>


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
              const accent = CATEGORY_ACCENTS[cat.name] ?? DEFAULT_ACCENT
              const currentPoster = accent.poster || CATEGORY_POSTER

              return (
                <div
                  key={cat.id}
                  className="cs-card"
                  onClick={() => handleCategoryClick(cat.name)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Shop ${cat.name}`}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && handleCategoryClick(cat.name)
                  }
                >
                  {/* Image */}
                  <img
                    src={currentPoster}
                    alt={cat.name}
                    className="cs-img"
                    loading="lazy"
                    onError={(e) => { e.target.src = CATEGORY_POSTER }}
                  />

                  {/* Top badge */}
                  <span
                    className="cs-badge"
                    style={{ backgroundColor: accent.badge, color: accent.badgeText }}
                  >
                    {cat.name}
                  </span>

                  {/* Bottom overlay */}
                  <div className="cs-overlay">
                    <div className="cs-footer">
                      <div>
                        <p className="cs-name">{cat.name}</p>
                        <p className="cs-count">
                          {cat.productCount ?? 0} {cat.productCount === 1 ? "product" : "products"}
                        </p>
                      </div>
                      <div className="cs-arrow">→</div>
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
