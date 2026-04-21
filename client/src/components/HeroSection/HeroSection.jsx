import { useState, useEffect } from "react"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiHeadphones, FiRotateCcw } from "react-icons/fi"

// ====================================
// THEME COLORS
// ====================================

const colors = {
  darkBrown: "#4A3535",
  logoBrown: "#5A3D3D",
  logoOrange: "#EF7241",
  white: "#FFFFFF",
  lightBg: "#F9F6F5",
  iconBg: "#F4F4F4",
  mutedBrown: "#867671",
  accentText: "#333333",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
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
  },

  // ========== CAROUSEL SECTION ==========
  carouselOuter: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 20px",
  },

  carouselWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "45%",
    backgroundColor: colors.lightBg,
    overflow: "hidden",
    borderRadius: "16px",
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

  // ========== TRUST SECTION ==========
  trustOuter: {
    maxWidth: "1300px",
    margin: "1rem auto 0",
    padding: "0 20px",
  },

  trustContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },

  // Trust Card Item
  trustCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "20px",
    backgroundColor: colors.white,
    borderRadius: "12px",
    padding: "30px 20px",
    flex: "1 1 calc(33.333% - 14px)",
    minWidth: "280px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.03)",
    transition: sharedStyles.transition,
  },

  trustCardHover: {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
  },

  trustIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    minWidth: "60px",
    borderRadius: "12px",
    backgroundColor: colors.iconBg,
  },

  trustIcon: {
    fontSize: "1.8rem",
    color: colors.darkBrown,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  trustContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },

  trustTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: colors.darkBrown,
    margin: 0,
    letterSpacing: "0.3px",
  },

  trustSubtitle: {
    fontSize: "0.9rem",
    color: colors.mutedBrown,
    margin: 0,
    lineHeight: 1.6,
  },

  // ========== MOBILE RESPONSIVE ==========
  trustCardMobile: {
    flex: "1 1 100%",
    minWidth: "auto",
  },

  carouselWrapperMobile: {
    paddingBottom: "38%",
  },

  arrowButtonMobile: {
    width: "40px",
    height: "40px",
    fontSize: "1.2rem",
  },

  leftArrowMobile: {
    left: "10px",
  },

  rightArrowMobile: {
    right: "10px",
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
    "/images/products/barbiedoll.jpg",
    "/images/products/hotwheels.jpg",
    "/images/products/batman.png",
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
    {
      id: 1,
      icon: <FiCheckCircle />,
      title: "100% Authentic",
      subtitle: "Genuine products from verified suppliers",
    },
    {
      id: 2,
      icon: <FiHeadphones />,
      title: "24/7 Support",
      subtitle: "Dedicated customer service always available",
    },
    {
      id: 3,
      icon: <FiRotateCcw />,
      title: "Easy Returns",
      subtitle: "Hassle-free returns within 14 days",
    },
  ]

  return (
    <section style={styles.masterWrapper}>
      {/* CAROUSEL SECTION */}
      <div style={styles.carouselOuter}>
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

      {/* TRUST SECTION */}
      <div style={styles.trustOuter}>
        <div style={styles.trustContainer}>
          {trustFeatures.map((feature) => (
            <div
              key={feature.id}
              style={{
                ...styles.trustCard,
                ...(isMobile ? styles.trustCardMobile : {}),
                ...(hoveredCard === feature.id ? styles.trustCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Icon Container - Left */}
              <div style={styles.trustIconWrapper}>
                <div style={styles.trustIcon}>{feature.icon}</div>
              </div>

              {/* Text Content - Right */}
              <div style={styles.trustContent}>
                <h3 style={styles.trustTitle}>{feature.title}</h3>
                <p style={styles.trustSubtitle}>{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
