# Proxy & Authentication Testing Protocol for Pepta

## Context
The Pepta e-commerce application has implemented Option A architecture:
- **Vite proxy** (dev): Routes `/api/*` requests to `https://pepta-api.vercel.app`
- **Vercel rewrites** (prod): Same routing via `vercel.json`
- **httpOnly Cookies**: JWT stored in httpOnly, SameSite=Strict cookies (XSS-safe)
- **Relative URLs**: All API calls use `/api/...` (no hardcoded domain)

## Testing Objectives
Verify that:
1. API proxy is working correctly (dev and prod)
2. Cookies are being transmitted correctly
3. Authentication login/signup flow works end-to-end
4. No CORS errors appear
5. JWT tokens persist across page reloads
6. Logout properly clears auth state

---

## Part 1: Development Environment Testing

### 1.1 Start Dev Servers
```bash
# Terminal 1: Start Vite frontend (port 5173)
cd client
npm run dev

# Terminal 2: Start Next.js API backend (port 3000)
cd server
npm run dev
```

**Expected Output:**
- Vite server: `Local: http://localhost:5173`
- Next.js server: `ready - started server on 0.0.0.0:3000`

### 1.2 Browser DevTools Setup
1. Open `http://localhost:5173` in Chrome/Firefox
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. **Enable** "Preserve log" checkbox
5. Go to **Application** → **Cookies** → `http://localhost:5173`
   - Should see an empty cookie list initially

### 1.3 Test API Proxy (No Auth Required)
**Action:** Visit any public endpoint (e.g., categories list)

**Steps:**
1. In DevTools Network tab, filter by `Fetch/XHR`
2. Navigate to the homepage or products page
3. Look for a request like `GET /api/categories` or `GET /api/products`

**Expected Results:**
```
✅ Request URL shows: http://localhost:5173/api/products (relative, not hardcoded domain)
✅ Status: 200 (or 304 if cached)
✅ No CORS errors in Console
✅ Response body contains product data
```

**If CORS Error Appears:**
```
❌ Error: "Access to fetch at 'http://localhost:5173/api/...' from origin 'http://localhost:5173' 
   has been blocked by CORS policy"
→ Check middleware.js resolveAllowedOrigin() function
→ Ensure FRONTEND_URL env var includes http://localhost:5173
```

### 1.4 Test Login Flow
**Steps:**
1. Click "Login" button (or navigate to `/login`)
2. Enter credentials:
   - Email: `test@example.com` (or a valid test account)
   - Password: `password123` (or correct test password)
3. Click "Sign In"
4. Watch DevTools Network tab

**Expected Results:**
```
✅ POST /api/auth/login request appears
✅ Response status: 200
✅ Response body: { success: true, data: { user: {...}, token: "..." } }
✅ NO `token` in response body (security: token should ONLY be in cookie)
✅ Response Headers contain "Set-Cookie: authToken=..."
```

### 1.5 Verify Cookie Storage
**After successful login:**
1. Go to DevTools **Application** → **Cookies** → `http://localhost:5173`
2. Look for a cookie named `authToken`

**Expected Results:**
```
✅ Cookie Name: authToken
✅ Value: jwt.eyJ... (long string)
✅ Secure: Yes (or N/A in http dev)
✅ HttpOnly: Yes (protects against XSS)
✅ SameSite: Strict (protects against CSRF)
✅ Expires/Max-Age: Some future timestamp
```

**If No Cookie Appears:**
```
❌ Check next.config.js CORS headers — ensure Access-Control-Allow-Credentials: true
❌ Check middleware.js setAuth() function — is it calling response.cookies.set()?
❌ Check browser console for errors
```

### 1.6 Test Page Reload (Token Persistence)
**Steps:**
1. After login, the cookie should exist (verified in 1.5)
2. Press `F5` to reload the page
3. Watch the Network tab for auth-check requests

**Expected Results:**
```
✅ Page reloads without logging out
✅ User remains logged in (check UI: profile menu, dashboard, etc.)
✅ GET /api/auth/me request appears (or similar auth-check endpoint)
✅ AuthContext.user is restored with user data
✅ No 401 Unauthorized errors
```

**If Logged Out After Reload:**
```
❌ The authToken cookie was not persisted
❌ Check: Is credentials: 'include' in apiClient.js _fetch()?
❌ Check: Does AuthContext call an /api/auth/me endpoint on mount?
```

### 1.7 Test Protected Route Access
**Steps:**
1. While logged in, navigate to a protected page (e.g., `/profile`, `/orders`, `/cart` checkout)
2. Should load without redirecting to login

**Expected Results:**
```
✅ Protected page loads
✅ User data is displayed (name, email, order history, etc.)
✅ No redirect to /login
```

**If Redirected to Login:**
```
❌ Check ProtectedRoute.jsx — is it checking AuthContext.user?
❌ Check middleware.js — is it verifying JWT and attaching user to request?
```

