import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { FiMapPin, FiPhone, FiMail, FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi"
import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa"

// ====================================
// CONSTANTS
// ====================================
const colors = {
  darkBrown: "#533638",
  lightBg: "#F5EDEC",
  white: "#FFFFFF",
  mutedBrown: "#8B6F6F",
  success: "#10B981",
  error: "#EF4444",
  inputBorder: "#E5D9D6",
  shadowColor: "rgba(0, 0, 0, 0.08)",
}

const sharedStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  transition: "all 0.3s ease",
}

const MOBILE_BREAKPOINT = 768
const FORM_SUBMIT_DELAY = 1000
const SUCCESS_MESSAGE_DURATION = 5000

// ====================================
// CUSTOM HOOKS
// ====================================
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])
  
  return matches
}


// ====================================
// CONTACT INFORMATION SECTION
// ====================================
const ContactInfoSection = ({ contactInfoStyles }) => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const contactData = useMemo(() => [
    {
      id: 1,
      icon: FiMapPin,
      label: "Address",
      value: "123 Business Plaza, Commerce City, CC 12345",
      link: "#",
    },
    {
      id: 2,
      icon: FiMail,
      label: "Email",
      value: "business@company.com",
      link: "mailto:business@company.com",
    },
    {
      id: 3,
      icon: FiPhone,
      label: "Phone",
      value: "+1 (555) 123-4567 | Fax: +1 (555) 123-4568",
      link: "tel:+15551234567",
    },
  ], [])

  const socialLinks = useMemo(() => [
    { icon: FaLinkedinIn, link: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaFacebookF, link: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, link: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, link: "https://instagram.com", label: "Instagram" },
  ], [])

  const handleCardHover = useCallback((id) => setHoveredCard(id), [])
  const handleCardLeave = useCallback(() => setHoveredCard(null), [])
  const handleSocialHover = useCallback((idx) => setHoveredSocial(idx), [])
  const handleSocialLeave = useCallback(() => setHoveredSocial(null), [])

  return (
    <section style={contactInfoStyles.container}>
      <div style={contactInfoStyles.maxWidth}>
        <h1 style={contactInfoStyles.title}>Get in Touch</h1>
        <p style={contactInfoStyles.subtitle}>
          Have a question or business inquiry? We'd love to hear from you. Reach out using any of the methods below.
        </p>

        <div style={contactInfoStyles.grid}>
          {contactData.map((item) => {
            const IconComponent = item.icon
            return (
              <a
                key={item.id}
                href={item.link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={() => handleCardHover(item.id)}
                onMouseLeave={handleCardLeave}
                aria-label={`${item.label}: ${item.value}`}
              >
                <div
                  style={{
                    ...contactInfoStyles.card,
                    ...(hoveredCard === item.id ? contactInfoStyles.cardHover : {}),
                  }}
                >
                  <div style={contactInfoStyles.icon} aria-hidden="true">
                    <IconComponent />
                  </div>
                  <p style={contactInfoStyles.label}>{item.label}</p>
                  <p style={contactInfoStyles.value}>{item.value}</p>
                </div>
              </a>
            )
          })}
        </div>

        <div style={contactInfoStyles.socialLinks}>
          {socialLinks.map((social, idx) => {
            const IconComponent = social.icon
            return (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                aria-label={`Visit our ${social.label} page`}
                style={{
                  ...contactInfoStyles.socialIcon,
                  ...(hoveredSocial === idx ? contactInfoStyles.socialIconHover : {}),
                }}
                onMouseEnter={() => handleSocialHover(idx)}
                onMouseLeave={handleSocialLeave}
              >
                <IconComponent aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ====================================
// CONTACT FORM SECTION
// ====================================
const ContactFormSection = ({ formStyles, isMobile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Product Inquiry",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timeoutRef = useRef(null)
  const successTimeoutRef = useRef(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    }
  }, [])

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      setError("Please enter your email")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.message.trim()) {
      setError("Please enter your message")
      return false
    }
    return true
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulating API call - replace with actual API endpoint
      timeoutRef.current = setTimeout(() => {
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          inquiryType: "Product Inquiry",
          message: "",
        })

        // Reset success message after duration
        successTimeoutRef.current = setTimeout(() => {
          setSubmitted(false)
        }, SUCCESS_MESSAGE_DURATION)
      }, FORM_SUBMIT_DELAY)
    } catch (err) {
      setError("Failed to send message. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm])

  const handleFocus = useCallback((fieldName) => {
    setFocusedField(fieldName)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedField(null)
  }, [])

  const handleMouseEnter = useCallback((e) => {
    if (!isSubmitting) {
      e.currentTarget.style.backgroundColor = colors.mutedBrown
      e.currentTarget.style.transform = "translateY(-2px)"
    }
  }, [isSubmitting])

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.backgroundColor = colors.darkBrown
    e.currentTarget.style.transform = "translateY(0)"
  }, [])

  return (
    <section style={formStyles.container}>
      <div style={formStyles.maxWidth}>
        <h2 style={formStyles.title}>Send us a Message</h2>

        {submitted && (
          <div style={formStyles.successMessage} role="alert">
            <FiCheckCircle size={20} aria-hidden="true" />
            <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
          </div>
        )}

        {error && (
          <div style={formStyles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <form style={formStyles.form} onSubmit={handleSubmit}>
          {/* Name and Email Row */}
          <div style={isMobile ? formStyles.rowGridSingle : formStyles.rowGrid}>
            <div style={formStyles.formGroup}>
              <label htmlFor="name" style={formStyles.label}>
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                aria-required="true"
                style={{
                  ...formStyles.input,
                  ...(focusedField === "name" ? formStyles.inputFocus : {}),
                }}
              />
            </div>
            <div style={formStyles.formGroup}>
              <label htmlFor="email" style={formStyles.label}>
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                aria-required="true"
                style={{
                  ...formStyles.input,
                  ...(focusedField === "email" ? formStyles.inputFocus : {}),
                }}
              />
            </div>
          </div>

          {/* Inquiry Type */}
          <div style={formStyles.formGroup}>
            <label htmlFor="inquiryType" style={formStyles.label}>
              Inquiry Type
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              onFocus={() => handleFocus("inquiryType")}
              onBlur={handleBlur}
              aria-label="Inquiry Type"
              style={{
                ...formStyles.input,
                ...(focusedField === "inquiryType" ? formStyles.inputFocus : {}),
              }}
            >
              <option value="Product Inquiry">Product Inquiry</option>
              <option value="Support">Support</option>
              <option value="Business Partnership">Business Partnership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div style={formStyles.formGroup}>
            <label htmlFor="message" style={formStyles.label}>
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Please tell us more about your inquiry..."
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={handleBlur}
              aria-required="true"
              style={{
                ...formStyles.textarea,
                ...(focusedField === "message" ? formStyles.textareaFocus : {}),
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={isSubmitting ? "Sending your message" : "Send message"}
            style={{
              ...formStyles.button,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            <FiSend size={18} aria-hidden="true" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  )
}

// ====================================
// MAP SECTION
// ====================================
const MapSection = ({ mapStyles }) => {
  return (
    <section style={mapStyles.container}>
      <h2 style={mapStyles.title}>Our Location</h2>
      <div style={mapStyles.mapWrapper}>
        <iframe
          style={mapStyles.iframe}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1e8b5e5e5d%3A0x1234567890ab!2s123%20Business%20Plaza!5e0!3m2!1sen!2sus!4v1234567890"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Business Location"
        />
      </div>
    </section>
  )
}

// ====================================
// MAIN CONTACT PAGE COMPONENT
// ====================================
const ContactPage = () => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`)

  // Memoize style objects to prevent unnecessary recreations
  const contactInfoStyles = useMemo(() => ({
    container: {
      backgroundColor: colors.lightBg,
      padding: "60px 20px",
      fontFamily: sharedStyles.fontFamily,
    },
    maxWidth: {
      maxWidth: "1300px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: colors.darkBrown,
      marginBottom: "10px",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "1.1rem",
      color: colors.mutedBrown,
      textAlign: "center",
      marginBottom: "50px",
      maxWidth: "600px",
      margin: "0 auto",
      marginTop: "10px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      marginBottom: "50px",
    },
    card: {
      backgroundColor: colors.white,
      padding: "30px",
      borderRadius: "12px",
      boxShadow: `0 4px 12px ${colors.shadowColor}`,
      textAlign: "center",
      transition: sharedStyles.transition,
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: `0 8px 20px ${colors.shadowColor}`,
    },
    icon: {
      fontSize: "2.5rem",
      color: colors.darkBrown,
      marginBottom: "15px",
      display: "inline-block",
    },
    label: {
      fontSize: "0.9rem",
      color: colors.mutedBrown,
      fontWeight: 600,
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    value: {
      fontSize: "1.1rem",
      color: colors.darkBrown,
      fontWeight: 600,
      marginBottom: "15px",
    },
    socialLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginTop: "30px",
    },
    socialIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: colors.darkBrown,
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1rem",
      cursor: "pointer",
      transition: sharedStyles.transition,
    },
    socialIconHover: {
      transform: "scale(1.1)",
      backgroundColor: colors.mutedBrown,
    },
  }), [])

  const formStyles = useMemo(() => ({
    container: {
      backgroundColor: colors.white,
      padding: "60px 20px",
      fontFamily: sharedStyles.fontFamily,
    },
    maxWidth: {
      maxWidth: "700px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: 700,
      color: colors.darkBrown,
      marginBottom: "40px",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "0.95rem",
      fontWeight: 600,
      color: colors.darkBrown,
      marginBottom: "5px",
    },
    input: {
      padding: "12px 16px",
      fontSize: "1rem",
      border: `2px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      fontFamily: sharedStyles.fontFamily,
      transition: sharedStyles.transition,
      backgroundColor: "#FEFAF9",
    },
    inputFocus: {
      borderColor: colors.darkBrown,
      outline: "none",
      backgroundColor: colors.white,
      boxShadow: `0 0 0 3px rgba(83, 54, 56, 0.1)`,
    },
    textarea: {
      padding: "12px 16px",
      fontSize: "1rem",
      border: `2px solid ${colors.inputBorder}`,
      borderRadius: "8px",
      fontFamily: sharedStyles.fontFamily,
      minHeight: "150px",
      resize: "vertical",
      transition: sharedStyles.transition,
      backgroundColor: "#FEFAF9",
    },
    textareaFocus: {
      borderColor: colors.darkBrown,
      outline: "none",
      backgroundColor: colors.white,
      boxShadow: `0 0 0 3px rgba(83, 54, 56, 0.1)`,
    },
    rowGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    rowGridSingle: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    button: {
      padding: "14px 32px",
      fontSize: "1rem",
      fontWeight: 600,
      backgroundColor: colors.darkBrown,
      color: colors.white,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: sharedStyles.transition,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginTop: "10px",
    },
    buttonHover: {
      backgroundColor: colors.mutedBrown,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px ${colors.shadowColor}`,
    },
    successMessage: {
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#ECFDF5",
      border: `2px solid ${colors.success}`,
      color: colors.success,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    errorMessage: {
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#FEF2F2",
      border: `2px solid ${colors.error}`,
      color: colors.error,
      marginBottom: "20px",
    },
  }), [])

  const mapStyles = useMemo(() => ({
    container: {
      backgroundColor: colors.lightBg,
      padding: "60px 20px",
      fontFamily: sharedStyles.fontFamily,
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: 700,
      color: colors.darkBrown,
      marginBottom: "40px",
      textAlign: "center",
    },
    mapWrapper: {
      maxWidth: "100%",
      margin: "0 auto",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: `0 10px 40px ${colors.shadowColor}`,
      height: isMobile ? "300px" : "500px",
      width: "100%",
    },
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
  }), [isMobile])

  return (
    <div style={{ fontFamily: sharedStyles.fontFamily }}>
      <ContactInfoSection contactInfoStyles={contactInfoStyles} />
      <ContactFormSection formStyles={formStyles} isMobile={isMobile} />
      <MapSection mapStyles={mapStyles} />
    </div>
  )
}

export default ContactPage
