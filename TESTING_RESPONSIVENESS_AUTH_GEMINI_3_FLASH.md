# Website Responsiveness & Auth Testing (Gemini 3 Flash) - Concise

## System Context
Test website responsiveness across devices, verify hamburger menu has profile icon & add-to-cart, and validate login/signup functionality.

**Environment:** https://pepta.shopping/
**Focus:** Mobile/Tablet responsiveness, hamburger menu completeness, authentication flows

---

## QUICK TEST CHECKLIST

### TEST 1: Mobile Responsiveness (< 768px)
**Device:** iPhone 12 (390x844)

**Steps:**
1. Open https://pepta.shopping/ 
2. DevTools → Device Toolbar (Ctrl+Shift+M) → Select iPhone 12
3. Reload page

**Check Items:**
- [ ] Hamburger menu visible? (Y/N)
- [ ] Click hamburger → menu opens? (Y/N)
- [ ] Profile icon in menu? (Y/N)
- [ ] "Add to Cart" in menu? (Y/N)
- [ ] Cart icon visible in navbar? (Y/N)
- [ ] Text readable (not too small)? (Y/N)
- [ ] No horizontal scroll? (Y/N)
- [ ] Images load? (Y/N)
- [ ] Touch targets adequate (44px+)? (Y/N)

**Pass:** All items checked ✅

---

### TEST 2: Tablet Responsiveness (768px - 1024px)
**Device:** iPad (768x1024)

**Steps:**
1. Device Toolbar → Select iPad
2. Check layout

**Check Items:**
- [ ] Hamburger menu visible or full menu? (Y/N)
- [ ] Profile icon accessible? (Y/N)
- [ ] "Add to Cart" visible/accessible? (Y/N)
- [ ] Layout looks proportional? (Y/N)
- [ ] No overlap between elements? (Y/N)

**Pass:** All items checked ✅

---

### TEST 3: Desktop Responsiveness (1024px+)
**Device:** Desktop (1280x720)

**Steps:**
1. Device Toolbar → Deselect (or set to Desktop preset)
2. Check layout

**Check Items:**
- [ ] Full navbar visible (no hamburger)? (Y/N)
- [ ] Profile icon visible in navbar? (Y/N)
- [ ] Cart icon visible in navbar? (Y/N)
- [ ] "Add to Cart" button visible on product cards? (Y/N)
- [ ] All menu items horizontal? (Y/N)
- [ ] Spacing looks good? (Y/N)

**Pass:** All items checked ✅

---

### TEST 4: Hamburger Menu Contents
**Device:** Mobile (390px)

**Steps:**
1. Open site on mobile
2. Click hamburger menu icon
3. Check what appears

**Menu Should Show:**
- [ ] Products/Shop link? (Y/N)
- [ ] Categories? (Y/N)
- [ ] Profile/Account link? (Y/N)
- [ ] Cart/Bag link? (Y/N)
- [ ] Wishlist link? (Y/N)
- [ ] About/Contact links? (Y/N)
- [ ] Login/Logout link? (Y/N)

**Issues:**
- Missing items: _____________
- Broken links: _____________

**Pass:** All critical items present ✅

---

### TEST 5: Login Functionality
**Precondition:** Not logged in

**Steps:**
1. Click Login link (navbar or hamburger menu)
2. You should see login form with:
   - [ ] Email/Username field? (Y/N)
   - [ ] Password field? (Y/N)
   - [ ] "Remember me" checkbox? (Y/N)
   - [ ] Login button? (Y/N)
   - [ ] "Forgot password" link? (Y/N)
   - [ ] "Sign up" link? (Y/N)

3. Enter test credentials:
   - Email: testuser@example.com
   - Password: Test@1234
4. Click Login button
5. Wait for response (5-10 seconds)

**Verify:**
- [ ] Page redirects to home/dashboard? (Y/N)
- [ ] User name displayed in navbar? (Y/N)
- [ ] Login link changed to Logout? (Y/N)
- [ ] No error messages? (Y/N) If error: _____________
- [ ] Console errors? (Y/N) If yes: _____________

**Result:** ✅ Login works / ❌ Login failed

---

### TEST 6: Signup Functionality
**Precondition:** Not logged in

