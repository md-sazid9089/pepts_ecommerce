# Login & Signup Authentication Testing (Claude Sonnet)

## System Context
You are an authentication testing specialist. Diagnose why login and signup may not be working on https://pepta.shopping/. Your task is to systematically identify if the issue is frontend UI, API endpoint, backend logic, database, or network connectivity.

**Target Website:** https://pepta.shopping/
**Focus:** Authentication flows (login and signup), error handling, success flows

---

## AUTHENTICATION TESTING PROTOCOL

### PHASE 1: Visual Inspection & Form Structure

**TEST 1.1: Login Page UI**
- Navigate to https://pepta.shopping/ and click Login
- Verify login form has:
  - Email/Username input field (type="email" or text)
  - Password input field (type="password")
  - Login/Submit button
  - Signup link
  - Password recovery link (if applicable)
- Report: All present? (Y/N) Missing items: ___________

**TEST 1.2: Signup Page UI**
- Navigate to https://pepta.shopping/ and click Signup
- Verify signup form has:
  - Full Name input field
  - Email input field (type="email")
  - Password input field (type="password")
  - Confirm Password input field
  - Terms & Conditions checkbox
  - Signup/Submit button
  - Login link
- Report: All present? (Y/N) Missing items: ___________

**Pass Criteria:** Both forms structurally complete

---

### PHASE 2: Frontend Validation Testing

**TEST 2.1: Login Form Validation**
1. Leave email field empty, click Login
   - Does error message appear? (Y/N) Message: ___________
2. Enter invalid email (e.g., "notanemail"), click Login
   - Does email validation error appear? (Y/N) Message: ___________
3. Enter email but leave password empty, click Login
   - Does password required error appear? (Y/N) Message: ___________
4. Enter both fields, observe form state
   - Does button disable during submission? (Y/N)
   - Does loading spinner appear? (Y/N)

**Pass Criteria:** Validation working for all fields

**TEST 2.2: Signup Form Validation**
1. Leave fields empty, click Signup
   - Required field errors appear? (Y/N)
2. Enter mismatched passwords
   - Error appears? (Y/N) Message: ___________
3. Enter invalid email
   - Email validation error? (Y/N)
4. Don't check T&C, click Signup
   - T&C error appears? (Y/N)
5. Enter weak password
   - Password strength validation? (Y/N) Requirements: ___________

**Pass Criteria:** All validation checks working

**Pass/Fail:** ✅ / ❌

---

### PHASE 3: Network & API Testing

**TEST 3.1: Login API Request**
1. Fill login form with valid credentials:
   - Email: testuser@example.com
   - Password: Test@1234
2. Open DevTools → Network tab
3. Click Login button
4. Observe network request:
   - **Request URL:** _______________________ (e.g., /api/auth/login or /api/login)
   - **Request Method:** _______ (should be POST)
   - **Request Headers:** Check for Content-Type: application/json
   - **Request Body:** Shows email and password? (Y/N)
   - **Response Status:** _______ (should be 200 on success or 401 on invalid creds)
   - **Response Time:** _______ ms
   - **Response Body:** Show first 200 chars: _________________________

**If 401 (Unauthorized):**
- Error message in response? (Y/N) Message: ___________
- Is this expected for invalid credentials? (Y/N)

**If 404 (Not Found):**
- Endpoint doesn't exist
- Check if API_BASE_URL is configured correctly
- Report endpoint tried: ___________

**If 500 (Server Error):**
- Backend has error
- Error message in response? (Y/N) Message: ___________

**If Timeout (>30 seconds):**
- Backend not responding
- Network issue? (Y/N)

**Pass Criteria:** Request sent to correct endpoint, returns 200 or clear error

**TEST 3.2: Signup API Request**
1. Fill signup form with new test data:
   - Name: Test User
   - Email: newuser_TIMESTAMP@example.com (use unique email)
   - Password: Test@1234
   - Confirm: Test@1234
2. Check T&C checkbox
3. Open DevTools → Network tab
4. Click Signup button
5. Observe network request:
   - **Request URL:** _______________________ (e.g., /api/auth/register or /api/signup)
   - **Request Method:** _______ (should be POST)
   - **Request Body:** Contains name, email, password? (Y/N)
   - **Response Status:** _______ (should be 200 or 201 on success)
   - **Response Time:** _______ ms
   - **Response Body:** Show response: _________________________

**If 400 (Bad Request):**
- Validation error from backend
- Error message? (Y/N) Message: ___________

**If 409 (Conflict):**
- Email already exists
- Is this expected for duplicate email? (Y/N)

