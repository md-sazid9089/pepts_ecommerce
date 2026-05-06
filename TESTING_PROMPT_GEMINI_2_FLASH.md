# Pepta Auth & Proxy Testing Prompt for Gemini 2 Flash

## System Context
You are a QA automation engineer testing an e-commerce application called Pepta. Your task is to validate the authentication system and API proxy configuration following the Option A architecture.

## Architecture Summary
- **Frontend:** Vite + React (http://localhost:5173 in dev)
- **Backend:** Next.js API (port 3000 in dev, https://pepta-api.vercel.app in prod)
- **Authentication:** JWT stored in httpOnly, SameSite=Strict cookies
- **API Routing:** 
  - Dev: Vite proxy routes `/api/*` → `https://pepta-api.vercel.app`
  - Prod: Vercel rewrites route `/api/*` → backend
- **Key Files:**
  - `client/vite.config.js` (proxy config)
  - `client/vercel.json` (production rewrites)
  - `server/middleware.js` (CORS & auth verification)
  - `client/src/services/apiClient.js` (fetch wrapper)

---

## Testing Mission
Execute the following test cases and provide:
1. **Exact reproduction steps** (what you did in the browser)
2. **Expected vs Actual results** (comparison)
3. **Screenshots/Evidence** (DevTools Network, Cookies tabs)
4. **Pass/Fail verdict** for each test
5. **Root cause analysis** if any test fails

---

## TEST SUITE: Development Environment (Localhost)

### TEST 1: Server Startup
**Goal:** Verify both dev servers start correctly

**Steps:**
1. Open Terminal 1, navigate to `client/` folder
2. Run: `npm run dev`
3. Wait for output: `Local: http://localhost:5173`
4. Open Terminal 2, navigate to `server/` folder
5. Run: `npm run dev`
6. Wait for output: `ready - started server on 0.0.0.0:3000`

**Pass Criteria:**
- [ ] Both servers start without errors
- [ ] Vite shows "Local: http://localhost:5173"
- [ ] Next.js shows "ready - started server on 0.0.0.0:3000"

---

### TEST 2: Frontend Loads Without CORS Errors
**Goal:** Verify the homepage loads and no CORS errors appear

**Steps:**
1. Open http://localhost:5173 in Chrome
2. Open DevTools (F12) → Console tab
3. Look for any red error messages starting with "CORS policy" or "Access to fetch"
4. Refresh page (Ctrl+R)

**Pass Criteria:**
- [ ] Page loads with no CORS errors in Console
- [ ] No red error messages
- [ ] Logo, navigation, and hero section visible

---

### TEST 3: Public API Endpoints Work (No Auth Required)
**Goal:** Verify API proxy works for unauthenticated requests

**Steps:**
1. Keep DevTools open → Network tab
2. Filter by "Fetch/XHR"
3. Navigate to Products or Categories page
4. Look for requests like `GET /api/products` or `GET /api/categories`
5. Click one of these requests to inspect it

**Pass Criteria:**
- [ ] Request URL shows: `http://localhost:5173/api/products` (relative, NOT hardcoded domain)
- [ ] Response Status: 200
- [ ] Response body contains actual product/category data
- [ ] No CORS errors in Console

---

### TEST 4: Login Form Appears
**Goal:** Verify login UI is accessible

**Steps:**
1. Look for "Login" link/button in navbar
2. Click it
3. Verify login form appears

**Pass Criteria:**
- [ ] Login page loads
- [ ] Form has "Email" input field
- [ ] Form has "Password" input field
- [ ] "Sign In" button is visible

---

### TEST 5: Login Successful (Valid Credentials)
**Goal:** Verify JWT is issued and stored in cookies

**Steps:**
1. In DevTools, go to Network tab
2. Filter by "Fetch/XHR"
3. In login form, enter:
   - Email: `test@example.com` (or valid test account)
   - Password: `password123` (or correct password)
4. Click "Sign In"
5. Watch Network tab for POST request
6. Click the POST `/api/auth/login` request to inspect

**Pass Criteria:**
- [ ] POST `/api/auth/login` request appears
- [ ] Response Status: 200
- [ ] Response Headers include: `Set-Cookie: authToken=...`
- [ ] Response Body does NOT contain token (token should only be in cookie, not JSON)
- [ ] No "invalid credentials" error message

---

### TEST 6: authToken Cookie is Set Correctly
**Goal:** Verify httpOnly, SameSite=Strict, Secure flags

**Steps:**
1. After successful login (Test 5), go to DevTools → Application tab
2. Left sidebar → Cookies → http://localhost:5173
3. Find the "authToken" cookie
4. Click it to view details

**Pass Criteria:**
- [ ] Cookie Name: `authToken`
- [ ] Cookie Value: Starts with `eyJ` (JWT format)
- [ ] HttpOnly: ✅ Yes (prevents XSS)
- [ ] SameSite: `Strict` (prevents CSRF)
- [ ] Secure: N/A in dev (localhost uses http), but would be ✅ in production
- [ ] Path: `/`
- [ ] Expires/Max-Age: Some future timestamp (e.g., 24 hours from now)

---

### TEST 7: Page Reload Persists Authentication
**Goal:** Verify cookie survives page refresh and user stays logged in

**Steps:**
1. After successful login (Test 5), verify user data is shown (name, profile icon, etc.)
2. Press F5 to reload page
3. Wait 3-5 seconds for page to fully load
4. Check if user is still logged in (profile icon, user menu still visible)

**Pass Criteria:**
- [ ] Page reloads without logging out
- [ ] User profile/name is still displayed
- [ ] No redirect to login page
- [ ] authToken cookie is still present in Application → Cookies

---

### TEST 8: Protected Routes Work When Logged In
**Goal:** Verify user can access protected pages (profile, orders, etc.)

**Steps:**
1. While logged in, navigate to:
   - `/profile` (user profile page)
   - `/orders` or `/cart` (if applicable)
2. Page should load without redirect

**Pass Criteria:**
- [ ] Protected page loads without redirect to login
- [ ] User-specific data is displayed (name, email, orders, etc.)
- [ ] No 401 Unauthorized errors in Console
- [ ] No redirect to `/login`

---

### TEST 9: Signup Creates New User and Auto-Logs In
**Goal:** Verify registration flow works end-to-end

**Steps:**
1. Navigate to `/register` or click "Sign Up"
2. Fill form:
   - Name: `Test User`
   - Email: `testuser-${Date.now()}@example.com` (use timestamp for uniqueness)
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
3. Click "Create Account"
4. Watch Network tab for POST `/api/auth/register`

**Pass Criteria:**
- [ ] POST `/api/auth/register` request succeeds (Status 200)
- [ ] Response: `{ success: true, data: { user: {...} } }`
- [ ] authToken cookie is automatically set (no extra login step)
- [ ] User is logged in immediately after signup
- [ ] Page redirects to home/dashboard
- [ ] No "email already exists" error (because email is unique)

---

### TEST 10: Logout Clears Cookie and Auth State
**Goal:** Verify logout properly clears authentication

**Steps:**
1. While logged in, click "Logout" button
2. Watch Network tab for POST request
3. After logout, check DevTools Application → Cookies

**Pass Criteria:**
- [ ] POST `/api/auth/logout` request appears (Status 200)
- [ ] Response Headers include: `Set-Cookie: authToken=; Max-Age=0` (empty cookie)
- [ ] Cookie list is now empty (authToken is gone)
- [ ] UI updates: logout button disappears, login button appears
- [ ] Page redirects to home/login page
- [ ] No errors in Console

---

### TEST 11: CORS Preflight Works (OPTIONS Request)
**Goal:** Verify CORS preflight succeeds before mutations

**Steps:**
1. While logged in, perform a mutation (e.g., add item to cart):
   - If cart exists: Click "Add to Cart" button
   - If checkout exists: Submit checkout form
2. In DevTools Network tab, look CAREFULLY for TWO requests:
   - First: `OPTIONS /api/...` (preflight)
   - Second: `POST /api/...` (actual request)

**Pass Criteria:**
- [ ] OPTIONS request appears with Status: 204 or 200
- [ ] OPTIONS response includes headers:
  - `Access-Control-Allow-Origin: http://localhost:5173`
  - `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
  - `Access-Control-Allow-Credentials: true`
- [ ] Actual POST/PUT request appears after OPTIONS (Status 200)
- [ ] No CORS error in Console

---

### TEST 12: XSS Prevention - Token Not in document.cookie
**Goal:** Verify httpOnly flag prevents JavaScript access to token

**Steps:**
1. While logged in, open DevTools Console
2. Type and press Enter:
   ```javascript
   console.log(document.cookie)
   ```
3. Check the output

**Pass Criteria:**
- [ ] Output is empty or shows no `authToken`
- [ ] Reason: httpOnly cookie is not visible to JavaScript
- [ ] This proves the cookie is protected against XSS attacks

---

### TEST 13: Invalid Token Logout
**Goal:** Verify invalid/expired tokens trigger logout

**Steps:**
1. While logged in, open DevTools Console
2. Manually delete the cookie:
   ```javascript
   document.cookie = "authToken=; Max-Age=0; path=/;"
   ```
3. Try to navigate to a protected route (e.g., `/profile`)
4. Watch Network tab for auth requests

**Pass Criteria:**
- [ ] GET `/api/auth/me` (or similar) returns 401 Unauthorized
- [ ] AuthContext detects 401 and logs out user
- [ ] Redirect to login page
- [ ] User sees login form, not protected content

---

### TEST 14: Network Error Handling
**Goal:** Verify graceful handling of network failures

**Steps:**
1. While logged in, open DevTools → Network tab
2. Throttle: Click "No throttling" dropdown → select "Slow 3G"
3. Click a button that triggers an API call
4. Immediately set offline: Check the "Offline" checkbox in Network tab
5. Try another API call

**Pass Criteria:**
- [ ] Error message appears: "Network error. Please check your connection."
- [ ] UI doesn't freeze or hang
- [ ] User can navigate away or retry
- [ ] No JavaScript errors in Console

---

## TEST SUITE: Production Environment (Vercel)

### TEST 15: Production Deployment & Env Vars
**Goal:** Verify frontend and backend are deployed to Vercel

**Steps:**
1. Verify frontend is deployed:
   - Command: `vercel ls` (should show frontend project)
   - Visit: https://www.pepta.shopping (or your Vercel URL)
2. Verify backend is deployed:
   - Command: `vercel ls` (should show backend API project)
   - Check: Environment variables are set:
     - `FRONTEND_URL=https://www.pepta.shopping`
     - `JWT_SECRET=<your-secret>`
     - `DATABASE_URL=<your-db-url>`

**Pass Criteria:**
- [ ] Both projects exist in Vercel
- [ ] Frontend loads without 404 errors
- [ ] All required env vars are set in Vercel dashboard
- [ ] No errors in Vercel deployment logs

---

### TEST 16: Production Login Works
**Goal:** Verify login works on production with Vercel rewrites

**Steps:**
1. Navigate to production frontend (https://www.pepta.shopping)
2. Open DevTools → Network tab
3. Click Login
4. Enter valid credentials
5. Click Sign In
6. Watch Network tab

**Pass Criteria:**
- [ ] POST `/api/auth/login` request appears
- [ ] Request URL shows: `https://www.pepta.shopping/api/auth/login` (relative, rewritten by Vercel)
- [ ] Response Status: 200
- [ ] authToken cookie is set with `Secure` flag (HTTPS-only)
- [ ] User is logged in on production
- [ ] No CORS errors

---

### TEST 17: Production Token Persistence
**Goal:** Verify cookie persists across page reloads on production

**Steps:**
1. After login (Test 16), verify cookies in Application → Cookies
2. Press F5 to reload page
3. Wait for page to fully load

**Pass Criteria:**
- [ ] authToken cookie still exists after reload
- [ ] User is still logged in
- [ ] No redirect to login page
- [ ] User data is displayed

---

### TEST 18: Production CORS Headers
**Goal:** Verify CORS is handled correctly on production

**Steps:**
1. While logged in on production, perform an API call
2. Inspect Network tab for any response

**Pass Criteria:**
- [ ] Response headers include: `Access-Control-Allow-Origin: https://www.pepta.shopping`
- [ ] No CORS errors in Console
- [ ] API calls succeed

---

## TEST SUITE: Security Validation

### TEST 19: CSRF Protection (SameSite=Strict)
**Goal:** Verify SameSite=Strict prevents CSRF attacks

**Steps:**
1. While logged in, open DevTools → Application → Cookies → http://localhost:5173
2. Find authToken cookie
3. Check SameSite attribute

**Pass Criteria:**
- [ ] SameSite: `Strict` (prevents cross-site requests)
- [ ] This protects against CSRF attacks where malicious sites try to use your cookie

---

### TEST 20: JWT Verification
**Goal:** Verify backend correctly verifies JWT signature

**Steps:**
1. While logged in, open DevTools Console
2. Try to manually create a fake JWT:
   ```javascript
   document.cookie = "authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.fakesignature; path=/"
   ```
3. Reload page and try to access a protected route

**Pass Criteria:**
- [ ] GET `/api/auth/me` returns 401 Unauthorized
- [ ] Fake token is rejected (invalid signature)
- [ ] User is logged out
- [ ] Redirect to login page

---

## FINAL CHECKLIST

Mark each item as ✅ Pass or ❌ Fail:

### Development Tests
- [ ] TEST 1: Servers start correctly
- [ ] TEST 2: No CORS errors on homepage
- [ ] TEST 3: Public API endpoints work
- [ ] TEST 4: Login form appears
- [ ] TEST 5: Login successful with valid credentials
- [ ] TEST 6: authToken cookie set correctly (httpOnly, SameSite=Strict)
- [ ] TEST 7: Page reload persists authentication
- [ ] TEST 8: Protected routes work when logged in
- [ ] TEST 9: Signup creates new user and auto-logs in
- [ ] TEST 10: Logout clears cookie and auth state
- [ ] TEST 11: CORS preflight (OPTIONS) works
- [ ] TEST 12: XSS prevention (token not in document.cookie)
- [ ] TEST 13: Invalid token triggers logout
- [ ] TEST 14: Network errors handled gracefully

### Production Tests
- [ ] TEST 15: Both projects deployed to Vercel with env vars
- [ ] TEST 16: Login works on production
- [ ] TEST 17: Token persists on production
- [ ] TEST 18: CORS headers correct on production

### Security Tests
- [ ] TEST 19: CSRF protection (SameSite=Strict)
- [ ] TEST 20: JWT signature verification (rejects fake tokens)

---

## PASS/FAIL SUMMARY

**Total Tests:** 20  
**Passed:** ___  
**Failed:** ___  
**Pass Rate:** ___% 

**Critical Failures (if any):**
- [List any failed critical tests]

**Recommendations:**
- [List suggested fixes or improvements]

**Final Verdict:**
- [ ] ✅ **PRODUCTION READY** (All tests passed)
- [ ] ⚠️ **NEEDS FIXES** (Some tests failed, list above)
- [ ] ❌ **NOT READY** (Critical failures)

---

## Notes for Tester

- **Screenshot Evidence:** For each failed test, take a screenshot of:
  - DevTools Network tab (showing the failed request)
  - DevTools Console (showing any error messages)
  - The actual UI error or behavior
  
- **Error Messages:** Copy any error messages from Console or Network responses

- **Environment:** Test in both Chrome and Firefox if possible (different CORS behaviors)

- **Timing:** Leave 2-3 seconds between actions for network requests to complete

- **Database:** Use a test database (not production) to avoid polluting real data

Good luck! 🚀
