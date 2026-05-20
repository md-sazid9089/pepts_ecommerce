import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiSearch, FiUser, FiShoppingCart, FiLogOut, FiPhone, FiMail } from "react-icons/fi"
import { HiBars3, HiXMark, HiUser, HiShoppingCart, HiTruck, HiMagnifyingGlass } from "react-icons/hi2"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"

// ====================================
// THEME COLORS
// ====================================

const colors = {
  utilitiesBarBg: "#F9F5F3",
  mainBg: "#FFFFFF",
  mutedBrown: "#867671",
  darkBrown: "#4A3535",
  logoBrown: "#5A3D3D",
  logoOrange: "#5A3D3D",
  darkBorder: "#4A3535",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  transition: "all 0.3s ease",
}

// ====================================
// STYLE OBJECTS
// ====================================

const styles = {
  // Main Navbar Container
  navbar: {
    backgroundColor: colors.mainBg,
    fontFamily: sharedStyles.fontFamily,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },

  // ========== TOP ROW: UTILITY BAR ==========
  utilityBar: {
    backgroundColor: colors.utilitiesBarBg,
    padding: "0.4rem 0",
    borderBottom: `1px solid rgba(0, 0, 0, 0.06)`,
  },
  utilityContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1400px",
    margin: "0 auto",
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
  utilityGroup: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },
  utilityLink: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    color: colors.mutedBrown,
    textDecoration: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
    letterSpacing: "0.5px",
  },
  utilityLinkHover: {
    color: colors.darkBrown,
  },

  // ========== MIDDLE ROW: HEADER & SEARCH ==========
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    backgroundColor: colors.mainBg,
    maxWidth: "1400px",
    margin: "0 auto",
    gap: "2rem",
    flexWrap: "wrap",
  },

  // Logo Section
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: "120px",
  },
  logoText: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: colors.logoOrange,
    margin: 0,
    letterSpacing: "1px",
  },
  logoSubtext: {
    fontSize: "0.65rem",
    color: colors.mutedBrown,
    marginTop: "0.25rem",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  // Search Section
  searchSection: {
    display: "flex",
    flex: 1,
    minWidth: "300px",
    maxWidth: "600px",
  },
  searchContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    border: `2px solid ${colors.darkBrown}`,
    borderRadius: "50px",
    overflow: "hidden",
    backgroundColor: colors.mainBg,
  },
  searchInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: colors.darkBrown,
    backgroundColor: colors.mainBg,
  },
  searchButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1.25rem",
    backgroundColor: colors.darkBrown,
    border: "none",
    color: colors.mainBg,
    cursor: "pointer",
    fontSize: "1.3rem",
    transition: sharedStyles.transition,
    minWidth: "50px",
    minHeight: "100%",
  },
  searchButtonHover: {
    backgroundColor: colors.logoBrown,
  },

  // Icons Section
  iconsSection: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: "120px",
    position: "relative",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: colors.darkBrown,
    transition: sharedStyles.transition,
    padding: "0.5rem",
  },
  iconButtonHover: {
    color: colors.logoOrange,
    transform: "scale(1.1)",
  },

  // Dropdown Menu
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    minWidth: "200px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    padding: "0.5rem 0",
    zIndex: 1000,
    marginTop: "0.5rem",
    border: "1px solid #eee",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1.25rem",
    color: colors.darkBrown,
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "background 0.2s ease",
    cursor: "pointer",
    width: "100%",
    border: "none",
    background: "none",
    textAlign: "left",
  },
  dropdownItemHover: {
    backgroundColor: "#f8f9fa",
    color: colors.logoOrange,
  },

  // ========== BOTTOM ROW: NAVIGATION LINKS ==========
  navRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0.75rem 2rem",
    backgroundColor: colors.mainBg,
    borderTop: `1px solid rgba(0, 0, 0, 0.05)`,
    maxWidth: "1400px",
    margin: "0 auto",
  },
  navLinks: {
    display: "flex",
    gap: "3rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: colors.darkBrown,
    textDecoration: "none",
    cursor: "pointer",
    transition: sharedStyles.transition,
    letterSpacing: "0.3px",
  },
  navLinkHover: {
    color: colors.logoOrange,
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "0.5rem",
  },

  // ========== MOBILE RESPONSIVE ==========
  headerRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "1rem 1rem",
    gap: "1rem",
  },
  utilityContainerMobile: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  utilityGroupMobile: {
    gap: "1rem",
  },
  searchSectionMobile: {
    width: "100%",
    maxWidth: "100%",
    minWidth: "auto",
  },
  iconsSectionMobile: {
    width: "100%",
    justifyContent: "space-around",
    gap: "1rem",
  },
  navRowMobile: {
    padding: "0.5rem 1rem",
  },
  navLinksMobile: {
    gap: "1.5rem",
  },
}

