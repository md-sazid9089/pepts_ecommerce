import { useState } from "react"
import { FiCheck, FiTrendingUp, FiBox, FiTruck, FiHeadphones, FiAward } from "react-icons/fi"

const colors = {
  darkBrown: "#4A3535",
  lightBg: "#F5EDEC",
  softBg: "#F9F6F5",
  logoOrange: "#EF7B41",
  mutedBrown: "#8B6F6F",
  ctaBg: "#533638",
  ctaAccent: "#F7B9C4",
  white: "#FFFFFF",
  shadowColor: "rgba(0, 0, 0, 0.08)",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  transition: "all 0.3s ease",
}

// ====================================
// HERO SECTION STYLES
// ====================================
const heroStyles = {
  container: {
    backgroundColor: colors.lightBg,
    padding: "60px 20px",
    textAlign: "center",
    fontFamily: sharedStyles.fontFamily,
  },
  title: {
    fontSize: "3rem",
    fontWeight: 700,
    color: colors.darkBrown,
    margin: "0 0 15px 0",
    letterSpacing: "0.5px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: colors.mutedBrown,
    margin: 0,
    fontWeight: 400,
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6",
  },
}

// ====================================
// IMAGE SECTION STYLES
// ====================================
const imageStyles = {
  container: {
    maxWidth: "1300px",
    margin: "60px auto",
    padding: "0 20px",
    fontFamily: sharedStyles.fontFamily,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
    height: "500px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  caption: {
    marginTop: "20px",
    fontSize: "1rem",
    color: colors.mutedBrown,
    textAlign: "center",
    fontStyle: "italic",
  },
}

// ====================================
// WHY CHOOSE US STYLES
// ====================================
const whyChooseStyles = {
  container: {
    maxWidth: "1300px",
    margin: "80px auto",
    padding: "0 20px",
    fontFamily: sharedStyles.fontFamily,
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: colors.darkBrown,
    marginBottom: "50px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: colors.white,
    padding: "35px 30px",
    borderRadius: "12px",
    boxShadow: `0 4px 15px ${colors.shadowColor}`,
    textAlign: "center",
    transition: sharedStyles.transition,
    cursor: "pointer",
  },
  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
  },
  iconContainer: {
    width: "60px",
    height: "60px",
    backgroundColor: colors.lightBg,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    margin: "0 auto 20px",
    fontSize: "28px",
    color: colors.logoOrange,
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    color: colors.darkBrown,
    marginBottom: "12px",
  },
  cardText: {
    fontSize: "0.95rem",
    color: colors.mutedBrown,
    lineHeight: "1.6",
  },
}

// ====================================
// HOW WE WORK STYLES
// ====================================
const howWeWorkStyles = {
  container: {
    backgroundColor: colors.softBg,
    padding: "80px 20px",
    fontFamily: sharedStyles.fontFamily,
  },
  innerContainer: {
    maxWidth: "1300px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: colors.darkBrown,
    marginBottom: "50px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  stepCard: {
    backgroundColor: colors.white,
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: `0 2px 10px ${colors.shadowColor}`,
    transition: sharedStyles.transition,
    position: "relative",
  },
  stepCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
  },
  stepNumber: {
    width: "50px",
    height: "50px",
    backgroundColor: colors.logoOrange,
    color: colors.white,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: "0 auto 20px",
  },
  stepTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: colors.darkBrown,
    marginBottom: "12px",
  },
  stepText: {
    fontSize: "0.9rem",
    color: colors.mutedBrown,
    lineHeight: "1.6",
  },
}

// ====================================
// CTA SECTION STYLES
// ====================================
const ctaStyles = {
  container: {
    backgroundColor: colors.ctaBg,
    padding: "80px 20px",
    textAlign: "center",
    fontFamily: sharedStyles.fontFamily,
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: colors.white,
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#E8CED1",
    marginBottom: "40px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "14px 35px",
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
    textDecoration: "none",
  },
  primaryButton: {
    backgroundColor: colors.ctaAccent,
    color: colors.ctaBg,
  },
  primaryButtonHover: {
    backgroundColor: "#E8A5B3",
    transform: "translateY(-2px)",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: colors.white,
    border: `2px solid ${colors.white}`,
  },
  secondaryButtonHover: {
    backgroundColor: colors.white,
    color: colors.ctaBg,
  },
}

