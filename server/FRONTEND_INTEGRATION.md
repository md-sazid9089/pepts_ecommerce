# Frontend to Backend Integration Guide

This guide shows how to connect your **React.js frontend** (client) to the **Next.js API backend** (server).

---

## 📋 Overview

### Architecture
```
React Frontend                 Next.js Backend
(http://localhost:5173)  ←→   (http://localhost:3000)
   client/                          server/
```

### Communication
- Frontend makes **HTTP requests** to backend API
- Backend returns **JSON responses**
- CORS is enabled, so cross-origin requests work
- Authentication via **Bearer tokens**

---

## 🔗 Connection Setup

### 1. Set Backend URL in React App

Create a config file: `client/src/config/api.js`

```javascript
/**
 * API Configuration
 * Connects React frontend to Next.js backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

export default API_BASE_URL
```

### 2. Create API Client Service

Create: `client/src/services/apiClient.js`

```javascript
/**
 * API Client Service
 * Handles all HTTP requests to the backend
 */

import API_BASE_URL from "@/config/api"

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.token = null
  }

  /**
   * Set authentication token
   * Called after user logs in
   */
  setToken(token) {
    this.token = token
    localStorage.setItem("authToken", token)
  }

  /**
   * Get authentication token from storage
   */
  getToken() {
    return this.token || localStorage.getItem("authToken")
  }

  /**
   * Clear authentication token
   * Called on logout
   */
  clearToken() {
    this.token = null
    localStorage.removeItem("authToken")
  }

  /**
   * Build request headers with auth token
   */
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Make GET request
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make POST request
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make PUT request
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Make DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`)
    }

    return data
  }

  /**
   * Handle request error
   */
  handleError(error) {
    console.error("API Error:", error)
    return {
      success: false,
      code: 0,
      message: error.message || "Network error",
      data: null,
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient(API_BASE_URL)

export default apiClient
```

### 3. Create API Service Methods

Create: `client/src/services/api/products.api.js`

```javascript
/**
 * Products API Service
 * All product-related API calls
 */

import apiClient from "@/services/apiClient"

export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (page = 1, pageSize = 20, filters = {}) => {
    try {
      const response = await apiClient.get("/api/products", {
        page,
        pageSize,
        ...filters,
      })
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get product by ID
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Create product (admin only)
   */
  create: async (productData) => {
    try {
      const response = await apiClient.post("/api/products", productData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Update product (admin only)
   */
  update: async (id, productData) => {
    try {
      const response = await apiClient.put(`/api/products/${id}`, productData)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/products/${id}`)
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}

export default productsApi
```

### 4. Create Auth API Service

Create: `client/src/services/api/auth.api.js`

```javascript
/**
 * Authentication API Service
 * Login, register, and user profile
 */

import apiClient from "@/services/apiClient"

export const authApi = {
  /**
   * Register new user
   */
  register: async (email, password, firstName, lastName) => {
    try {
      const response = await apiClient.post("/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
      })

      if (response.success && response.data.token) {
        apiClient.setToken(response.data.token)
      }

      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      })

      if (response.success && response.data.token) {
        apiClient.setToken(response.data.token)
      }

      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/api/auth/me")
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    apiClient.clearToken()
    return { success: true }
  },
}

export default authApi
```

---

## 💻 Using in React Components

### Example: Fetch Products

```javascript
import { useEffect, useState } from "react"
import productsApi from "@/services/api/products.api"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example: User Authentication

```javascript
import { useState } from "react"
import authApi from "@/services/api/auth.api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const response = await authApi.login(email, password)

    if (response.success) {
      // Token is automatically saved
      console.log("Login successful!")
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
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
```

### Example: Create New Resource

```javascript
import { useState } from "react"
import productsApi from "@/services/api/products.api"

export default function CreateProductForm() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const response = await productsApi.create({
      title,
      price: parseFloat(price),
      description: "New product",
    })

    if (response.success) {
      alert("Product created!")
      setTitle("")
      setPrice("")
    } else {
      alert(`Error: ${response.message}`)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product title"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  )
}
```

---

## 🔐 Protected API Calls

### Automatic Token Handling

Tokens are automatically added to all requests:

```javascript
// This request will automatically include:
// Authorization: Bearer <token>
const response = await apiClient.get("/api/protected/example/ex_1")
```

### Login and Token Storage

After login, token is saved to localStorage:

```javascript
const response = await authApi.login("user@example.com", "password")
// Token is automatically stored and sent with future requests
```

### Logout and Clear Token

```javascript
authApi.logout()
// Token is cleared from localStorage and will not be sent
```

---

## 📝 Environment Configuration

### Add to `client/.env`

```
REACT_APP_API_URL=http://localhost:3000
```

### For Production

Update environment based on deployment:

```
# Development
REACT_APP_API_URL=http://localhost:3000

# Staging
REACT_APP_API_URL=https://api-staging.pepts.com

# Production
REACT_APP_API_URL=https://api.pepts.com
```

---

## 🧪 Testing the Connection

### 1. Start Backend Server

```bash
cd server
npm run dev
# Backend running at http://localhost:3000
```

### 2. Start Frontend Dev Server

```bash
cd client
npm run dev
# Frontend running at http://localhost:5173
```

### 3. Test Public Endpoint

Open browser console and run:

```javascript
fetch("http://localhost:3000/api/example")
  .then(res => res.json())
  .then(data => console.log(data))
```

Should see:
```json
{
  "success": true,
  "code": 200,
  "message": "Examples fetched successfully",
  "data": { "items": [...] }
}
```

### 4. Test Protected Endpoint

```javascript
fetch("http://localhost:3000/api/protected/example/ex_1", {
  headers: {
    "Authorization": "Bearer test_token"
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## ⚠️ Common Issues

### "CORS error: Access to XMLHttpRequest blocked"

**Cause**: Backend doesn't have CORS enabled for frontend URL

**Solution**: Check `server/.env.local`:
```
FRONTEND_URL=http://localhost:5173
```

### "401 Unauthorized"

**Cause**: Token is missing or invalid

**Solution**: 
- For protected endpoints, include token: `Authorization: Bearer test_token`
- Make sure token was saved after login

### "404 Not Found"

**Cause**: API endpoint doesn't exist

**Solution**: Check API route file exists at `server/app/api/...`

### Network timeout

**Cause**: Backend server not running

**Solution**: Start backend: `cd server && npm run dev`

---

## 🚀 Production Deployment

### Backend Deployment (Vercel)

```bash
# From server directory
vercel --prod
```

### Frontend Deployment (Vercel)

```bash
# From client directory
vercel --prod
```

### Update Environment URLs

After deployment, update:

1. **Frontend .env**:
   ```
   REACT_APP_API_URL=https://your-api-domain.vercel.app
   ```

2. **Backend .env**:
   ```
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

---

## 📚 API Usage Examples

### Get All Products with Pagination

```javascript
const response = await productsApi.getAll(1, 20, {
  category: "electronics",
  search: "phone",
  sortBy: "price",
})
```

### Get Single Product

```javascript
const response = await productsApi.getById("prod_123")
console.log(response.data) // Product details with reviews and bulk prices
```

### Submit Inquiry (B2B)

```javascript
const response = await apiClient.post("/api/inquiries", {
  companyName: "Wholesale Store",
  contactEmail: "buyer@store.com",
  productName: "Fashion Dolls",
  requestedQuantity: 500,
})
```

### Create Order

```javascript
const response = await apiClient.post("/api/orders", {
  items: [
    { productId: "prod_1", quantity: 2 },
    { productId: "prod_2", quantity: 1 },
  ],
  promoCode: "SAVE10",
})
```

---

## 🔄 Data Flow Diagram

```
React Component
    ↓
API Service (e.g., productsApi.getAll())
    ↓
API Client (Makes fetch request)
    ↓
HTTP Request to Backend
    ↓
[CORS Headers Applied]
    ↓
Next.js Route Handler (/api/products/route.js)
    ↓
Service Layer (productsService.getAll())
    ↓
Prisma Query to Database
    ↓
Response Builder (apiResponse.paginated())
    ↓
JSON Response with Pagination
    ↓
API Client handles response
    ↓
React Component receives data
    ↓
Component renders UI
```

---

## ✅ Checklist

- [ ] Backend server running on http://localhost:3000
- [ ] Frontend dev server running on http://localhost:5173
- [ ] `FRONTEND_URL` set in backend `.env.local`
- [ ] `REACT_APP_API_URL` set in frontend `.env`
- [ ] API client service created in React app
- [ ] Test public endpoint works
- [ ] Test protected endpoint with token works
- [ ] Login saves token to localStorage
- [ ] Logout clears token
- [ ] Components fetch data successfully
- [ ] Error handling works properly

---

## 🎉 You're Connected!

Your React frontend is now fully integrated with your Next.js backend API!

**Next steps**:
1. Create more API service files for different features
2. Add error handling and loading states in components
3. Implement request interceptors for common headers
4. Add request caching for performance
5. Implement proper authentication flow with refresh tokens

Happy building! 🚀
