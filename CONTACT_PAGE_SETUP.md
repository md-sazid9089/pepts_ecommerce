# Contact Page Setup & Integration Guide

## Quick Start

The Contact Page has been fully implemented in `client/src/pages/ContactPage.jsx` and is already routed at `/contact`.

## Frontend Implementation ✓

### What's Included:

1. **Contact Information Section**
   - 3-card layout with Address, Email, Phone
   - Social media links (LinkedIn, Facebook, Twitter, Instagram)
   - Hover animations and responsive design

2. **Contact Form Section**
   - Form fields: Name, Email, Inquiry Type (dropdown), Message
   - Built-in validation
   - Success/error feedback
   - Loading state during submission

3. **Map Section**
   - Embedded Google Maps
   - Fully responsive
   - Easy to customize with your location

## Customization Steps

### Step 1: Update Contact Information

Edit `client/src/pages/ContactPage.jsx` (lines ~260-280):

```javascript
const contactData = [
  {
    id: 1,
    icon: FiMapPin,
    label: "Address",
    value: "YOUR_ACTUAL_ADDRESS_HERE",
    link: "#",
  },
  {
    id: 2,
    icon: FiMail,
    label: "Email",
    value: "YOUR_EMAIL@company.com",
    link: "mailto:YOUR_EMAIL@company.com",
  },
  {
    id: 3,
    icon: FiPhone,
    label: "Phone",
    value: "+1 (YOUR) PHONE-NUMBER | Fax: +1 (YOUR) FAX-NUMBER",
    link: "tel:+1YOURPHONENUMBER",
  },
]
```

### Step 2: Update Social Media Links

Edit `client/src/pages/ContactPage.jsx` (lines ~280-290):

```javascript
const socialLinks = [
  { icon: FaLinkedinIn, link: "https://linkedin.com/company/YOUR_COMPANY", label: "LinkedIn" },
  { icon: FaFacebookF, link: "https://facebook.com/YOUR_COMPANY", label: "Facebook" },
  { icon: FaTwitter, link: "https://twitter.com/YOUR_COMPANY", label: "Twitter" },
  { icon: FaInstagram, link: "https://instagram.com/YOUR_COMPANY", label: "Instagram" },
]
```

### Step 3: Add Your Google Maps Location

1. Go to [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
2. Get your embed code
3. Replace the `src` in `MapSection` component (line ~430):

```javascript
<iframe
  style={mapStyles.iframe}
  src="YOUR_GOOGLE_MAPS_EMBED_CODE_HERE"
  // ... rest of attributes
/>
```

Example of embed URL structure:
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d[COORDINATES]!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s[LOCATION]!5e0!3m2!1sen!2sus!4v[VERSION]
```

## Backend Integration (Optional but Recommended)

### Option 1: Simple Email Service Integration

#### Step 1: Install Email Package

```bash
cd server
npm install nodemailer  # or your preferred email service
```

#### Step 2: Create Contact API Endpoint

Create `server/src/services/contact.service.js`:

```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendContactEmail = async (contactData) => {
  const { name, email, inquiryType, message } = contactData

  try {
    // Send email to admin
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
        <p>${message}</p>
      `,
    })

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your inquiry',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your inquiry and will get back to you soon.</p>
        <p>Best regards,<br>Our Team</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    throw error
  }
}
```

#### Step 3: Create API Route

Create `server/app/api/contact/route.js`:

```javascript
import { sendContactEmail } from '@/services/contact.service'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email
    await sendContactEmail(body)

    return Response.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

#### Step 4: Update Frontend Form Submission

In `client/src/pages/ContactPage.jsx`, replace the mock API call (~line 410) with:

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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send message')
    }

    const data = await response.json()
    console.log("Form submitted successfully:", data)
    
    setSubmitted(true)
    setFormData({
      name: "",
      email: "",
      inquiryType: "Product Inquiry",
      message: "",
    })

    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  } catch (err) {
    setError(err.message || "Failed to send message. Please try again.")
    console.error(err)
  } finally {
    setIsSubmitting(false)
  }
}
```

#### Step 5: Configure Environment Variables

Add to `server/.env`:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@company.com
```

### Option 2: Third-Party Service Integration

#### Using Resend (Recommended for Production)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install: `npm install resend`
4. Update the contact service:

```javascript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendContactEmail = async (contactData) => {
  const { name, email, inquiryType, message } = contactData

  try {
    await resend.emails.send({
      from: 'noreply@company.com',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Inquiry: ${inquiryType}`,
      html: `<h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Type:</strong> ${inquiryType}</p>
        <p><strong>Message:</strong> ${message}</p>`,
    })

    return { success: true }
  } catch (error) {
    console.error('Resend error:', error)
    throw error
  }
}
```

## Database Storage (Optional)

To store contact inquiries in your database:

#### Step 1: Update Prisma Schema

In `server/prisma/schema.prisma`:

```prisma
model ContactInquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  inquiryType String
  message   String   @db.Text
  status    String   @default("new") // new, replied, closed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([createdAt])
}
```

#### Step 2: Create Database Service

Create `server/src/services/inquiry.service.js`:

```javascript
import { prisma } from '@/lib/prisma'

export const createInquiry = async (contactData) => {
  return prisma.contactInquiry.create({
    data: {
      name: contactData.name,
      email: contactData.email,
      inquiryType: contactData.inquiryType,
      message: contactData.message,
    },
  })
}

export const getInquiries = async (filters = {}) => {
  return prisma.contactInquiry.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' },
  })
}
```

#### Step 3: Update API Route

```javascript
import { createInquiry } from '@/services/inquiry.service'
import { sendContactEmail } from '@/services/contact.service'

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const inquiry = await createInquiry(body)

    // Send email
    await sendContactEmail(body)

    return Response.json(
      { success: true, inquiryId: inquiry.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

## Testing the Contact Page

### 1. Test Without Backend
```bash
cd client
npm run dev
# Visit http://localhost:5173/contact
# Fill and submit form (will show success message)
```

### 2. Test With Backend

First, set up backend:
```bash
cd server
npm install
# Add environment variables to .env
npm run dev
```

Then test frontend:
```bash
cd client
npm run dev
# Visit http://localhost:5173/contact
# Submit form and check admin email
```

### 3. Form Validation Tests
- [ ] Empty name shows error
- [ ] Invalid email shows error
- [ ] Empty message shows error
- [ ] Valid form submits successfully
- [ ] Success message appears
- [ ] Form clears after submission

## Deployment Checklist

- [ ] Update contact information with real details
- [ ] Add your Google Maps embed code
- [ ] Connect to email service
- [ ] Test form submission end-to-end
- [ ] Verify emails are being sent
- [ ] Test on mobile devices
- [ ] Add CAPTCHA if needed (optional)
- [ ] Set up admin email notifications
- [ ] Configure error logging
- [ ] Add analytics tracking (optional)

## Troubleshooting

### Form shows success but email not received
- Check email service credentials in `.env`
- Verify admin email address is correct
- Check email spam folder
- Enable "Less secure apps" for Gmail (if using)

### Map not displaying
- Verify Google Maps API key is active
- Check embed URL is correct
- Clear browser cache
- Test in incognito mode

### Validation not working
- Clear browser console errors
- Check form field names match state
- Verify regex email pattern

## Additional Resources

- [React Forms Documentation](https://react.dev/learn/sharing-state-between-components)
- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Resend Email Service](https://resend.com)
- [Form Validation Best Practices](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API failures
3. Email service logs
4. Backend server logs
