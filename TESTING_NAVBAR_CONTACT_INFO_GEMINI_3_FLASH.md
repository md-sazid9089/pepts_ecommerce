# Navbar Contact Info Update - Gemini 3 Flash Testing Prompt

## System Context
You are a QA tester validating UI updates to the Pepta e-commerce navbar. The top utility bar has been updated to display direct contact information (phone & email) with icons instead of placeholder links.

## Changes Made
**Utility Bar (Top Row) Updates:**
- **Old:** "CUSTOMER CARE" link → "TRACK MY ORDER" link
- **New:** 
  - Phone icon + "(+86) 18168023963" (clickable tel: link)
  - Email icon + "peptadoll@gmail.com" (clickable mailto: link)

**Technical Details:**
- Phone link uses: `tel:+8618168023963`
- Email link uses: `mailto:peptadoll@gmail.com`
- Icons: FiPhone and FiMail from react-icons/fi library
- Display: Flex layout with icon + text, gap 0.5rem

---

## TEST CASES

### TEST 1: Visual Display - Desktop
**Goal:** Verify phone and email are displayed correctly with icons

**Steps:**
1. Start dev server: `npm run dev` (from client folder)
2. Open http://localhost:5173 in Chrome
3. Look at the **top utility bar** (light beige background)
4. Left side should show two items

