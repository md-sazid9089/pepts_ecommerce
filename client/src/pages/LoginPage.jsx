import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaPhone } from "react-icons/fa"

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
    padding: "1rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  contentWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    maxWidth: "1200px",
    width: "100%",
    alignItems: "center",
  },
  contentWrapperMobile: {
    gridTemplateColumns: "1fr",
    gap: "2rem",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "fit-content",
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(30, 41, 59, 0.08)",
    border: "1px solid rgba(30, 41, 59, 0.15)",
    borderRadius: "2rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#1e293b",
  },
  badgeDot: {
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },
  mainTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.2,
    margin: 0,
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },
  featuresList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  featureItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  featureIcon: {
    width: "1.5rem",
    height: "1.5rem",
    minWidth: "1.5rem",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: "0.375rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#10b981",
    fontSize: "0.875rem",
  },
  featureText: {
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: 1.5,
  },

  // Form Card
  formCard: {
    background: "#ffffff",
    borderRadius: "0.75rem",
    padding: "2.5rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  formCardMobile: {
    padding: "1.5rem",
  },
  formHeader: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  formTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 0.5rem 0",
  },
  formSubtitle: {
    fontSize: "0.95rem",
    color: "#6b7280",
    margin: 0,
  },

  // Form Group
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  labelIcon: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "0.75rem",
    color: "#9ca3af",
    fontSize: "1rem",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.875rem 0.75rem 0.875rem 2.5rem",
    fontSize: "0.95rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    background: "#ffffff",
    color: "#111827",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    outline: "none",
  },
  inputFocus: {
    borderColor: "#1e293b",
    boxShadow: "0 0 0 3px rgba(30, 41, 59, 0.1)",
  },
  togglePasswordIcon: {
    position: "absolute",
    right: "0.75rem",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: "0.875rem",
    background: "none",
    border: "none",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },
  togglePasswordIconHover: {
    color: "#111827",
  },

  // Checkbox Row
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
    accentColor: "#1e293b",
  },
  checkboxLabel: {
    fontSize: "0.875rem",
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
  },
  forgotPassword: {
    fontSize: "0.875rem",
    color: "#1e293b",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s ease",
  },
  forgotPasswordHover: {
    color: "#1e40af",
  },

  // Error Message
  errorBox: {
    padding: "1rem",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "0.5rem",
    color: "#991b1b",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorIcon: {
    flexShrink: 0,
    fontSize: "1rem",
  },

  // Submit Button
  submitBtn: {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    marginBottom: "1rem",
  },
  submitBtnHover: {
    backgroundColor: "#0f172a",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(30, 41, 59, 0.3)",
  },
  submitBtnDisabled: {
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
    transform: "none",
  },

  // Social Button
  socialBtn: {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
    marginBottom: "1rem",
  },
  socialBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
  socialBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  // Divider
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "1.5rem 0",
    color: "#9ca3af",
    fontSize: "0.875rem",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e5e7eb",
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  footerLink: {
    color: "#1e293b",
    textDecoration: "none",
    fontWeight: 600,
    transition: "color 0.2s ease",
    marginLeft: "0.25rem",
  },
  footerLinkHover: {
    color: "#1e40af",
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const isMobile = window.innerWidth < 768

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    login(email, password)
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        setError(err.message || "Login failed. Please check your credentials.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div style={styles.pageContainer}>
      <div style={{ ...styles.contentWrapper, ...(isMobile ? styles.contentWrapperMobile : {}) }}>
        {!isMobile && (
          <div style={styles.leftSection}>
            <div style={styles.badge}>
              <div style={styles.badgeDot} />
              Secure & Fast
            </div>
            <h1 style={styles.mainTitle}>Welcome Back to Pepta</h1>
            <p style={styles.subtitle}>Your trusted wholesale marketplace for premium electronics and gadgets</p>

            <div style={styles.featuresList}>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <div style={styles.featureText}>
                  <strong>Track Orders</strong> - Real-time tracking for all your wholesale orders
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <div style={styles.featureText}>
                  <strong>Bulk Discounts</strong> - Exclusive tiered pricing for wholesale buyers
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <div style={styles.featureText}>
                  <strong>Personal Support</strong> - Dedicated wholesale account managers
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...styles.formCard, ...(isMobile ? styles.formCardMobile : {}) }}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign In</h2>
            <p style={styles.formSubtitle}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaEnvelope style={styles.labelIcon} />
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "email" ? styles.inputFocus : {}),
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaLock style={styles.labelIcon} />
                Password
              </label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    paddingRight: "2.5rem",
                    ...(focusedField === "password" ? styles.inputFocus : {}),
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordIcon}
                  onMouseEnter={(e) => (e.target.style.color = "#111827")}
                  onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.checkboxRow}>
              <label style={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                  disabled={loading}
                />
                <span style={styles.checkboxLabel}>Remember me</span>
              </label>
              <a
                href="#"
                style={styles.forgotPassword}
                onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(hoveredBtn === "submit" && !loading ? styles.submitBtnHover : {}),
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
              onMouseEnter={() => setHoveredBtn("submit")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {loading ? "Signing in..." : (
                <>
                  Sign In <FaArrowRight style={{ fontSize: "0.875rem" }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span>or</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social Login */}
          <button
            type="button"
            disabled={loading}
            style={{
              ...styles.socialBtn,
              ...(hoveredBtn === "phone" && !loading ? styles.socialBtnHover : {}),
              ...(loading ? styles.socialBtnDisabled : {}),
            }}
            onMouseEnter={() => setHoveredBtn("phone")}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <FaPhone style={{ fontSize: "0.875rem" }} />
            Continue with Phone
          </button>

          {/* Footer */}
          <div style={styles.footer}>
            Don&apos;t have an account?
            <a
              href="/register"
              style={styles.footerLink}
              onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
              onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
            >
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
