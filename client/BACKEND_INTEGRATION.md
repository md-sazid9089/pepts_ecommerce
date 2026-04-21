# Frontend to Backend Integration Setup ✅

## Overview

Your React frontend is now **fully configured and ready to connect** to the Next.js backend API!

---

## 📁 Files Created

### Configuration
- ✅ `client/src/config/api.js` - API configuration
- ✅ `client/.env` - Development environment variables
- ✅ `client/.env.production` - Production environment variables

### API Client
- ✅ `client/src/services/apiClient.js` - Main HTTP client

### API Services (Feature-based)
- ✅ `client/src/services/api/auth.api.js` - Authentication
- ✅ `client/src/services/api/products.api.js` - Products
- ✅ `client/src/services/api/orders.api.js` - Orders
- ✅ `client/src/services/api/categories.api.js` - Categories
- ✅ `client/src/services/api/reviews.api.js` - Reviews
- ✅ `client/src/services/api/inquiries.api.js` - B2B Inquiries
- ✅ `client/src/services/api/index.js` - Centralized exports

---

## 🚀 How to Use

### 1. Import API Services

```javascript
import { 
  authApi, 
  productsApi, 
  ordersApi, 
  categoriesApi, 
  reviewsApi,
  inquiriesApi 
} from "@/services/api"
```

### 2. Example: Authentication

```javascript
import { useState } from "react"
import { authApi } from "@/services/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Call backend API
    const response = await authApi.login(email, password)

    if (response.success) {
      console.log("✅ Login successful!")
      // Token is automatically saved to localStorage
      // Redirect to dashboard
    } else {
      setError(response.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
```

### 3. Example: Fetch Products

```javascript
import { useEffect, useState } from "react"
import { productsApi } from "@/services/api"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      // Fetch products from backend
      const response = await productsApi.getAll(1, 20)

      if (response.success) {
        setProducts(response.data.items)
      } else {
        setError(response.message)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  )
}
```

### 4. Example: Submit B2B Inquiry

```javascript
import { useState } from "react"
import { inquiriesApi } from "@/services/api"

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    productName: "",
    requestedQuantity: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Submit inquiry to backend
    const response = await inquiriesApi.submit(formData)

    if (response.success) {
      setSuccess(true)
      setFormData({
        companyName: "",
        contactEmail: "",
        productName: "",
        requestedQuantity: "",
      })
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        placeholder="Company Name"
        required
      />
      <input
        type="email"
        value={formData.contactEmail}
        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={formData.productName}
        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
        placeholder="Product Interested In"
        required
      />
      <input
        type="number"
        value={formData.requestedQuantity}
        onChange={(e) => setFormData({ ...formData, requestedQuantity: e.target.value })}
        placeholder="Quantity"
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Inquiry"}
      </button>
      {success && <p style={{ color: "green" }}>✅ Inquiry submitted successfully!</p>}
    </form>
  )
}
```

---

## 🔐 Authentication Flow

### Login
```javascript
const response = await authApi.login("user@example.com", "password")
// ✅ Token is automatically saved to localStorage
```

### Check if Authenticated
```javascript
if (authApi.isAuthenticated()) {
  // User is logged in
}
```

### Get Current User
```javascript
const response = await authApi.getCurrentUser()
if (response.success) {
  console.log(response.data.email)
}
```

### Logout
```javascript
authApi.logout()
// ✅ Token is cleared from localStorage
```

---

## 📝 API Services Reference

### authApi
```javascript
authApi.register(email, password, firstName, lastName)
authApi.login(email, password)
authApi.getCurrentUser()
authApi.logout()
authApi.isAuthenticated()
```

### productsApi
```javascript
productsApi.getAll(page, pageSize, filters)
productsApi.getById(productId)
productsApi.create(productData)
productsApi.update(productId, productData)
productsApi.delete(productId)
productsApi.getBulkPricing(productId)
productsApi.search(query, pageSize)
productsApi.getFeatured()
```

### ordersApi
```javascript
ordersApi.getAll(page, pageSize, filters)
ordersApi.getById(orderId)
ordersApi.create(orderData)
ordersApi.updateStatus(orderId, status)
ordersApi.cancel(orderId)
ordersApi.getUserOrders(page)
```

### categoriesApi
```javascript
categoriesApi.getAll()
categoriesApi.getById(categoryId)
categoriesApi.getProducts(categoryId, page, pageSize)
categoriesApi.create(categoryData)
categoriesApi.update(categoryId, categoryData)
categoriesApi.delete(categoryId)
```

### reviewsApi
```javascript
reviewsApi.getByProduct(productId, page, pageSize)
reviewsApi.submit(productId, reviewData)
reviewsApi.getAll(page, pageSize, filters)
reviewsApi.approve(reviewId)
reviewsApi.reject(reviewId)
reviewsApi.delete(reviewId)
```