**Pass Criteria:**
- [ ] Phone icon (📞) visible before phone number
- [ ] Phone number displays: "(+86) 18168023963"
- [ ] Email icon (✉️) visible before email address
- [ ] Email displays: "peptadoll@gmail.com"
- [ ] Icons and text are horizontally aligned (same baseline)
- [ ] Gap between icon and text is visible (~0.5rem)
- [ ] Brown color matches navbar theme (#4A3535)

---

### TEST 2: Phone Link Functionality
**Goal:** Verify phone number is a clickable tel: link

**Steps:**
1. On the navbar utility bar, right-click on the phone number "(+86) 18168023963"
2. Check the context menu
3. On mobile device, click the phone number

**Pass Criteria:**
- [ ] Context menu shows "Call (+86) 18168023963" or "Open Phone"
- [ ] Right-click "Inspect" shows: `href="tel:+8618168023963"`
- [ ] On mobile, tapping opens the phone dialer
- [ ] On desktop, clicking shows "No app found to open tel://" (expected behavior)

---

### TEST 3: Email Link Functionality
**Goal:** Verify email is a clickable mailto: link

**Steps:**
1. On the navbar utility bar, right-click on the email "peptadoll@gmail.com"
2. Check the context menu
3. Click the email address

**Pass Criteria:**
- [ ] Context menu shows "Send email" or "Mail to"
- [ ] Right-click "Inspect" shows: `href="mailto:peptadoll@gmail.com"`
- [ ] Clicking opens the default email client (Gmail, Outlook, Apple Mail, etc.)
- [ ] Email pre-fills with "peptadoll@gmail.com" as recipient

---

### TEST 4: Hover Effects
**Goal:** Verify hover state works on both phone and email

**Steps:**
1. Desktop only - hover over phone number
2. Observe color change
3. Move cursor away
4. Hover over email
5. Observe color change

**Pass Criteria:**
- [ ] Phone number changes to hover color (should be lighter/orange brown) on hover
- [ ] Color reverts when cursor leaves
- [ ] Email changes to hover color on hover
- [ ] Hover effect is smooth (0.3s transition)
- [ ] Cursor changes to pointer (hand icon)

---

### TEST 5: Mobile Responsive - Smaller Screens (< 768px)
**Goal:** Verify layout works on tablets and phones

**Steps:**
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select "iPhone 12" preset (390x844)
4. Check the utility bar at the top

**Pass Criteria:**
- [ ] Utility bar is still visible
- [ ] Phone icon + number visible and readable
- [ ] Email icon + address visible and readable
- [ ] Icons are properly sized (not too large)
- [ ] Text doesn't overflow
- [ ] Spacing is maintained (gap between icon and text)
- [ ] Links are still clickable with adequate touch target (44px minimum)

---

### TEST 6: Tablet Responsive (768px - 1024px)
**Goal:** Verify layout on tablet screens

**Steps:**
1. Toggle Device Toolbar
2. Select "iPad" preset (768x1024)
3. Check utility bar layout

**Pass Criteria:**
- [ ] Phone and email both visible side-by-side
- [ ] Icons and text are properly aligned
- [ ] No text truncation
- [ ] Spacing is consistent
- [ ] Links work properly

---

### TEST 7: Right-side Utility Links (Auth State)
**Goal:** Verify right side of utility bar still works

**Steps:**
1. Look at the **right side** of the utility bar
2. Note if you're logged in or logged out
3. Check what appears

**Pass Criteria:**
- [ ] If logged OUT: "LOGIN" and "SIGNUP" links visible
- [ ] If logged IN: User name, "LOGOUT", and (if admin) "ADMIN DASHBOARD"
- [ ] Right-side links are still properly spaced
- [ ] Right-side links still have hover effects
- [ ] No overlap with left-side phone/email

---

### TEST 8: Icon Style Consistency
**Goal:** Verify icons match the design system

**Steps:**
1. Compare phone and email icons to other navbar icons (user profile, shopping cart)
2. Check size consistency
3. Check color consistency

**Pass Criteria:**
- [ ] Phone and email icons are same size as user/cart icons in design
- [ ] All icons use same brown color (#4A3535)
- [ ] All icons have same hover behavior
- [ ] Icon style is consistent with react-icons/fi library

---

### TEST 9: Dark Mode Test (If Applicable)
**Goal:** Verify styling works if dark mode is implemented

**Steps:**
1. If your app has a dark mode toggle, enable it
2. Check the utility bar appearance

**Pass Criteria:**
- [ ] Phone and email text is readable in dark mode
- [ ] Icons are visible in dark mode
- [ ] Color contrast meets WCAG standards (4.5:1)
- [ ] Hover colors are adjusted for dark mode

---

### TEST 10: Browser Compatibility
**Goal:** Verify styling works across browsers

**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Safari (if available)
4. Test in Edge

**Pass Criteria:**
- [ ] Icons display correctly in Chrome
- [ ] Icons display correctly in Firefox
- [ ] Icons display correctly in Safari
- [ ] Icons display correctly in Edge
- [ ] Alignment is consistent across all browsers
- [ ] Hover effects work in all browsers
- [ ] Links function in all browsers

---

### TEST 11: Accessibility - Keyboard Navigation
**Goal:** Verify links are keyboard accessible

**Steps:**
1. Press Tab repeatedly to navigate through page elements
2. Focus should land on phone link, then email link, then right-side links

**Pass Criteria:**
- [ ] Phone link is focusable (has visible focus state)
- [ ] Email link is focusable (has visible focus state)
- [ ] Focus ring is visible around the links (not removed)
- [ ] Tab order is logical (left to right)

---

### TEST 12: Accessibility - Screen Reader
**Goal:** Verify links are readable by screen readers

**Steps:**
1. Use a screen reader (NVDA for Windows, or browser extension)
2. Navigate to phone and email links
3. Listen to what's read

**Pass Criteria:**
- [ ] Screen reader announces: "Phone icon, +86 18168023963, link"
- [ ] Screen reader announces: "Email icon, peptadoll@gmail.com, link"
- [ ] Icon is not confusing (aria-label or semantic HTML used)

---

### TEST 13: Production Build Test
**Goal:** Verify styling works in production build

**Steps:**
1. Build production: `npm run build` (from client folder)
2. Preview build: `npm run preview` or deployment
3. Check utility bar appearance

**Pass Criteria:**
- [ ] Icons display correctly in production
- [ ] Links are functional in production
- [ ] No console errors
- [ ] Styling is minified but correct
- [ ] Performance is good (icons load fast)

---

## FINAL CHECKLIST

- [ ] TEST 1: Visual display on desktop is correct
- [ ] TEST 2: Phone link triggers tel: action
- [ ] TEST 3: Email link triggers mailto: action
- [ ] TEST 4: Hover effects work on desktop
- [ ] TEST 5: Mobile responsive layout works (< 768px)
- [ ] TEST 6: Tablet responsive layout works (768px+)
- [ ] TEST 7: Right-side utility links unaffected
- [ ] TEST 8: Icon styling is consistent
- [ ] TEST 9: Dark mode styling (if applicable)
- [ ] TEST 10: Cross-browser compatibility verified
- [ ] TEST 11: Keyboard navigation works
- [ ] TEST 12: Screen reader compatible
- [ ] TEST 13: Production build works

---

## Expected Appearance (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│ 📞 (+86) 18168023963    ✉️ peptadoll@gmail.com | LOGIN SIGNUP │
└─────────────────────────────────────────────────────────┘
```

## Summary

**Total Tests:** 13
**Critical Tests:** 2, 3 (Link functionality), 5 (Mobile responsive)
**Design Tests:** 1, 4, 8 (Visual and styling)
**Accessibility Tests:** 11, 12 (Keyboard and screen reader)

**Pass Criteria:** All 13 tests must pass for sign-off
**Verdict:** ✅ READY TO DEPLOY or ❌ NEEDS FIXES

---

## Notes for Tester

- Test on both desktop and mobile devices
- Verify links work by checking href attributes in DevTools
- Screenshot the utility bar in different viewport sizes
- If any visual issue found, note the exact viewport size
- Check console for any JavaScript errors related to icons
- Verify no layout shift when icons load
- Test that icons don't cause navbar height to increase

Good luck with testing! 🚀
