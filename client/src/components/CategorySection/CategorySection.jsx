import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import categoriesApi from "@/services/api/categories.api"
import CategoryGridSkeleton from "@/components/skeletons/CategoryGridSkeleton"

// ── Per-category accent colours ───────────────────────────────────────────────
const CATEGORY_ACCENTS = {
  "Our Design":     { overlay: "rgba(83,54,56,0.55)",   badge: "#F7B9C4", badgeText: "#533638", poster: "/images/categories/wq.png" },
  "Custom Build":   { overlay: "rgba(30,58,138,0.55)",  badge: "#93C5FD", badgeText: "#1E3A8A", poster: "/images/categories/panda6.jpg" },
  "Popular":        { overlay: "rgba(120,53,15,0.55)",  badge: "#FCD34D", badgeText: "#78350F", poster: "/images/categories/wp4.png" },
  "Most Demanding": { overlay: "rgba(6,78,59,0.55)",    badge: "#6EE7B7", badgeText: "#065F46", poster: "/images/categories/mos8.png" },
}
const DEFAULT_ACCENT = { overlay: "rgba(30,30,30,0.5)", badge: "#F7B9C4", badgeText: "#533638", poster: "/images/categories/mos8.png" }

const CATEGORY_POSTER = "/images/categories/wq.png"

const CSS = `
  .cs-section {
    max-width: 1300px;
    margin: 40px auto;
    padding: 0 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .cs-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2rem;
  }
  .cs-title {
    font-size: 2rem;
    font-weight: 700;
    color: #4A3535;
    margin: 0;
    letter-spacing: 0.3px;
  }
  .cs-view-all {
    background: transparent;
    border: 2px solid #4A3535;
    border-radius: 0.375rem;
    padding: 0.6rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #4A3535;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: background 0.2s ease, color 0.2s ease;
    font-family: inherit;
    white-space: nowrap;
  }
  .cs-view-all:hover { background: #4A3535; color: #fff; }

  /* ── Grid ── */
  .cs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

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

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cs-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 520px) {
    .cs-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cs-title { font-size: 1.5rem; }
    .cs-card  { aspect-ratio: 1; }
    .cs-name  { font-size: 0.95rem; }
  }
`

export default function CategorySection() {
  const navigate = useNavigate()

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories", "home-section"],
    queryFn:  () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const categories = categoriesResponse?.data?.slice(0, 4) || []

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <>
      <style>{CSS}</style>
      <section className="cs-section">
        <div className="cs-header">
          <h2 className="cs-title">Shop by Category</h2>
          <button
            className="cs-view-all"
            onClick={() => navigate("/categories")}
          >
            View All →
          </button>
        </div>

        {isLoading ? (
          <CategoryGridSkeleton />
        ) : (
          <div className="cs-grid">
            {categories.map((cat) => {
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
        )}
      </section>
    </>
  )
}