**If 500 (Server Error):**
- Backend has error
- Error message? (Y/N) Message: ___________

**Pass Criteria:** Request sent to correct endpoint, returns 200/201 or clear error

**Pass/Fail:** ✅ / ❌

---

### PHASE 4: Success Flow Testing

**TEST 4.1: Successful Login Flow**
1. Ensure logged out (check navbar shows Login link)
2. Navigate to login page
3. Enter valid test credentials:
   - Email: testuser@example.com
   - Password: Test@1234
4. Click Login
5. Observe response:
   - **Page redirects?** (Y/N) To: _________________ (should be home or dashboard)
   - **User name appears in navbar?** (Y/N) Shows: _________________
   - **Login link changed to Logout?** (Y/N)
   - **Auth token saved?** Check DevTools → Application → Cookies/LocalStorage
     - Token present? (Y/N) Token name: _________________
   - **Success message shown?** (Y/N) Message: _________________
   - **Console errors?** (Y/N) Errors: _________________

**Pass Criteria:** Redirects, token saved, UI updates, no errors

**TEST 4.2: Successful Signup Flow**
1. Ensure logged out
2. Navigate to signup page
3. Enter new test data (use unique email with timestamp):
   - Name: Test User
   - Email: testuser_MAY08_001@example.com
   - Password: Test@1234
   - Confirm: Test@1234
4. Check T&C
5. Click Signup
6. Observe response:
   - **Success message shown?** (Y/N) Message: _________________
   - **Page redirects?** (Y/N) To: _________________ (should be login or home)
   - **Auto-login after signup?** (Y/N) (some apps do this)
   - **Redirect to verification page?** (Y/N) (if email verification required)
   - **Console errors?** (Y/N) Errors: _________________

**Pass Criteria:** Clear success feedback, user created, logical flow

**Pass/Fail:** ✅ / ❌

---

### PHASE 5: Error State Testing

**TEST 5.1: Invalid Login Credentials**
1. Navigate to login
2. Enter wrong credentials:
   - Email: testuser@example.com
   - Password: WrongPassword
3. Click Login
4. Observe:
   - **Error message shown?** (Y/N) Message: _________________
   - **User stays on login page?** (Y/N)
   - **Password cleared?** (Y/N)
   - **Email retained?** (Y/N)
   - **Helpful error text?** (Y/N) (e.g., "Invalid email or password")

**Pass Criteria:** Clear error, user not confused, can retry

**TEST 5.2: Duplicate Email Signup**
1. Signup with existing email (e.g., testuser@example.com)
2. Observe:
   - **Error message shown?** (Y/N) Message: _________________
   - **User stays on signup page?** (Y/N)
   - **Form data retained?** (Y/N)
   - **Helpful error text?** (Y/N) (e.g., "Email already registered")
   - **Link to login page?** (Y/N)

**Pass Criteria:** Clear error, helpful guidance

**TEST 5.3: Network Error Handling**
1. Go offline (DevTools → Network → set throttling to Offline)
2. Try to login/signup
3. Observe:
   - **Error message shown?** (Y/N) Message: _________________
   - **Not stuck in loading state?** (Y/N)
   - **Can retry after reconnecting?** (Y/N)

**Pass Criteria:** Graceful network error handling

**Pass/Fail:** ✅ / ❌

---

### PHASE 6: Session & Security Testing

**TEST 6.1: Session Persistence**
1. Login with valid credentials
2. Reload page (Ctrl+R)
3. Observe:
   - **User still logged in?** (Y/N)
   - **Not redirected to login?** (Y/N)
   - **User name still in navbar?** (Y/N)

**Pass Criteria:** Session survives reload

**TEST 6.2: Logout Flow**
1. Login with valid credentials
2. Find Logout button (in profile menu or navbar)
3. Click Logout
4. Observe:
   - **Page redirects?** (Y/N) To: _________________ (should be home or login)
   - **Login link restored?** (Y/N)
   - **User name removed?** (Y/N)
   - **Token cleared?** Check DevTools → Application
   - **Cannot access protected pages?** (Try going to /profile - should redirect to login)

**Pass Criteria:** Clean logout, session cleared

**TEST 6.3: Protected Routes**
1. Logout completely
2. Try to access protected page directly:
   - Go to https://pepta.shopping/profile (or similar protected route)
3. Observe:
   - **Redirected to login?** (Y/N)
   - **Cannot access profile without login?** (Y/N)

**Pass Criteria:** Protected routes properly gated