// ====================================
// ABOUT PAGE COMPONENT
// ====================================
export default function AboutPage() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredStep, setHoveredStep] = useState(null)
  const [hoveredPrimaryBtn, setHoveredPrimaryBtn] = useState(false)
  const [hoveredSecondaryBtn, setHoveredSecondaryBtn] = useState(false)

  const whyChooseUsData = [
    {
      id: 1,
      title: "Authentic Products",
      text: "100% genuine items sourced directly from manufacturers",
      icon: <FiCheck />,
    },
    {
      id: 2,
      title: "Bulk Pricing",
      text: "Competitive wholesale rates for large orders",
      icon: <FiTrendingUp />,
    },
    {
      id: 3,
      title: "MOQ Friendly",
      text: "Flexible minimum order quantities for all retailers",
      icon: <FiBox />,
    },
    {
      id: 4,
      title: "Fast Delivery",
      text: "Quick turnaround times across Bangladesh",
      icon: <FiTruck />,
    },
    {
      id: 5,
      title: "Dedicated Support",
      text: "24/7 customer service for your peace of mind",
      icon: <FiHeadphones />,
    },
    {
      id: 6,
      title: "Industry Experience",
      text: "Years of expertise in wholesale distribution",
      icon: <FiAward />,
    },
  ]

  const processSteps = [
    { id: 1, title: "Sample Development", description: "Develop custom samples based on your specifications" },
    { id: 2, title: "Sample Modification", description: "Refine and modify samples until perfect" },
    { id: 3, title: "Sample Approval", description: "Final approval before production begins" },
    { id: 4, title: "Price & Logistics", description: "Agree on pricing and delivery terms" },
    { id: 5, title: "Bulk Order", description: "Place your bulk order with confidence" },
    { id: 6, title: "Mass Production", description: "Professional manufacturing and quality check" },
  ]

  return (
    <div style={{ fontFamily: sharedStyles.fontFamily }}>
      {/* HERO SECTION */}
      <section style={heroStyles.container}>
        <h1 style={heroStyles.title}>About Pepta</h1>
        <p style={heroStyles.subtitle}>
          Your trusted wholesale partner for premium products. We connect retailers with quality manufacturers
          across Bangladesh, making wholesale simple, reliable, and profitable.
        </p>
      </section>

      {/* REAL IMAGE SECTION */}
      <section style={imageStyles.container}>
        <div style={imageStyles.imageWrapper}>
          <img src="/experience2.png" alt="Pepta Warehouse" style={imageStyles.image} />
        </div>
        <p style={imageStyles.caption}>Serving retailers across Bangladesh with premium products and unmatched service</p>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section style={whyChooseStyles.container}>
        <h2 style={whyChooseStyles.title}>Why Choose Pepta?</h2>
        <div style={whyChooseStyles.grid}>
          {whyChooseUsData.map((item) => (
            <div
              key={item.id}
              style={{
                ...whyChooseStyles.card,
                ...(hoveredCard === item.id ? whyChooseStyles.cardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={whyChooseStyles.iconContainer}>{item.icon}</div>
              <h3 style={whyChooseStyles.cardTitle}>{item.title}</h3>
              <p style={whyChooseStyles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK SECTION */}
      <section style={howWeWorkStyles.container}>
        <div style={howWeWorkStyles.innerContainer}>
          <h2 style={howWeWorkStyles.title}>How We Work</h2>
          <div style={howWeWorkStyles.grid}>
            {processSteps.map((step) => (
              <div
                key={step.id}
                style={{
                  ...howWeWorkStyles.stepCard,
                  ...(hoveredStep === step.id ? howWeWorkStyles.stepCardHover : {}),
                }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div style={howWeWorkStyles.stepNumber}>{step.id}</div>
                <h3 style={howWeWorkStyles.stepTitle}>{step.title}</h3>
                <p style={howWeWorkStyles.stepText}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={ctaStyles.container}>
        <h2 style={ctaStyles.title}>Start Your Wholesale Journey Today</h2>
        <p style={ctaStyles.subtitle}>
          Join hundreds of retailers already growing their business with Pepta. Let&apos;s build something great together.
        </p>
        <div style={ctaStyles.buttonContainer}>
          <button
            style={{
              ...ctaStyles.button,
              ...ctaStyles.primaryButton,
              ...(hoveredPrimaryBtn ? ctaStyles.primaryButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredPrimaryBtn(true)}
            onMouseLeave={() => setHoveredPrimaryBtn(false)}
            onClick={() => {}}
          >
            Browse Products
          </button>
          <button
            style={{
              ...ctaStyles.button,
              ...ctaStyles.secondaryButton,
              ...(hoveredSecondaryBtn ? ctaStyles.secondaryButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredSecondaryBtn(true)}
            onMouseLeave={() => setHoveredSecondaryBtn(false)}
            onClick={() => {}}
          >
            Contact / Request Quote
          </button>
        </div>
      </section>
    </div>
  )
}