### inquiriesApi
```javascript
inquiriesApi.getAll(page, pageSize, filters)
inquiriesApi.submit(inquiryData)
inquiriesApi.getById(inquiryId)
inquiriesApi.update(inquiryId, updateData)
inquiriesApi.delete(inquiryId)
inquiriesApi.markReplied(inquiryId)
inquiriesApi.getPendingCount()
```

---

## ✅ Prerequisites

1. **Backend Running**
   ```bash
   cd server
   npm run dev
   # Backend at http://localhost:3000
   ```

2. **Frontend Dev Server**
   ```bash
   cd client
   npm run dev
   # Frontend at http://localhost:5173
   ```

3. **Environment Variables Set**
   ```bash
   # client/.env already configured:
   VITE_API_URL=http://localhost:3000
   ```

---

## 🧪 Testing the Connection

### 1. Test Public Endpoint

Open browser console and run:

```javascript
import { productsApi } from "@/services/api"

const response = await productsApi.getAll(1, 10)
console.log(response)
```

You should see products data returned from backend.

### 2. Test Authentication

```javascript
import { authApi } from "@/services/api"

// Login (requires user account on backend)
const response = await authApi.login("test@example.com", "password123")
console.log(response)

// Check if authenticated
console.log(authApi.isAuthenticated())

// Get current user
const user = await authApi.getCurrentUser()
console.log(user)
```

### 3. Test Protected Endpoint

After logging in, token will be included automatically:

```javascript
// This will automatically include Authorization header
const response = await authApi.getCurrentUser()
console.log(response)
```

---

## 🔄 Response Format

All API calls return a consistent format:

**Success:**
```json
{
  "success": true,
  "code": 200,
  "message": "Products fetched successfully",
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```

**Error:**
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "data": null,
  "error": { ... }
}
```

Always check `response.success` before using `response.data`.

---

## 🛠️ Advanced Usage

### Custom Headers

```javascript
import apiClient from "@/services/apiClient"

const response = await apiClient.get("/api/products", {
  page: 1,
  pageSize: 20
})
```

### Manual API Calls

```javascript
import apiClient from "@/services/apiClient"

// GET
const getResponse = await apiClient.get("/api/custom-endpoint", { param: "value" })

// POST
const postResponse = await apiClient.post("/api/custom-endpoint", { data: "value" })

// PUT
const putResponse = await apiClient.put("/api/custom-endpoint", { data: "value" })

// DELETE
const deleteResponse = await apiClient.delete("/api/custom-endpoint")
```

---

## ⚠️ Common Issues & Solutions

### "CORS error: Access to fetch blocked"
**Cause**: Backend doesn't have CORS enabled for localhost:5173

**Solution**: Check `server/.env.local`:
```
FRONTEND_URL=http://localhost:5173
```

### "401 Unauthorized"
**Cause**: Token is missing or expired

**Solution**: 
- Make sure you're logged in first: `await authApi.login(...)`
- Token is automatically added to all subsequent requests

### "404 Not Found"
**Cause**: API endpoint doesn't exist on backend

**Solution**: Check that backend has the route handler at `/api/...`

### Network timeout
**Cause**: Backend server not running

**Solution**: Start backend: `cd server && npm run dev`

---

## 📚 Full Integration Example

```javascript
import { useEffect, useState } from "react"
import { authApi, productsApi, inquiriesApi } from "@/services/api"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [pendingInquiries, setPendingInquiries] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      // Check if user is logged in
      if (!authApi.isAuthenticated()) {
        setLoading(false)
        return
      }

      try {
        // Fetch current user
        const userResponse = await authApi.getCurrentUser()
        if (userResponse.success) {
          setUser(userResponse.data)
        }

        // Fetch products
        const productsResponse = await productsApi.getAll(1, 10)
        if (productsResponse.success) {
          setProducts(productsResponse.data.items)
        }

        // Fetch pending inquiries count (admin)
        const inquiriesCount = await inquiriesApi.getPendingCount()
        setPendingInquiries(inquiriesCount)
      } catch (error) {
        console.error("Failed to initialize dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <div>Please log in first</div>
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Products: {products.length}</p>
      <p>Pending Inquiries: {pendingInquiries}</p>
    </div>
  )
}
```

---

## 🎯 Next Steps

1. ✅ **Backend setup** - Already done! (`server/` folder)
2. ✅ **Frontend API integration** - Just completed!
3. **Connect components** - Start using API services in your React components
4. **Test endpoints** - Use browser console to test API calls
5. **Error handling** - Implement proper error UI/UX
6. **Loading states** - Show loading indicators during API calls
7. **Deploy** - Push to GitHub and deploy to Vercel

---

## 📖 Documentation

- **Backend**: `server/README.md` - Setup and API reference
- **Frontend**: This file - Integration guide
- **Full API Docs**: `server/API_DOCUMENTATION.md`

---

## ✨ You're All Set!

Your React frontend is now **fully connected and ready to communicate** with your Next.js backend API!

**Start building amazing features!** 🚀
