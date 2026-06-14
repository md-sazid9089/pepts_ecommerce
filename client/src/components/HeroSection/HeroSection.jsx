import { useState, useEffect } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { HiShieldCheck, HiRocketLaunch, HiCreditCard, HiTag } from "react-icons/hi2"

// ====================================
// THEME COLORS
// ====================================

const colors = {
  darkBrown: "#4A3535",
  logoBrown: "#5A3D3D",
  logoOrange: "#5A3D3D",
  white: "#FFFFFF",
  lightBg: "#FFFFFF",
  iconBg: "#F4F4F4",
  mutedBrown: "#867671",
  accentText: "#333333",
}

const sharedStyles = {
  fontFamily: "var(--font-sans)",
  transition: "all 0.3s ease",
}

// ====================================
// STYLE OBJECTS
// ====================================

const styles = {
  // Main Master Wrapper
  masterWrapper: {
    width: "100%",
    backgroundColor: colors.lightBg,
    fontFamily: sharedStyles.fontFamily,
    paddingTop: "0.25rem",
    paddingBottom: "1.5rem",
    overflow: "hidden",
  },

  // ========== SPLIT HERO LAYOUT ==========
  splitWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "stretch",
    height: "600px",
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "0 20px",
  },

  splitWrapperMobile: {
    flexDirection: "column",
    maxWidth: "100%",
    margin: "0",
    padding: "0",
    height: "auto",
  },

  carouselLeftColumn: {
    flex: "1",
    width: "auto",
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
  },

  carouselLeftColumnMobile: {
    flex: "none",
    width: "100%",
  },

  rightColumn: {
    flex: "0 0 296px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    height: "600px",
  },

  rightColumnMobile: {
    flex: "1",
    flexDirection: "row",
    padding: "0 20px",
    gap: "8px",
    height: "auto",
  },

  sideBanner: {
    flex: 1,
    overflow: "hidden",
    borderRadius: "12px",
    cursor: "pointer",
    display: "block",
  },

  sideBannerMobile: {
    height: "140px",
    borderRadius: "8px",
  },

  sideBannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundColor: '#FFFFFF',
    display: "block",
  },

  // ========== CAROUSEL SECTION ==========
  carouselOuter: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 20px",
  },

  carouselOuterMobile: {
    maxWidth: "100%",
    margin: "0",
    padding: "0",
  },

  carouselWrapper: {
    position: "relative",
    width: "100%",
    height: "600px",
    paddingBottom: "0",
    backgroundColor: colors.lightBg,
    overflow: "hidden",
    borderRadius: "12px",
  },

  carouselWrapperMobile: {
    paddingBottom: "62%",
    borderRadius: "0",
    height: "auto",
  },

  carouselContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  carouselImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    backgroundColor: '#FFFFFF',
  },

  // Carousel Navigation Arrows
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    fontSize: "1.5rem",
    transition: sharedStyles.transition,
    zIndex: 10,
  },

  arrowButtonHover: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },

  leftArrow: {
    left: "20px",
  },

  rightArrow: {
    right: "20px",
  },

  arrowButtonMobile: {
    width: "36px",
    height: "36px",
    fontSize: "1rem",
  },

  leftArrowMobile: {
    left: "8px",
  },

  rightArrowMobile: {
    right: "8px",
  },

  // Carousel Pagination Dots
  dotsContainer: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "0.5rem",
    zIndex: 10,
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    border: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
  },

  dotActive: {
    width: "24px",
    height: "8px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  // ========== TRUST STRIP ==========
  trustOuter: {
    maxWidth: "1300px",
    margin: "1rem auto 0",
    padding: "0 20px",
  },
  trustContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "0",
    backgroundColor: "#f3f4f6",
    borderRadius: "1rem",
    padding: "0.875rem 1.5rem",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
  },
  trustDivider: {
    width: "1px",
    height: "20px",
    backgroundColor: "#d1d5db",
    flexShrink: 0,
  },
  trustText: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    whiteSpace: "nowrap",
  },

  // ── Mobile trust: 2×2 grid ──
  trustContainerMobile: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "0",
    gap: "0",
    overflow: "hidden",
    flexDirection: "unset",
    alignItems: "unset",
    justifyContent: "unset",
    flexWrap: "unset",
  },
  trustItemMobile: {
    width: "100%",
    height: "100%",
    padding: "0.75rem 0.5rem",
    gap: "0.35rem",
  },
  trustTextMobile: {
    fontSize: "0.75rem",
    whiteSpace: "normal",
    lineHeight: "1.2",
  },
}

