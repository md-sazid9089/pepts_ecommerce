# Contact Page Implementation Guide

## Overview
This document provides a comprehensive guide for the Contact Page implementation for your B2B Wholesale E-commerce website. The Contact Page has been fully implemented as per your specifications.

## Page Structure

### 1. Contact Information Section
**Location:** Top of the page  
**Purpose:** Display multiple ways for customers to reach out

**Components:**
- **Address Card**: Shows physical business location
- **Email Card**: Displays business email for inquiries
- **Phone/Fax Card**: Contact phone and fax numbers
- **Social Media Links**: Icons for LinkedIn, Facebook, Twitter, and Instagram

**Design Features:**
- Light beige background (#F5EDEC)
- Dark brown text (#533638)
- Responsive grid layout (3 columns on desktop, responsive on mobile)
- Hover animations on cards (lift effect)
- Subtle icons from react-icons (FiMapPin, FiMail, FiPhone)

### 2. Contact Form Section
**Location:** Middle section  
**Purpose:** Allow users to submit inquiries directly

**Form Fields:**
1. **Full Name** (Required)
   - Placeholder: "John Doe"
   - Text input field
   
2. **Email Address** (Required)
   - Placeholder: "john@company.com"
   - Email validation included
   
3. **Inquiry Type** (Optional)
   - Dropdown with options:
     - Product Inquiry
     - Support
     - Business Partnership
     - Other
   
4. **Message** (Required)
   - Larger textarea (min-height: 150px)
   - Placeholder: "Please tell us more about your inquiry..."

**Form Features:**
- Client-side form validation
- Email format verification
- Focus states with visual feedback (border change, shadow)
- Submit button with loading state
- Success message display (auto-hides after 5 seconds)
- Error message display for validation failures
- Rounded corners (8px) and soft shadows
- Responsive design (single column on mobile)

### 3. Map Section
**Location:** Bottom section  
**Purpose:** Show business location for trust and authenticity

**Features:**
- Embedded Google Maps iframe
- Full-width responsive design
- Pin marker on business location
- Easy zoom in/out functionality
- Height: 500px (responsive on mobile)

## Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Dark Brown | #533638 | Main text, buttons, icons |
| Light Beige | #F5EDEC | Background sections |
| White | #FFFFFF | Card backgrounds, text contrasts |
| Muted Brown | #8B6F6F | Secondary text, hover states |
| Success Green | #10B981 | Success messages |
| Error Red | #EF4444 | Error messages |
| Input Border | #E5D9D6 | Form input borders |

## Typography

- **Font Family:** System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, etc.)
- **Page Title:** 2.5rem, Bold (700)
- **Section Titles:** 2.2rem, Bold (700)
- **Card Labels:** 0.9rem, Semibold (600), Uppercase
- **Card Values:** 1.1rem, Semibold (600)
- **Form Labels:** 0.95rem, Semibold (600)
- **Body Text:** 1rem, Normal (400)

## Spacing & Layout

- **Container Max-Width:** 1300px (desktop), 100% (mobile)
- **Section Padding:** 60px vertical, 20px horizontal (responsive)
- **Gap Between Cards:** 30px
- **Form Gap:** 20px between fields
- **Border Radius:** 8-12px for cards and inputs

## Component Features

### Responsive Design
- **Desktop:** 3-column grid for contact info
- **Tablet:** 2-column grid
- **Mobile:** 1-column stack, full-width form, responsive map

### Accessibility
- Proper label associations with form inputs
- Alt text and titles for social links
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on all interactive elements

### User Experience
- Smooth transitions (200-300ms)
- Hover effects on clickable elements
- Visual feedback for form interactions
- Loading states during form submission
- Validation feedback with clear messages
- Success confirmation message

## Form Validation

### Client-Side Validation
1. **Name:** Required, non-empty
2. **Email:** Required, valid email format
3. **Message:** Required, non-empty
4. **Inquiry Type:** Auto-selected (optional)

### Error Handling
- Real-time error clearing when user starts typing
- Display error message if validation fails
- Prevent form submission on validation failure
- Loading state during submission

## Customization Guide

### Updating Contact Information
Edit the `contactData` array in `ContactInfoSection`:
```javascript
const contactData = [
  {
    id: 1,
    icon: FiMapPin,
    label: "Address",
    value: "123 Business Plaza, Commerce City, CC 12345",
    link: "#",
  },
  // ... more entries
]
```

### Updating Social Media Links
Edit the `socialLinks` array in `ContactInfoSection`:
```javascript
const socialLinks = [
  { icon: FaLinkedinIn, link: "https://linkedin.com", label: "LinkedIn" },
  // ... more links
]
```

### Updating Google Maps
Replace the iframe `src` in `MapSection`:
```javascript
src="https://www.google.com/maps/embed?pb=YOUR_MAPS_EMBED_CODE"
```

### Connecting to Backend API
In `ContactFormSection`, replace the mock API call:
```javascript
// Replace this:
await new Promise((resolve) => setTimeout(resolve, 1000))

// With your actual API call:
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

## File Structure

```
client/
└── src/
    └── pages/
        └── ContactPage.jsx
```

## Dependencies

The component uses the following icons and libraries:
- **react-icons/fi** - Feather icons (FiMapPin, FiMail, FiPhone, FiSend, FiCheckCircle)
- **react-icons/fa** - Font Awesome icons (FaLinkedinIn, FaFacebookF, FaTwitter, FaInstagram)
- React built-in hooks (useState)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

1. Lazy loading of Google Maps iframe
2. CSS-in-JS for dynamic styling reduces file size
3. No external CSS files required
4. Optimized form validation logic
5. Efficient state management with React hooks

## SEO Considerations

- Semantic HTML structure
- Descriptive page title and headings
- Form labels properly associated with inputs
- Meta descriptions can be added to parent layout
- Schema markup can be added for contact information

## Testing Checklist

- [ ] Contact information displays correctly
- [ ] All social media links open in new tabs
- [ ] Form validation works for all fields
- [ ] Success message appears after submission
- [ ] Error messages display correctly
- [ ] Form clears after successful submission
- [ ] Map is responsive and interactive
- [ ] Mobile layout is properly formatted
- [ ] Hover effects work smoothly
- [ ] Button hover states work correctly
- [ ] Form fields show focus states
- [ ] Email validation catches invalid formats

## Future Enhancements

1. **Backend Integration:** Connect form to email service
2. **Form Tracking:** Add analytics for form submissions
3. **Captcha:** Add reCAPTCHA for spam prevention
4. **File Upload:** Allow attachment uploads
5. **Chat Widget:** Add live chat integration
6. **Auto-Reply:** Implement automatic email confirmation
7. **Admin Dashboard:** Track all inquiries
8. **Multiple Languages:** Add i18n support
9. **Custom Styling:** Allow admins to customize colors/text
10. **Analytics:** Track engagement metrics

## Troubleshooting

### Form not submitting
- Check browser console for errors
- Ensure all required fields are filled
- Check network tab for API endpoint issues

### Map not loading
- Verify Google Maps API key
- Check iframe src URL is correct
- Ensure Google Maps embed code is valid

### Styling issues
- Clear browser cache
- Verify color hex codes are correct
- Check for CSS conflicts with global styles

### Icons not appearing
- Verify react-icons packages are installed
- Check icon names are correct
- Ensure icons are properly imported

## Support

For issues or questions about the Contact Page implementation, refer to:
- React documentation: https://react.dev
- react-icons: https://react-icons.github.io/react-icons
- Google Maps Embed: https://developers.google.com/maps/documentation/embed
