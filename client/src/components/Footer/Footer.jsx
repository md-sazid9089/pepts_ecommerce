import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaPaperPlane,
  FaMapMarkerAlt,
} from "react-icons/fa"
import { FiSmartphone, FiMonitor, FiWatch, FiZap } from "react-icons/fi"

// ====================================
// STYLE OBJECTS
// ====================================

const themeColors = {
  bgPrimary: "#3c2a2a",
  bgSecondary: "#4a3535",
  textPrimary: "#ffffff",
  textSecondary: "#d4d4d4",
  textTertiary: "#a0a0a0",
  borderColor: "rgba(255, 255, 255, 0.1)",
  accent: "rgba(255, 255, 255, 0.15)",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  transition: "all 0.3s ease",
}

const styles = {
  // Main footer container
  footer: {
    backgroundColor: themeColors.bgPrimary,
    color: themeColors.textPrimary,
    fontFamily: sharedStyles.fontFamily,
    borderTop: `1px solid ${themeColors.borderColor}`,
  },

  // NEWSLETTER SECTION
  newsletter: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2rem 3rem",
    borderBottom: `1px solid ${themeColors.borderColor}`,
    gap: "2rem",
  },
  newsletterLeft: {
    flex: 1,
    minWidth: "280px",
  },
  newsletterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  newsletterIcon: {
    fontSize: "1.5rem",
    color: themeColors.textPrimary,
  },
  newsletterTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    color: themeColors.textPrimary,
    letterSpacing: "0.5px",
  },
  newsletterDescription: {
    fontSize: "0.95rem",
    color: themeColors.textSecondary,
    margin: 0,
    lineHeight: 1.5,
    maxWidth: "400px",
  },
  newsletterForm: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    minWidth: "300px",
    flexWrap: "wrap",
  },
  newsletterInputWrapper: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: themeColors.textPrimary,
    borderRadius: "0.5rem",
    padding: "0 0.75rem",
    overflow: "hidden",
    minWidth: "200px",
  },
  newsletterInputIcon: {
    color: themeColors.bgPrimary,
    fontSize: "0.9rem",
    flexShrink: 0,
    pointerEvents: "none",
  },
  newsletterInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "0.75rem 0.75rem 0.75rem 0.5rem",
    fontSize: "0.95rem",
    color: themeColors.bgPrimary,
    outline: "none",
    fontFamily: "inherit",
  },
  subscribeBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    border: `1px solid ${themeColors.textPrimary}`,
    color: themeColors.textPrimary,
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: "0.5rem",
    transition: sharedStyles.transition,
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  subscribeBtnHover: {
    backgroundColor: themeColors.textPrimary,
    color: themeColors.bgPrimary,
  },
  subscribeIcon: {
    fontSize: "0.85rem",
  },
  subscribeSuccess: {
    display: "inline-block",
    fontSize: "0.85rem",
    color: "#a0e0a0",
  },

  // MAIN CONTENT SECTION
  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    gap: "3rem",
    padding: "3rem",
    borderBottom: `1px solid ${themeColors.borderColor}`,
  },
  mainMobile: {
    gridTemplateColumns: "1fr",
    gap: "2rem",
    padding: "2rem 1.5rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  columnWide: {
    gridColumn: 1,
  },

  // Brand section
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.25rem",
  },
  brandIcon: {
    fontSize: "1.75rem",
    color: themeColors.textPrimary,
  },
  brandLogo: {
    height: "2.5rem",
    width: "auto",
    objectFit: "contain",
    borderRadius: "0.375rem",
  },
  brandName: {
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
    color: themeColors.textPrimary,
    letterSpacing: "1px",
  },
  description: {
    fontSize: "0.9rem",
    color: themeColors.textSecondary,
    lineHeight: 1.6,
    margin: "0 0 1.75rem 0",
  },

  // Contact info
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.75rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  contactIcon: {
    fontSize: "1rem",
    color: themeColors.textSecondary,
    flexShrink: 0,
    marginTop: "0.2rem",
  },
  contactText: {
    fontSize: "0.9rem",
    color: themeColors.textSecondary,
    lineHeight: 1.5,
  },
  contactLink: {
    textDecoration: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
  },
  contactLinkHover: {
    color: themeColors.textPrimary,
  },

  // Social icons
  social: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.25rem",
    height: "2.25rem",
    backgroundColor: themeColors.accent,
    borderRadius: "0.375rem",
    color: themeColors.textPrimary,
    textDecoration: "none",
    fontSize: "1rem",
    transition: sharedStyles.transition,
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    cursor: "pointer",
  },
  socialLinkHover: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    transform: "translateY(-2px)",
  },

  // Column titles and links
  columnTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    textTransform: "uppercase",
    color: themeColors.textPrimary,
    margin: "0 0 1.5rem 0",
    letterSpacing: "0.5px",
  },
  links: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },
  link: {
    fontSize: "0.9rem",
    color: themeColors.textSecondary,
    textDecoration: "none",
    transition: sharedStyles.transition,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  linkHover: {
    color: themeColors.textPrimary,
    paddingLeft: "0.25rem",
  },
  linkIcon: {
    fontSize: "1rem",
    flexShrink: 0,
  },

  // BOTTOM SECTION
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2rem 3rem",
    borderBottom: `1px solid ${themeColors.borderColor}`,
    gap: "2rem",
    flexWrap: "wrap",
  },
  bottomMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "1.5rem",
  },

  // Payments section
  payments: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  paymentsMobile: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  paymentsLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: themeColors.textPrimary,
    whiteSpace: "nowrap",
  },
  paymentBadges: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  paymentBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    backgroundColor: themeColors.accent,
    border: `1px solid rgba(255, 255, 255, 0.15)`,
    borderRadius: "1.5rem",
    color: themeColors.textPrimary,
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: sharedStyles.transition,
    cursor: "default",
  },
  paymentBadgeHover: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  // App stores
  appStores: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  appStoresMobile: {
    width: "100%",
    flexDirection: "column",
  },
  appStoreBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "0.625rem 1rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: "0.375rem",
    color: themeColors.textPrimary,
    textDecoration: "none",
    fontSize: "0.8rem",
    transition: sharedStyles.transition,
    minWidth: "160px",
    textAlign: "left",
    cursor: "pointer",
  },
  appStoreBtnMobile: {
    width: "100%",
  },
  appStoreBtnHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  appStoreText: {
    fontSize: "0.7rem",
    color: themeColors.textTertiary,
    lineHeight: 1,
  },
  appStoreName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: themeColors.textPrimary,
    lineHeight: 1.2,
  },

  // COPYRIGHT SECTION
  copyright: {
    padding: "1.5rem 3rem",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderTop: `1px solid ${themeColors.borderColor}`,
  },
  copyrightMobile: {
    padding: "0.75rem 1.5rem",
  },
  copyrightText: {
    fontSize: "0.85rem",
    color: themeColors.textTertiary,
    margin: 0,
    letterSpacing: "0.3px",
  },
}