// ====================================
// HERO SECTION COMPONENT
// ====================================

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredArrow, setHoveredArrow] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Carousel images array
  const carouselImages = [
    "/images/heroes/marufposterrr.png",
    "/images/heroes/marufposterr.png",
    "/images/heroes/marufposterrrr.png",
    "/images/heroes/marufposterrrrr.png",
  ]

  // Side banners data
  const sideBanners = [
    { img: "/images/heroes/taw1.png", alt: "Banner 1", href: "#" },
    { img: "/images/heroes/miz4.png", alt: "Banner 2", href: "#" },
  ]

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle carousel navigation
  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    )
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const handleDotClick = (index) => {
    setCurrentSlide(index)
  }

  // Trust features data with new titles and icons
  const trustFeatures = [
    { id: 1, icon: <HiShieldCheck size={20} />, color: "#22c55e", text: "100% Genuine Products" },
    { id: 2, icon: <HiRocketLaunch size={20} />, color: "#3b82f6", text: "Super Fast Delivery" },
    { id: 3, icon: <HiCreditCard size={20} />, color: "#fb923c", text: "Flexible Bulk Pricing" },
    { id: 4, icon: <HiTag size={20} />, color: "#f43f5e", text: "Best Factory Price" },
  ]

  return (
    <section style={styles.masterWrapper}>
      {/* CAROUSEL + SIDE BANNERS SPLIT LAYOUT */}
      <div style={{ ...styles.splitWrapper, ...(isMobile ? styles.splitWrapperMobile : {}) }}>
        
        {/* LEFT: CAROUSEL */}
        <div
          style={{
            ...styles.carouselLeftColumn,
            ...(isMobile ? styles.carouselLeftColumnMobile : {}),
          }}
        >
          <div
            style={{
              ...styles.carouselOuter,
              ...(isMobile ? styles.carouselOuterMobile : {}),
            }}
          >
            <div style={{ ...styles.carouselWrapper, ...(isMobile ? styles.carouselWrapperMobile : {}) }}>
              {/* Carousel Image Container */}
              <div style={styles.carouselContainer}>
                <img
                  src={carouselImages[currentSlide]}
                  alt={`Carousel slide ${currentSlide + 1}`}
                  style={styles.carouselImage}
                />
              </div>

              {/* Left Arrow */}
              <button
                style={{
                  ...styles.arrowButton,
                  ...styles.leftArrow,
                  ...(isMobile ? styles.leftArrowMobile : {}),
                  ...(isMobile ? styles.arrowButtonMobile : {}),
                  ...(hoveredArrow === "left" ? styles.arrowButtonHover : {}),
                }}
                onClick={handlePrevSlide}
                onMouseEnter={() => setHoveredArrow("left")}
                onMouseLeave={() => setHoveredArrow(null)}
                aria-label="Previous slide"
                title="Previous slide"
              >
                <FiChevronLeft />
              </button>

              {/* Right Arrow */}
              <button
                style={{
                  ...styles.arrowButton,
                  ...styles.rightArrow,
                  ...(isMobile ? styles.rightArrowMobile : {}),
                  ...(isMobile ? styles.arrowButtonMobile : {}),
                  ...(hoveredArrow === "right" ? styles.arrowButtonHover : {}),
                }}
                onClick={handleNextSlide}
                onMouseEnter={() => setHoveredArrow("right")}
                onMouseLeave={() => setHoveredArrow(null)}
                aria-label="Next slide"
                title="Next slide"
              >
                <FiChevronRight />
              </button>

              {/* Pagination Dots */}
              <div style={styles.dotsContainer}>
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.dot,
                      ...(currentSlide === index ? styles.dotActive : {}),
                    }}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    title={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SIDE BANNERS */}
        <div style={{ ...styles.rightColumn, ...(isMobile ? styles.rightColumnMobile : {}) }}>
          {sideBanners.map((banner) => (
            <a
              key={banner.alt}
              href={banner.href}
              style={{ ...styles.sideBanner, ...(isMobile ? styles.sideBannerMobile : {}) }}
            >
              <img src={banner.img} alt={banner.alt} style={styles.sideBannerImg} />
            </a>
          ))}
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={styles.trustOuter}>
        <div style={{ ...styles.trustContainer, ...(isMobile ? styles.trustContainerMobile : {}) }}>
          {trustFeatures.map((feature, idx) => {
            const isLeftCol  = idx % 2 === 0
            const isTopRow   = idx < 2
            const mobileBorder = isMobile ? {
              ...(isLeftCol  ? { borderRight:  "1px solid #e5e7eb" } : {}),
              ...(isTopRow   ? { borderBottom: "1px solid #e5e7eb" } : {}),
            } : {}
            return (
              <div key={feature.id} style={{ display: "flex", alignItems: isMobile ? "stretch" : "center", height: isMobile ? "100%" : "auto", width: isMobile ? "100%" : "auto" }}>
                {idx > 0 && !isMobile && <span style={styles.trustDivider} />}
                <div
                  style={{
                    ...styles.trustItem,
                    ...(isMobile ? styles.trustItemMobile : {}),
                    ...mobileBorder,
                  }}
                >
                  <span style={{ color: feature.color, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {feature.icon}
                  </span>
                  <span style={{ ...styles.trustText, ...(isMobile ? styles.trustTextMobile : {}) }}>
                    {feature.text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