// ====================================
// NAVBAR COMPONENT
// ====================================

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredLinks, setHoveredLinks] = useState({})
  const [hoveredSearchBtn, setHoveredSearchBtn] = useState(false)
  const [hoveredIconBtn, setHoveredIconBtn] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState(null)

  // Handle responsive design
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const handleResize = (e) => {
      setIsMobile(e.matches)
    }

    setIsMobile(mql.matches)
    mql.addEventListener("change", handleResize)
    return () => mql.removeEventListener("change", handleResize)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate("/")
  }

  // Utility bar links data
  const utilityLinks = [
    { 
      label: "(+86) 18168023963", 
      href: "tel:+8618168023963", 
      icon: <FiPhone style={{ marginRight: '0.5rem' }} size={14} /> 
    },
    { 
      label: "peptadoll@gmail.com", 
      href: "mailto:peptadoll@gmail.com", 
      icon: <FiMail style={{ marginRight: '0.5rem' }} size={14} /> 
    },
  ]

  // Right-side utility links depend on auth state
  const utilityRightLinks = user
    ? [
        ...(user.role === "admin" ? [{ label: "ADMIN DASHBOARD", to: "/admin/dashboard" }] : []),
        { label: user.firstName || user.email?.split("@")[0] || "MY ACCOUNT", to: "/profile" },
        { label: "LOGOUT", action: handleLogout },
      ]
    : [
        { label: "LOGIN", to: "/login" },
        { label: "SIGNUP", to: "/register" },
      ]

  // Navigation links data
  const navLinks = [
    { label: "All Products", to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "About", to: "/about" },
  ]

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login")
    } else {
      setUserMenuOpen(!userMenuOpen)
    }
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('#user-profile-menu')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  return (
    <nav style={styles.navbar}>
      {/* ── DESKTOP: Utility Bar ── */}
      {!isMobile && (
        <div style={styles.utilityBar}>
          <div style={styles.utilityContainer}>
            <div style={styles.utilityGroup}>
              {utilityLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  style={{
                    ...styles.utilityLink,
                    display: 'flex',
                    alignItems: 'center',
                    ...(hoveredLinks[`utility-${index}`] ? styles.utilityLinkHover : {}),
                  }}
                  onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, [`utility-${index}`]: true })}
                  onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, [`utility-${index}`]: false })}
                >
                  {link.icon && link.icon}
                  {link.label}
                </a>
              ))}
            </div>
            <div style={styles.utilityGroup}>
              <a
                href="#"
                style={{
                  ...styles.utilityLink,
                  ...(hoveredLinks['track-order-utility'] ? styles.utilityLinkHover : {}),
                }}
                onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, 'track-order-utility': true })}
                onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, 'track-order-utility': false })}
              >
                TRACK MY ORDER
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP: Header & Search ── */}
      {!isMobile && (
        <div style={styles.headerRow}>
          <div style={styles.logoSection}>
            <Link to="/" style={{ display: 'block', cursor: 'pointer', textDecoration: 'none' }}>
              <img src="/images/products/logo.jpeg" alt="Pepta Logo" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
            </Link>
          </div>
          <div style={styles.searchSection}>
            <form onSubmit={handleSearch} style={{ display: "flex", width: "100%" }}>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search in Pepta"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                <button
                  type="submit"
                  style={{ ...styles.searchButton, ...(hoveredSearchBtn ? styles.searchButtonHover : {}) }}
                  onMouseEnter={() => setHoveredSearchBtn(true)}
                  onMouseLeave={() => setHoveredSearchBtn(false)}
                >
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>
          <div style={styles.iconsSection} id="user-profile-menu">
            <button
              style={{ ...styles.iconButton, ...(hoveredIconBtn === "user" || userMenuOpen ? styles.iconButtonHover : {}) }}
              onClick={handleProfileClick}
              onMouseEnter={() => setHoveredIconBtn("user")}
              onMouseLeave={() => setHoveredIconBtn(null)}
              aria-label="User Profile"
            >
              <FiUser />
            </button>
            {user && userMenuOpen && (
              <div style={styles.dropdown}>
                <Link to="/profile" style={{ ...styles.dropdownItem, ...(hoveredDropdownItem === 'profile' ? styles.dropdownItemHover : {}) }} onMouseEnter={() => setHoveredDropdownItem('profile')} onMouseLeave={() => setHoveredDropdownItem(null)} onClick={() => setUserMenuOpen(false)}>
                  <FiUser size={16} /> Profile
                </Link>
                <Link to="/profile" style={{ ...styles.dropdownItem, ...(hoveredDropdownItem === 'orders' ? styles.dropdownItemHover : {}) }} onMouseEnter={() => setHoveredDropdownItem('orders')} onMouseLeave={() => setHoveredDropdownItem(null)} onClick={() => setUserMenuOpen(false)}>
                  <FiShoppingCart size={16} /> Order History
                </Link>
                <button onClick={handleLogout} style={{ ...styles.dropdownItem, ...(hoveredDropdownItem === 'logout' ? styles.dropdownItemHover : {}) }} onMouseEnter={() => setHoveredDropdownItem('logout')} onMouseLeave={() => setHoveredDropdownItem(null)}>
                  <FiLogOut size={16} /> Sign Out
                </button>
              </div>
            )}
            <button
              style={{ ...styles.iconButton, ...(hoveredIconBtn === "cart" ? styles.iconButtonHover : {}), position: 'relative' }}
              onClick={() => navigate('/cart')}
              onMouseEnter={() => setHoveredIconBtn("cart")}
              onMouseLeave={() => setHoveredIconBtn(null)}
              aria-label="Shopping Cart"
            >
              <FiShoppingCart />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff' }}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP: Nav Links ── */}
      {!isMobile && (
        <div style={styles.navRow}>
          <ul style={styles.navLinks}>
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  style={{ ...styles.navLink, ...(hoveredLinks[`nav-${index}`] ? styles.navLinkHover : {}) }}
                  onMouseEnter={() => setHoveredLinks({ ...hoveredLinks, [`nav-${index}`]: true })}
                  onMouseLeave={() => setHoveredLinks({ ...hoveredLinks, [`nav-${index}`]: false })}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── MOBILE: Header row — Logo left, Search + Hamburger right ── */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', backgroundColor: colors.mainBg }}>
          <Link to="/" style={{ display: 'block', textDecoration: 'none' }}>
            <img src="/images/products/logo.jpeg" alt="Pepta Logo" style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Mobile Search Icon Button */}
            <button
              onClick={() => {
                setSearchOpen(prev => !prev)
                setMenuOpen(false)
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.darkBrown, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', fontSize: '1.3rem' }}
              aria-label="Toggle search"
            >
              {searchOpen ? <HiXMark /> : <HiMagnifyingGlass />}
            </button>
            {/* Hamburger Menu Button */}
            <button
              onClick={() => {
                setMenuOpen(prev => !prev)
                setSearchOpen(false)
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.darkBrown, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', fontSize: '1.6rem' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <HiXMark /> : <HiBars3 />}
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE: Expandable Search Bar ── */}
      {isMobile && searchOpen && (
        <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid rgba(0,0,0,0.08)`, backgroundColor: colors.mainBg }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                border: `1px solid ${colors.darkBrown}`,
                borderRadius: '50px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                color: colors.darkBrown,
                backgroundColor: colors.mainBg,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '50px',
                backgroundColor: colors.darkBrown,
                color: colors.mainBg,
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                transition: sharedStyles.transition,
              }}
            >
              <HiMagnifyingGlass style={{ fontSize: '1rem' }} />
            </button>
          </form>
        </div>
      )}

      {/* ── MOBILE: Hamburger Dropdown ── */}
      {isMobile && menuOpen && (
        <div style={{ backgroundColor: colors.mainBg, borderTop: `1px solid rgba(0,0,0,0.08)`, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>

          {/* Profile / Login */}
          <Link
            to={user ? '/profile' : '/login'}
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', color: colors.darkBrown, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, borderBottom: `1px solid rgba(0,0,0,0.06)` }}
          >
            <HiUser style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            {user ? (user.firstName || user.email?.split('@')[0] || 'My Profile') : 'Login'}
          </Link>

          {/* Cart with badge */}
          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', color: colors.darkBrown, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, borderBottom: `1px solid rgba(0,0,0,0.06)` }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <HiShoppingCart style={{ fontSize: '1.2rem' }} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalItems}
                </span>
              )}
            </div>
            Cart
            {totalItems > 0 && (
              <span style={{ fontSize: '0.8rem', color: colors.mutedBrown, fontWeight: 500 }}>({totalItems})</span>
            )}
          </Link>

          {/* Track My Order */}
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', color: colors.darkBrown, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, borderBottom: `1px solid rgba(0,0,0,0.06)` }}
          >
            <HiTruck style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            Track My Order
          </a>

          {/* Divider */}
          <div style={{ borderTop: `2px solid rgba(0,0,0,0.08)`, margin: '0.25rem 0' }} />

          {/* Existing Nav Links */}
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', padding: '0.9rem 1.25rem', color: colors.darkBrown, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, borderBottom: index < navLinks.length - 1 ? `1px solid rgba(0,0,0,0.06)` : 'none', letterSpacing: '0.3px' }}
            >
              {link.label}
            </Link>
          ))}

          {/* Sign Out if logged in */}
          {user && (
            <>
              <div style={{ borderTop: `2px solid rgba(0,0,0,0.08)`, margin: '0.25rem 0' }} />
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <FiLogOut style={{ fontSize: '1.1rem', flexShrink: 0 }} />
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