// ====================================
// FOOTER COMPONENT
// ====================================

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredSubscribeBtn, setHoveredSubscribeBtn] = useState(false)
  const [hoveredLinks, setHoveredLinks] = useState({})
  const [hoveredSocialLinks, setHoveredSocialLinks] = useState({})

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const wholesaleLinks = [
    { label: "How to Buy Bulk", href: "#" },
    { label: "Tiered Pricing Guide", href: "#" },
    { label: "Bulk Order Process", href: "#" },
    { label: "MOQ Information", href: "#" },
    { label: "Wholesale FAQs", href: "#" },
    { label: "Order Tracking", href: "#" },
  ]

  const retailersLinks = [
    { label: "For Boutique Owners", href: "#" },
    { label: "Gift Shop Solutions", href: "#" },
    { label: "Franchise Opportunities", href: "#" },
    { label: "Wholesale Terms", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Partner Program", href: "#" },
  ]

  const categoriesLinks = [
    { label: "Smartphones", href: "#", icon: FiSmartphone },
    { label: "Monitors", href: "#", icon: FiMonitor },
    { label: "Watches", href: "#", icon: FiWatch },
    { label: "RC Cars", href: "#", icon: FiZap },
  ]

  const supportLinks = [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Return Policy", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
  ]

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
  ]

  const paymentMethods = ["Visa", "Mastercard", "bKash", "Nagad", "Rocket", "Cash on Delivery"]

  return (
    <footer style={styles.footer}>
      {/* Newsletter Section */}
      <section style={styles.newsletter}>
        <div style={styles.newsletterLeft}>
          <div style={styles.newsletterHeader}>
            <FaEnvelope style={styles.newsletterIcon} />
            <h3 style={styles.newsletterTitle}>Wholesale Updates</h3>
          </div>
          <p style={styles.newsletterDescription}>
            Get new product launches, bulk pricing alerts, and exclusive wholesale offers for your boutique.
          </p>
        </div>

        <form style={styles.newsletterForm} onSubmit={handleSubscribe}>
          <div style={styles.newsletterInputWrapper}>
            <FaEnvelope style={styles.newsletterInputIcon} />
            <input
              type="email"
              style={styles.newsletterInput}
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.subscribeBtn,
              ...(hoveredSubscribeBtn ? styles.subscribeBtnHover : {}),
            }}
            onMouseEnter={() => setHoveredSubscribeBtn(true)}
            onMouseLeave={() => setHoveredSubscribeBtn(false)}
          >
            <FaPaperPlane style={styles.subscribeIcon} />
            Subscribe
          </button>
          {subscribed && <span style={styles.subscribeSuccess}>Subscribed!</span>}
        </form>
      </section>

      {/* Main Content Section */}
      <section style={{ ...styles.main, ...(isMobile ? styles.mainMobile : {}) }}>
        {/* Column 1: About & Contact */}
        <div style={{ ...styles.column, ...styles.columnWide }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', cursor: 'pointer' }}>
            <img
              src="/images/products/logo.jpeg"
              alt="Pepta Logo"
              style={styles.brandLogo}
            />
            <h2 style={styles.brandName}>Pepta</h2>
          </Link>
          <p style={styles.description}>
            Premium technology and gadget wholesale supplier for boutiques and showrooms across Bangladesh. Direct factory prices, bulk discounts, and professional wholesale service.
          </p>

          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <FaPhoneAlt style={styles.contactIcon} />
              <span style={styles.contactText}>(+86) 18168023963</span>
            </div>
            <div style={styles.contactItem}>
              <FaEnvelope style={styles.contactIcon} />
              <a
                href="mailto:wholesale@pepta.com.bd"
                style={{
                  ...styles.contactText,
                  ...styles.contactLink,
                  ...(hoveredLinks["email"] ? styles.contactLinkHover : {}),
                }}
                onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, email: true })}
                onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, email: false })}
              >
                wholesale@pepta.com.bd
              </a>
            </div>
            <div style={styles.contactItem}>
              <FaMapMarkerAlt style={styles.contactIcon} />
              <span style={styles.contactText}>Yangzhou, Jiangsu, China</span>
            </div>
          </div>

          <div style={styles.social}>
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  style={{
                    ...styles.socialLink,
                    ...(hoveredSocialLinks[index] ? styles.socialLinkHover : {}),
                  }}
                  onMouseEnter={() => setHoveredSocialLinks({ ...hoveredSocialLinks, [index]: true })}
                  onMouseLeave={() => setHoveredSocialLinks({ ...hoveredSocialLinks, [index]: false })}
                  aria-label={social.label}
                  title={social.label}
                >
                  <Icon />
                </a>
              )
            })}
          </div>
        </div>

        {/* Column 2: Wholesale Info */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>WHOLESALE INFO</h3>
          <ul style={styles.links}>
            {wholesaleLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  style={{
                    ...styles.link,
                    ...(hoveredLinks[`wholesale-${index}`] ? styles.linkHover : {}),
                  }}
                  onMouseEnter={() =>
                    setHoveredLinks({ ...hoveredLinks, [`wholesale-${index}`]: true })
                  }
                  onMouseLeave={() =>
                    setHoveredLinks({ ...hoveredLinks, [`wholesale-${index}`]: false })
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Retailers & Boutiques */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>RETAILERS & BOUTIQUES</h3>
          <ul style={styles.links}>
            {retailersLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  style={{
                    ...styles.link,
                    ...(hoveredLinks[`retailers-${index}`] ? styles.linkHover : {}),
                  }}
                  onMouseEnter={() =>
                    setHoveredLinks({ ...hoveredLinks, [`retailers-${index}`]: true })
                  }
                  onMouseLeave={() =>
                    setHoveredLinks({ ...hoveredLinks, [`retailers-${index}`]: false })
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Categories */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>CATEGORIES</h3>
          <ul style={styles.links}>
            {categoriesLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      ...styles.link,
                      ...(hoveredLinks[`categories-${index}`] ? styles.linkHover : {}),
                    }}
                    onMouseEnter={() =>
                      setHoveredLinks({ ...hoveredLinks, [`categories-${index}`]: true })
                    }
                    onMouseLeave={() =>
                      setHoveredLinks({ ...hoveredLinks, [`categories-${index}`]: false })
                    }
                  >
                    <Icon style={styles.linkIcon} />
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Column 5: Support & Services */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>SUPPORT & SERVICES</h3>
          <ul style={styles.links}>
            {supportLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.href}
                  style={{
                    ...styles.link,
                    ...(hoveredLinks[`support-${index}`] ? styles.linkHover : {}),
                  }}
                  onMouseEnter={() =>
                    setHoveredLinks({ ...hoveredLinks, [`support-${index}`]: true })
                  }
                  onMouseLeave={() =>
                    setHoveredLinks({ ...hoveredLinks, [`support-${index}`]: false })
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom Section: Payments & App Stores */}
      <section style={{ ...styles.bottom, ...(isMobile ? styles.bottomMobile : {}) }}>
        <div style={{ ...styles.payments, ...(isMobile ? styles.paymentsMobile : {}) }}>
          <span style={styles.paymentsLabel}>We Accept: </span>
          <div style={styles.paymentBadges}>
            {paymentMethods.map((method, index) => (
              <span
                key={index}
                style={{
                  ...styles.paymentBadge,
                  ...(hoveredLinks[`payment-${index}`] ? styles.paymentBadgeHover : {}),
                }}
                onMouseEnter={() =>
                  setHoveredLinks({ ...hoveredLinks, [`payment-${index}`]: true })
                }
                onMouseLeave={() =>
                  setHoveredLinks({ ...hoveredLinks, [`payment-${index}`]: false })
                }
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...styles.appStores, ...(isMobile ? styles.appStoresMobile : {}) }}>
          <a
            href="#"
            style={{
              ...styles.appStoreBtn,
              ...(isMobile ? styles.appStoreBtnMobile : {}),
              ...(hoveredLinks["google-play"] ? styles.appStoreBtnHover : {}),
            }}
            onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, "google-play": true })}
            onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, "google-play": false })}
          >
            <span style={styles.appStoreText}>Get it on</span>
            <span style={styles.appStoreName}>Google Play</span>
          </a>
          <a
            href="#"
            style={{
              ...styles.appStoreBtn,
              ...(isMobile ? styles.appStoreBtnMobile : {}),
              ...(hoveredLinks["app-store"] ? styles.appStoreBtnHover : {}),
            }}
            onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, "app-store": true })}
            onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, "app-store": false })}
          >
            <span style={styles.appStoreText}>Download on</span>
            <span style={styles.appStoreName}>App Store</span>
          </a>
        </div>
      </section>

      {/* Copyright Section */}
      <section style={{ ...styles.copyright, ...(isMobile ? styles.copyrightMobile : {}) }}>
        <p style={styles.copyrightText}>&copy; 2024 Pepta Premium Wholesale. All rights reserved.</p>
      </section>
    </footer>
  )
}
