# Contact Page - Code Snippets & Examples

## 📝 Quick Copy-Paste Customizations

### 1. Update Company Information

**Location**: `client/src/pages/ContactPage.jsx` (Lines ~260-280)

```javascript
const contactData = [
  {
    id: 1,
    icon: FiMapPin,
    label: "Address",
    value: "789 Commerce Street, Suite 100, New York, NY 10001",
    link: "#",
  },
  {
    id: 2,
    icon: FiMail,
    label: "Email",
    value: "inquiries@yourcompany.com",
    link: "mailto:inquiries@yourcompany.com",
  },
  {
    id: 3,
    icon: FiPhone,
    label: "Phone",
    value: "+1 (212) 555-0100 | Fax: +1 (212) 555-0101",
    link: "tel:+12125550100",
  },
]
```

### 2. Update Social Media Links

**Location**: `client/src/pages/ContactPage.jsx` (Lines ~283-290)

```javascript
const socialLinks = [
  { 
    icon: FaLinkedinIn, 
    link: "https://linkedin.com/company/your-company", 
    label: "LinkedIn" 
  },
  { 
    icon: FaFacebookF, 
    link: "https://facebook.com/yourcompany", 
    label: "Facebook" 
  },
  { 
    icon: FaTwitter, 
    link: "https://twitter.com/yourcompany", 
    label: "Twitter" 
  },
  { 
    icon: FaInstagram, 
    link: "https://instagram.com/yourcompany", 
    label: "Instagram" 
  },
]
```

### 3. Update Google Maps Location

**Location**: `client/src/pages/ContactPage.jsx` (Line ~430)

```javascript
<iframe
  style={mapStyles.iframe}
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1502984374!2d-74.00601!3d40.71282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a20e5e5e5e5%3A0x1234567890abcdef!2s789%20Commerce%20Street!5e0!3m2!1sen!2sus!4v1234567890"
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Business Location"
/>
```

**How to get your Google Maps embed code:**
1. Open Google Maps
2. Search for your business location
3. Click "Share"
4. Select "Embed a map"
5. Copy the iframe src URL
6. Paste it above

### 4. Connect to Email Service (Backend)

**Create**: `server/src/services/contact.service.js`

```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendContactEmail = async ({ name, email, inquiryType, message }) => {
  try {
    // Send to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Inquiry: ${inquiryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Message:</strong></p>
        <pre>${message}</pre>
      `,
    })

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your inquiry',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will respond within 24 hours.</p>
        <p>Best regards,<br>Our Team</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}
```

### 5. Create Backend API Route

**Create**: `server/app/api/contact/route.js`

```javascript
import { sendContactEmail } from '@/services/contact.service'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, message } = body
    
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email
    await sendContactEmail(body)

    return Response.json(
      { success: true, message: 'Your inquiry has been sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return Response.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
```

### 6. Update Frontend Form Submission

**Location**: `client/src/pages/ContactPage.jsx` (Replace ~410-430 in handleSubmit)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  if (!validateForm()) return

  setIsSubmitting(true)
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message')
    }

    setSubmitted(true)
    setFormData({
      name: "",
      email: "",
      inquiryType: "Product Inquiry",
      message: "",
    })

    // Auto-hide success message
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  } catch (err) {
    setError(err.message || "Failed to send message. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}
```

### 7. Add CAPTCHA (Optional)

**Install**: `npm install react-google-recaptcha`

**Update Form**:
```javascript
import ReCAPTCHA from "react-google-recaptcha"

// In state
const [captchaToken, setCaptchaToken] = useState(null)

// In form (before submit button)
<div style={formStyles.formGroup}>
  <ReCAPTCHA
    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
    onChange={(token) => setCaptchaToken(token)}
  />
</div>

// In validation
if (!captchaToken) {
  setError("Please verify you're not a robot")
  return false
}
```

### 8. Add Offline Detection

**Add to ContactFormSection**:
```javascript
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

// In render (before form)
{!isOnline && (
  <div style={{
    padding: "16px",
    backgroundColor: "#FEF3C7",
    border: "2px solid #F59E0B",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#78350F"
  }}>
    ⚠️ You are offline. Message will be sent when connection is restored.
  </div>
)}
```

### 9. Environment Variables Setup

**Create/Update**: `.env` or `.env.local`

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@yourcompany.com

# reCAPTCHA (Optional)
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key_here

# API
REACT_APP_API_URL=http://localhost:3000
```

### 10. Database Schema (Prisma)

**Update**: `server/prisma/schema.prisma`

```prisma
model ContactInquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  inquiryType String
  message   String   @db.Text
  status    String   @default("new")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([status])
  @@index([createdAt])
}
```

**Run migration**:
```bash
npx prisma migrate dev --name add_contact_inquiry
```

### 11. Add to Navigation Menu

**Update**: Your navigation component

```javascript
import { Link } from 'react-router-dom'

<Link to="/contact" className="nav-link">
  Contact
</Link>
```

### 12. Add Analytics Tracking

**Update handleSubmit**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Track form submission
  if (window.gtag) {
    window.gtag('event', 'contact_form_submit', {
      inquiry_type: formData.inquiryType,
      timestamp: new Date().toISOString(),
    })
  }
  
  // ... rest of submission logic
}
```

## 🎨 Customizing Colors

All colors are defined at the top of `ContactPage.jsx`:

```javascript
const colors = {
  darkBrown: "#533638",      // Primary text & buttons
  lightBg: "#F5EDEC",        // Background sections
  white: "#FFFFFF",          // Card backgrounds
  mutedBrown: "#8B6F6F",     // Secondary text
  success: "#10B981",        // Success messages
  error: "#EF4444",          // Error messages
  inputBorder: "#E5D9D6",    // Form borders
  shadowColor: "rgba(0, 0, 0, 0.08)",
}
```

Change these to match your brand colors.

## 📱 Responsive Design Adjustments

Add this hook for responsive behavior:

```javascript
const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Use in component
<div style={isMobile ? mobileStyles : desktopStyles}>
  {/* content */}
</div>
```

## 🔐 Security Best Practices

1. **Server-side validation** (always validate on backend)
2. **Sanitize input** (remove HTML/scripts)
3. **Rate limiting** (limit submissions per IP)
4. **CAPTCHA** (prevent bot submissions)
5. **HTTPS** (always use for form submission)
6. **Environment variables** (never commit credentials)

```javascript
// Basic server-side sanitization
import DOMPurify from 'dompurify'

const sanitizedMessage = DOMPurify.sanitize(message)
```

---

**Version**: 1.0  
**Last Updated**: April 24, 2026