**Steps:**
1. Click Signup link (navbar or hamburger menu)
2. You should see signup form with:
   - [ ] Full Name field? (Y/N)
   - [ ] Email field? (Y/N)
   - [ ] Password field? (Y/N)
   - [ ] Confirm Password field? (Y/N)
   - [ ] Terms & Conditions checkbox? (Y/N)
   - [ ] Signup button? (Y/N)
   - [ ] "Already have account?" link to Login? (Y/N)

3. Enter test data:
   - Name: Test User
   - Email: testuser_NEW_TIMESTAMP@example.com (use timestamp to avoid duplicates)
   - Password: Test@1234
   - Confirm: Test@1234
4. Check T&C checkbox
5. Click Signup button
6. Wait for response (5-10 seconds)

**Verify:**
- [ ] Account created successfully? (Y/N)
- [ ] Redirected to login or home? (Y/N)
- [ ] Success message shown? (Y/N)
- [ ] Error message? (Y/N) If yes: _____________
- [ ] Validation working? (try invalid email) (Y/N)
- [ ] Console errors? (Y/N) If yes: _____________

**Result:** ✅ Signup works / ❌ Signup failed

---

### TEST 7: Auth State Persistence
**Steps:**
1. Login with valid credentials
2. Reload page (Ctrl+R)
3. Check if still logged in

**Verify:**
- [ ] User name still visible? (Y/N)
- [ ] Not redirected to login? (Y/N)
- [ ] Session persisted? (Y/N)

**Result:** ✅ Session saved / ❌ Session lost

---

### TEST 8: Profile Icon in Hamburger (Mobile)
**Device:** Mobile

**Steps:**
1. Login first
2. Open hamburger menu on mobile
3. Look for profile icon/account option

**Verify:**
- [ ] Profile icon/text visible in menu? (Y/N)
- [ ] Click opens profile page? (Y/N)
- [ ] Shows logged-in user name? (Y/N)

**Result:** ✅ Profile accessible / ❌ Not accessible

---

### TEST 9: Add to Cart in Hamburger (Mobile)
**Device:** Mobile

**Steps:**
1. Open hamburger menu
2. Look for Cart/Bag option

**Verify:**
- [ ] Cart link in hamburger menu? (Y/N)
- [ ] Click opens cart page? (Y/N)
- [ ] Shows cart items count? (Y/N)

**Result:** ✅ Cart accessible / ❌ Not accessible

**Note:** Some designs have cart as icon only (not in hamburger). Check if visible in navbar instead.

---

### TEST 10: Responsive Images & Performance
**Device:** Mobile

**Steps:**
1. Mobile view (390px)
2. Scroll through page
3. DevTools → Network → reload

**Verify:**
- [ ] Images load? (Y/N)
- [ ] Images not oversized? (Y/N)
- [ ] CSS loads? (Y/N)
- [ ] JavaScript loads? (Y/N)
- [ ] Page load time < 3 seconds? (Y/N)
- [ ] No 404 errors? (Y/N)

**Result:** Performance ✅ Good / ❌ Poor

---

## QUICK DIAGNOSIS

**If Hamburger Menu Missing Items:**
- Check if component is updated in code
- Verify nav links are included in menu JSX
- Test after `git push` and redeploy

**If Login/Signup Fails:**
- Check Network tab for API response
- Look for 404 (endpoint missing) or 500 (server error)
- Check console for specific error message
- Verify backend API is deployed and responding

**If Not Responsive:**
- Check if CSS media queries exist
- Verify Tailwind breakpoints are configured
- Test if hamburger component is showing at correct breakpoint
- Check if flexbox/grid responsive classes are applied

**If Auth State Not Persisting:**
- Check localStorage/sessionStorage in DevTools
- Verify JWT token is saved after login
- Check if token is sent with API requests
- Look for CORS issues on auth endpoints

---

## FINAL VERDICT

**Responsiveness:** ✅ Pass / ❌ Fail
**Hamburger Menu:** ✅ Complete / ❌ Missing items: _____________
**Login:** ✅ Works / ❌ Fails - Error: _____________
**Signup:** ✅ Works / ❌ Fails - Error: _____________
**Overall Status:** ✅ Ready / ❌ Needs Fixes

---

## ISSUES FOUND

List any issues discovered:
1. _____________
2. _____________
3. _____________

**Next Steps:** Fix issues → git push → redeploy → retest