### 1.8 Test Signup Flow
**Steps:**
1. Click "Sign Up" or navigate to `/register`
2. Fill out registration form:
   - Name: `Test User`
   - Email: `newuser-${Date.now()}@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
3. Click "Create Account"
4. Watch DevTools Network tab

**Expected Results:**
```
✅ POST /api/auth/register request appears
✅ Response status: 200 or 201
✅ Response: { success: true, data: { user: {...} } }
✅ authToken cookie is automatically set (Set-Cookie header)
✅ User is logged in immediately after signup
✅ Redirects to dashboard/home page
✅ No "user already exists" errors (if using unique email)
```

**If Signup Fails:**
```
❌ Check server logs for validation errors (e.g., password too weak)
❌ Check: Are password constraints documented? (min length, special chars, etc.)
❌ Verify email is unique (not already registered)
```

### 1.9 Test Logout Flow
**Steps:**
1. While logged in, click "Logout" button
2. Watch DevTools Network tab
3. Check Application → Cookies after logout

**Expected Results:**
```
✅ POST /api/auth/logout request appears
✅ Response status: 200
✅ Response headers include: Set-Cookie: authToken=; Max-Age=0 (clears cookie)
✅ Cookie list is now empty (authToken is gone)
✅ UI updates: logout button disappears, login button appears
✅ AuthContext.user is set to null
✅ Redirected to home page or login page
```

**If Cookie Persists After Logout:**
```
❌ Check middleware.js logout route — is it calling response.cookies.delete('authToken')?
❌ Check client-side AuthContext — is it calling queryClient.clear() after logout?
```

### 1.10 Test CORS Preflight on Mutating Requests
**Steps:**
1. While logged in, perform an action that mutates data:
   - Add item to cart: POST /api/cart
   - Update profile: PUT /api/user/profile
   - Create order: POST /api/orders
2. Watch DevTools Network tab carefully

**Expected Results:**
```
✅ Two requests appear:
   1. OPTIONS /api/... (CORS preflight) — status 204
   2. POST/PUT /api/... (actual request) — status 200
✅ OPTIONS response includes:
   - Access-Control-Allow-Origin: http://localhost:5173
   - Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
   - Access-Control-Allow-Credentials: true
