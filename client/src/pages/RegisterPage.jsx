import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheck } from "react-icons/fa"

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
  benefitsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  benefitItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  benefitIcon: {
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
  benefitText: {
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
    marginBottom: "1.5rem",
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
    marginBottom: "1.25rem",
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
    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
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

  // Password Requirements
  requirements: {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  requirementItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  requirementDot: {
    width: "0.375rem",
    height: "0.375rem",
    backgroundColor: "#d1d5db",
    borderRadius: "50%",
    display: "inline-block",
  },
  requirementItemMet: {
    color: "#10b981",
  },
  requirementDotMet: {
    backgroundColor: "#10b981",
  },

  // Terms & Conditions
  termsBox: {
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    fontSize: "0.8rem",
    color: "#374151",
    lineHeight: 1.5,
    marginBottom: "1.5rem",
  },
  termsCheckbox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    marginBottom: "1rem",
    cursor: "pointer",
  },
  termsCheckboxInput: {
    width: "1rem",
    height: "1rem",
    marginTop: "0.125rem",
    cursor: "pointer",
    accentColor: "#1e293b",
    flexShrink: 0,
  },
  termsText: {
    fontSize: "0.8rem",
    color: "#374151",
  },
  termsLink: {
    color: "#1e293b",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s ease",
  },
  termsLinkHover: {
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const navigate = useNavigate()
  const { register } = useAuth()

  const isMobile = window.innerWidth < 768

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions")
      return
    }

    setLoading(true)
    register(formData.name, formData.email, formData.password)
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        setError(err.message || "Registration failed. Please try again.")
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
              Join 10,000+ Businesses
            </div>
            <h1 style={styles.mainTitle}>Start Your Wholesale Journey</h1>
            <p style={styles.subtitle}>Join the fastest growing wholesale marketplace for gadgets and electronics</p>

            <div style={styles.benefitsList}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaCheck />
                </div>
                <div style={styles.benefitText}>
                  <strong>Exclusive Discounts</strong> - Up to 40% off for wholesale members
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaCheck />
                </div>
                <div style={styles.benefitText}>
                  <strong>Bulk Pricing</strong> - Tiered discounts based on order volume
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaCheck />
                </div>
                <div style={styles.benefitText}>
                  <strong>Fast Shipping</strong> - Priority fulfillment for bulk orders
                </div>
              </div>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaCheck />
                </div>
                <div style={styles.benefitText}>
                  <strong>24/7 Support</strong> - Dedicated account managers for your business
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...styles.formCard, ...(isMobile ? styles.formCardMobile : {}) }}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Start selling wholesale today</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Full Name
              </label>
              <div style={styles.inputWrapper}>
                <FaUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    ...(focusedField === "name" ? styles.inputFocus : {}),
                  }}
                  disabled={loading}
                />
              </div>
            </div>

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
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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
              {formData.password && (
                <div style={styles.requirements}>
                  <div
                    style={{
                      ...styles.requirementItem,
                      ...(formData.password.length >= 6 ? styles.requirementItemMet : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.requirementDot,
                        ...(formData.password.length >= 6 ? styles.requirementDotMet : {}),
                      }}
                    />
                    At least 6 characters
                  </div>
                  <div
                    style={{
                      ...styles.requirementItem,
                      ...(/[A-Z]/.test(formData.password) ? styles.requirementItemMet : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.requirementDot,
                        ...(/[A-Z]/.test(formData.password) ? styles.requirementDotMet : {}),
                      }}
                    />
                    One uppercase letter
                  </div>
                  <div
                    style={{
                      ...styles.requirementItem,
                      ...(/[0-9]/.test(formData.password) ? styles.requirementItemMet : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.requirementDot,
                        ...(/[0-9]/.test(formData.password) ? styles.requirementDotMet : {}),
                      }}
                    />
                    One number
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaLock style={styles.labelIcon} />
                Confirm Password
              </label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...styles.input,
                    paddingRight: "2.5rem",
                    ...(focusedField === "confirmPassword" ? styles.inputFocus : {}),
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.togglePasswordIcon}
                  onMouseEnter={(e) => (e.target.style.color = "#111827")}
                  onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div style={styles.termsBox}>
              <div style={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={styles.termsCheckboxInput}
                  disabled={loading}
                />
                <span style={styles.termsText}>
                  I agree to the{" "}
                  <a
                    href="#"
                    style={styles.termsLink}
                    onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                    onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={styles.termsLink}
                    onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                    onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
                  >
                    Privacy Policy
                  </a>
                </span>
              </div>
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
              {loading ? "Creating Account..." : (
                <>
                  Create Account <FaArrowRight style={{ fontSize: "0.875rem" }} />
                </>
              )}
            </button>

            {/* Footer */}
            <div style={styles.footer}>
              Already have an account?
              <a
                href="/login"
                style={styles.footerLink}
                onMouseEnter={(e) => (e.target.style.color = "#1e40af")}
                onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
