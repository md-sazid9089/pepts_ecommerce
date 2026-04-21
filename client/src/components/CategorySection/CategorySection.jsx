import { useState, useEffect } from "react"

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
  shadowColor: "rgba(74, 53, 53, 0.08)",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  transition: "all 0.3s ease",
}

// ====================================
// STYLE OBJECTS
// ====================================

const styles = {
  container: {
    maxWidth: "1300px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: sharedStyles.fontFamily,
  },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "2.5rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: colors.darkBrown,
    margin: 0,
    letterSpacing: "0.3px",
  },

  viewAllLink: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: colors.mutedBrown,
    textDecoration: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  viewAllLinkHover: {
    color: colors.darkBrown,
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "flex-start",
  },

  cardWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    flex: "0 0 calc(20% - 24px)",
    minWidth: "150px",
    transition: sharedStyles.transition,
  },

  cardWrapperHover: {
    transform: "translateY(-8px)",
  },

  imageWrapper: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    backgroundColor: colors.lightBg,
    overflow: "hidden",
    border: `2px solid ${colors.shadowColor}`,
    boxShadow: `0 4px 12px ${colors.shadowColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: sharedStyles.transition,
  },

  imageWrapperHover: {
    boxShadow: `0 8px 20px rgba(74, 53, 53, 0.15)`,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },

  categoryLabel: {
    marginTop: "12px",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: colors.darkBrown,
    textAlign: "center",
    transition: sharedStyles.transition,
  },

  categoryLabelHover: {
    color: colors.logoOrange,
  },

  cardWrapperTablet: {
    flex: "0 0 calc(33.333% - 20px)",
  },

  cardWrapperMobile: {
    flex: "0 0 calc(50% - 15px)",
  },
}


export default function CategorySection() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredViewAll, setHoveredViewAll] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const categories = [
    {
      id: 1,
      name: "Action Figures",
      imgUrl: "/images/categories/catagoryactionfigure.png",
    },
    {
      id: 2,
      name: "RC Toys",
      imgUrl: "/images/categories/rccatagory.png",
    },
    {
      id: 3,
      name: "Dolls",
      imgUrl: "/images/categories/dollcatagory.png",
    },
    {
      id: 4,
      name: "Building Sets",
      imgUrl: "/images/categories/toycatagory.png",
    },
    {
      id: 5,
      name: "Collectibles",
      imgUrl: "/images/categories/catagoryactionfigure.png",
    },
    {
      id: 6,
      name: "Toy Cars",
      imgUrl: "/images/categories/rccatagory.png",
    },
  ]

  const getCardStyle = () => {
    if (windowWidth < 640) {
      return styles.cardWrapperMobile
    } else if (windowWidth < 1024) {
      return styles.cardWrapperTablet
    }
    return styles.cardWrapper
  }

  const handleCategoryClick = (categoryId, categoryName) => {
    console.log(`Clicked category: ${categoryName} (ID: ${categoryId})`)
  }

  const handleViewAll = () => {
    console.log("View all categories")
  }

  return (
    <section style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.title}>Shop by Category</h2>
        <a
          href="#"
          style={{
            ...styles.viewAllLink,
            ...(hoveredViewAll ? styles.viewAllLinkHover : {}),
          }}
          onMouseEnter={() => setHoveredViewAll(true)}
          onMouseLeave={() => setHoveredViewAll(false)}
          onClick={(e) => {
            e.preventDefault()
            handleViewAll()
          }}
        >
          View All →
        </a>
      </div>

      <div style={styles.grid}>
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              ...getCardStyle(),
              ...(hoveredCard === category.id ? styles.cardWrapperHover : {}),
            }}
            onClick={() => handleCategoryClick(category.id, category.name)}
            onMouseEnter={() => setHoveredCard(category.id)}
            onMouseLeave={() => setHoveredCard(null)}
            role="button"
            tabIndex={0}
            aria-label={`Shop ${category.name}`}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCategoryClick(category.id, category.name)
              }
            }}
          >
            <div
              style={{
                ...styles.imageWrapper,
                ...(hoveredCard === category.id ? styles.imageWrapperHover : {}),
              }}
            >
              <img
                src={category.imgUrl}
                alt={category.name}
                style={styles.image}
              />
            </div>

            <span
              style={{
                ...styles.categoryLabel,
                ...(hoveredCard === category.id ? styles.categoryLabelHover : {}),
              }}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