✅ Actual request succeeds with credentials
```

**If Preflight Fails (414 or other error):**
```
❌ Check middleware.js — is it handling OPTIONS requests?
❌ Check next.config.js headers section — is it allowing Content-Type?
❌ Look for "CORS policy: no 'Access-Control-Allow-Origin' header" error
```

---

## Part 2: Production Environment Testing

### 2.1 Deploy and Test on Vercel
**Steps:**
1. Deploy frontend to Vercel:
   ```bash
   cd client
   npm run build
   vercel deploy --prod
   ```
2. Deploy backend to Vercel:
   ```bash
   cd server
   npm run build
   vercel deploy --prod
   ```
3. Set environment variables on Vercel:
   ```
   FRONTEND_URL=https://www.pepta.shopping
   JWT_SECRET=<your-secret>
   DATABASE_URL=<your-db-url>
   ```

### 2.2 Test Vercel Rewrites
**Steps:**
1. Open DevTools on your Vercel production frontend URL
2. Navigate to any page that makes API calls
3. Check Network tab for `/api/...` requests

**Expected Results:**
```
✅ Request URL shows: https://www.pepta.shopping/api/products
✅ Request is rewritten to backend by vercel.json
✅ Response status: 200
✅ No CORS errors (because browser sees origin as same-site)
```

### 2.3 Test Login on Production
**Steps:**
1. Navigate to production frontend URL
2. Click Login
3. Enter valid credentials
4. Watch Network tab

**Expected Results:**
```
✅ POST /api/auth/login → https://www.pepta.shopping/api/auth/login
✅ Response: 200 with Set-Cookie header
✅ authToken cookie is set with Secure flag (HTTPS only)
✅ Cookie shows Secure: Yes, HttpOnly: Yes, SameSite: Strict
✅ User is logged in on production
```

### 2.4 Test Across Deployments
**Steps:**
1. Log in on production
2. Copy the URL to an incognito window
3. Paste and load the page
4. Should remain logged in (same cookie domain)

**Expected Results:**
```
✅ authToken cookie is shared across incognito windows (same domain)
✅ User remains logged in
```

---

## Part 3: Security & Error Scenarios

### 3.1 Test XSS Prevention (httpOnly Cookies)
**Steps:**
1. While logged in, open DevTools Console
2. Try to access the token from JavaScript:
   ```javascript
   console.log(document.cookie)
   ```

**Expected Results:**
```
✅ Output is empty (no visible cookies in document.cookie)
✅ Reason: authToken is httpOnly, so JavaScript can't access it
✅ This prevents XSS attackers from stealing the token
```

**If Output Shows authToken:**
```
❌ The cookie was NOT set with HttpOnly flag
❌ Check middleware.js — ensure response.cookies.set('authToken', token, { httpOnly: true })
```

### 3.2 Test CSRF Protection (SameSite=Strict)
**Steps:**
1. Open DevTools → Application → Cookies
2. Check the authToken cookie's SameSite attribute

**Expected Results:**
```
✅ SameSite: Strict (or Lax as fallback)
✅ This prevents cross-site requests from including the cookie
✅ Protects against CSRF attacks
```

### 3.3 Test Invalid Token Handling
**Steps:**
1. Manually set a fake token in the cookie:
   ```javascript
   document.cookie = "authToken=invalid-token-xyz; path=/; samesite=strict"
   ```
2. Reload the page
3. Try to access a protected route (e.g., /profile)

**Expected Results:**
```
✅ GET /api/auth/me returns 401 Unauthorized
✅ AuthContext detects 401 and logs out user
✅ Redirect to login page
✅ Fake cookie is cleared
```

### 3.4 Test Expired Token
**Steps:**
1. Set NEXT_PUBLIC_JWT_EXPIRY to a very short duration (e.g., 1 second) in .env
2. Log in
3. Wait 2 seconds
4. Try to make an API call (e.g., fetch products)

**Expected Results:**
```
✅ First call succeeds (token still valid)
✅ Second call (after 2 seconds) returns 401 Unauthorized
✅ AuthContext logs out user automatically
✅ Redirect to login page
```

**If No 401 Appears:**
```
❌ Check middleware.js — is it verifying JWT expiration?
❌ Check: const payload = await verifyJwt(token);
```

### 3.5 Test Network Error Handling
**Steps:**
1. While logged in, open DevTools → Network tab
2. Throttle network: DevTools → Network → "Slow 3G"
3. Click a button that triggers an API call
4. Immediately disconnect internet (or kill backend server)
5. Watch for error messages

**Expected Results:**
```
✅ Error message appears: "Network error. Please check your connection."
✅ UI remains responsive (no freezing)
✅ User can retry or navigate away
```

---

## Part 4: Checklist & Sign-Off

Use this checklist to verify all functionality:

### Development Environment
- [ ] Vite dev server starts on port 5173
- [ ] Next.js API server starts on port 3000
- [ ] Homepage loads without CORS errors
- [ ] Public routes (products, categories) load correctly
- [ ] Login form appears and is interactive
- [ ] Signup form appears and is interactive
- [ ] Login with valid credentials succeeds
- [ ] authToken cookie is set after login (httpOnly, SameSite=Strict)
- [ ] Page reload persists authentication
- [ ] Protected routes are accessible when logged in
- [ ] Signup creates new user and logs them in
- [ ] Logout clears cookie and redirects to home/login
- [ ] CORS preflight (OPTIONS) succeeds on mutations
- [ ] No XSS vulnerability (token not in document.cookie)
- [ ] Invalid/expired tokens return 401 and log out user

### Production Environment (Vercel)
- [ ] Frontend deploys successfully to Vercel
- [ ] Backend deploys successfully to Vercel
- [ ] FRONTEND_URL env var is set correctly
- [ ] Login works on production
- [ ] authToken cookie is set with Secure flag
- [ ] Token persists across page reloads on production
- [ ] Protected routes work on production
- [ ] No CORS errors on production

### Security Verification
- [ ] httpOnly flag prevents document.cookie access
- [ ] SameSite=Strict is enforced
- [ ] Expired tokens trigger re-authentication
- [ ] Invalid tokens are rejected (401)
- [ ] Network errors are handled gracefully

---

## Debugging Tips

### CORS Errors
1. Check middleware.js `resolveAllowedOrigin()`
2. Ensure FRONTEND_URL env var matches request origin exactly
3. Check if www subdomain is included (e.g., `https://www.pepta.shopping`)

### Cookie Not Persisting
1. Check apiClient.js: `credentials: 'include'` in _fetch()
2. Check middleware.js: `response.cookies.set('authToken', ...)` in login route
3. Check domain/path: cookie should be for `localhost` in dev, `pepta.shopping` in prod

### 401 Errors
1. Check middleware.js: `verifyJwt()` is decoding token correctly
2. Check JWT_SECRET is set in .env
3. Check token expiration time

### Logout Not Working
1. Check middleware.js logout route: `response.cookies.delete('authToken')`
2. Check client: `queryClient.clear()` is called after logout
3. Check AuthContext: `setUser(null)` is called

---

## Summary

This testing protocol ensures:
✅ API proxy works in dev & prod
✅ Cookies are secure (httpOnly, SameSite=Strict, Secure)
✅ No hardcoded domains (relative URLs only)
✅ Authentication persists across reloads
✅ Logout properly clears state
✅ CORS is handled correctly
✅ Expired tokens are caught and handled

**Green Light Criteria:** All items in Part 4 Checklist are checked ✓