**Pass/Fail:** ✅ / ❌

---

### PHASE 7: Browser Console & Debugging

**TEST 7.1: Console Errors During Login**
1. Open DevTools → Console
2. Go through entire login flow
3. Check for errors:
   - **JavaScript errors?** (Y/N) Errors: _________________
   - **CORS errors?** (Y/N) Errors: _________________
   - **API 404 errors?** (Y/N) Endpoints: _________________
   - **Warnings (not critical)?** (Y/N) Warnings: _________________

**TEST 7.2: Console Errors During Signup**
1. Open DevTools → Console
2. Go through entire signup flow
3. Check for errors (same as 7.1)

**Pass Criteria:** No blocking errors, warnings acceptable

**Pass/Fail:** ✅ / ❌

---

### PHASE 8: Mobile & Responsive Testing

**TEST 8.1: Mobile Login (390px)**
1. Toggle device toolbar → iPhone 12
2. Click Login
3. Observe:
   - **Form visible and readable?** (Y/N)
   - **Input fields accessible?** (Y/N)
   - **Button clickable?** (Y/N)
   - **No horizontal scroll?** (Y/N)

**TEST 8.2: Mobile Signup (390px)**
1. Toggle device toolbar → iPhone 12
2. Click Signup
3. Same checks as 8.1

**Pass Criteria:** Mobile-friendly auth pages

**Pass/Fail:** ✅ / ❌

---

## ROOT CAUSE DIAGNOSIS

### If Login/Signup Not Working, Check:

**Issue Category A: Frontend Issues**
- [ ] Form not submitting (button not responding)
  - Fix: Check onClick handler in form component
- [ ] Form fields not capturing input
  - Fix: Check onChange handlers and state management
- [ ] Validation blocking submission incorrectly
  - Fix: Review validation logic

**Issue Category B: API Endpoint Issues**
- [ ] Endpoint returns 404
  - Fix: Verify API base URL in config
  - Fix: Verify endpoint path is correct (/api/auth/login vs /api/login)
- [ ] Endpoint returns 500
  - Fix: Check backend logs for server errors
- [ ] Request timeout
  - Fix: Verify backend is running and deployed

**Issue Category C: Backend Issues**
- [ ] Invalid credentials don't give clear error
  - Fix: Backend should return 401 with message
- [ ] Signup doesn't create user
  - Fix: Check database writes are working
- [ ] Email not validated on backend
  - Fix: Add email format validation on server

**Issue Category D: Database Issues**
- [ ] User login fails even with correct password
  - Fix: Check password hashing/verification logic
- [ ] User can't be created
  - Fix: Check database connection and schema
- [ ] Duplicate email not detected
  - Fix: Add unique constraint on email column

**Issue Category E: Token/Session Issues**
- [ ] Login works but session doesn't persist
  - Fix: Check if JWT token is being saved to localStorage
  - Fix: Check if token is sent in Authorization header
- [ ] Logout doesn't clear session
  - Fix: Check if token is cleared from localStorage

**Issue Category F: CORS Issues**
- [ ] CORS error in console
  - Fix: Add frontend domain to backend CORS whitelist

---

## SUMMARY & SIGN-OFF

**Phase 1 (UI Structure):** ✅ / ❌
**Phase 2 (Validation):** ✅ / ❌
**Phase 3 (API Calls):** ✅ / ❌
**Phase 4 (Success Flow):** ✅ / ❌
**Phase 5 (Error Handling):** ✅ / ❌
**Phase 6 (Session/Security):** ✅ / ❌
**Phase 7 (Console/Debugging):** ✅ / ❌
**Phase 8 (Mobile):** ✅ / ❌

**Overall Status:** ✅ WORKING / ❌ BROKEN

**Critical Issues Found:**
1. ___________________________
2. ___________________________
3. ___________________________

**Next Steps:**
- If API not working: Deploy backend and redeploy frontend
- If frontend validation issue: Fix form component
- If database issue: Run migrations and check schema
- If CORS: Update backend CORS configuration
- If session issue: Check token storage and retrieval logic

---

## ISSUE PRIORITIZATION

**CRITICAL (blocks login/signup):**
- API endpoint returns 404 or 500
- Form doesn't submit
- User not created in database

**HIGH (breaks user experience):**
- No error messages shown
- Session not persisting
- Logout doesn't work
- Mobile layout broken

**MEDIUM (nice to have):**
- Password strength validation
- Email confirmation flow
- Password reset functionality
- Remember me option

**Start with CRITICAL, then HIGH, then MEDIUM.**
