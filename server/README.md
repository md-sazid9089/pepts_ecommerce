# PEPTS E-Commerce Headless REST API
## Next.js 14 + Prisma Backend

This is a **production-ready, API-only Next.js backend** serving as a headless REST API for your PEPTS e-commerce platform. Your separate React.js frontend communicates with this API via HTTP requests.

---

## 📋 PROJECT OVERVIEW

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  React.js Frontend                      │
│            (Separate Repository / Domain)               │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API Calls
                   │ (CORS Enabled)
                   ↓
┌─────────────────────────────────────────────────────────┐
│        Next.js 14 Headless REST API Backend             │
│        (This Repository - No HTML/UI Output)            │
│                                                         │
│  Route Handlers → Services → Prisma → Database         │
│  Middleware → Token Verification → Access Control      │
└─────────────────────────────────────────────────────────┘
```

### Key Features
✅ **API-Only**: No React components, no HTML rendering, pure JSON responses
✅ **CORS Enabled**: Fully configured for cross-origin requests
✅ **Authentication Ready**: Edge middleware for Bearer token validation
✅ **Consistent Responses**: Unified API response format
✅ **Service Layer**: Clean separation of concerns (routes → services → data)
✅ **Prisma ORM**: Type-safe database queries
✅ **Environment Configuration**: Development/production ready

---

## 🚀 QUICK START

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
```bash
# Copy example to .env.local
cp .env.example .env.local

# Edit .env.local with your database URL and configuration
nano .env.local
```

**Required Variables:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/pepts_ecommerce
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173  # Your React app URL
NODE_ENV=development
```

### 3. Setup Database with Prisma
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

---

## 📁 FOLDER STRUCTURE EXPLAINED

```
server/
├── app/
│   └── api/
│       ├── example/
│       │   └── route.js              # PUBLIC endpoints (GET, POST)
│       └── protected/
│           └── example/
│               └── [id]/
│                   └── route.js       # PROTECTED endpoints (requires token)
│
├── src/
│   ├── lib/
│   │   └── prisma.js                # Prisma Client singleton
│   │
│   ├── services/
│   │   └── example.service.js        # Business logic layer
│   │
│   └── utils/
│       └── apiResponse.js            # Response formatter utility
│
├── middleware.js                     # Edge middleware (auth protection)
├── next.config.js                    # CORS & Next.js configuration
├── .env.example                      # Environment variables template
└── package.json                      # Dependencies

```

### Why This Structure?
- **`app/api/*`**: Next.js Route Handlers (controllers)
- **`src/services/*`**: Business logic & database operations
- **`src/lib/*`**: Reusable utilities (Prisma, etc.)
- **`src/utils/*`**: Helper functions (response formatting)
- **`middleware.js`**: Global request authentication

---

## 📡 API ENDPOINTS

### PUBLIC ENDPOINTS (No Authentication Required)

#### GET `/api/example`
Fetch all examples with pagination

**Query Parameters:**
```
?page=1&pageSize=10
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Examples fetched successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/example?page=1&pageSize=10"
```

---

#### POST `/api/example`
Create a new example

**Request Body:**
```json
{
  "title": "Product Name",
  "description": "Product description",
  "price": 29.99
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "code": 201,
  "message": "Example created successfully",
  "data": {
    "id": "ex_1234567890",
    "title": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "createdAt": "2024-04-21T10:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X POST "http://localhost:3000/api/example" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Product",
    "description": "Amazing product",
    "price": 49.99
  }'
```

---

### PROTECTED ENDPOINTS (Requires Bearer Token)

#### GET `/api/protected/example/:id`
Fetch a single example (requires authentication)

**Headers:**
```
Authorization: Bearer test_your_token_here
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Example fetched successfully",
  "data": {
    "id": "ex_1",
    "title": "Example Product",
    "description": "Description",
    "price": 29.99,
    "createdAt": "2024-04-21T10:30:00.000Z"
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer test_any_token"
```

---

#### DELETE `/api/protected/example/:id`
Delete an example (requires authentication)

**Headers:**
```
Authorization: Bearer test_your_token_here
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "message": "Example deleted successfully",
  "data": null
}
```

**cURL:**
```bash
curl -X DELETE "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer test_any_token"
```

---

## 🔐 AUTHENTICATION

### How It Works

1. **Client sends request with Bearer token:**
   ```
   GET /api/protected/example/1
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

2. **Middleware intercepts request:**
   - Extracts token from Authorization header
   - Validates token against JWT secret
   - If invalid → Returns 401 Unauthorized
   - If valid → Adds user info to request headers and continues

3. **Route handler receives authorized request:**
   - Can access user info from request headers
   - Performs database operation
   - Returns JSON response

### Testing in Development

**Mock Tokens (Development Only):**
```bash
# Any token starting with "test_" works
curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer test_user_token"

# Specific admin token
curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer admin_token"

# Using your JWT_SECRET
curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer $JWT_SECRET"
```

### Production Authentication

In production, replace mock tokens with real JWT generation:

1. **Generate JWT on login:**
   ```javascript
   const token = jwt.sign(
     { userId: user.id, email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: "7d" }
   )
   ```

2. **Client stores token and sends it:**
   ```javascript
   // In React app
   const response = await fetch("http://localhost:3000/api/protected/example/1", {
     headers: {
       Authorization: `Bearer ${token}`
     }
   })
   ```

---

## 🌐 CORS CONFIGURATION

### How CORS is Configured

**File:** `next.config.js`

The API automatically responds to CORS preflight requests (OPTIONS) and includes headers:

```javascript
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Frontend Request Example

```javascript
// React.js frontend (runs on http://localhost:5173)
const response = await fetch('http://localhost:3000/api/example', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  credentials: 'include' // Allow cookies/credentials
})
```

### Troubleshooting CORS Errors

If you see CORS errors in browser console:

1. **Check FRONTEND_URL environment variable:**
   ```
   FRONTEND_URL=http://localhost:5173
   ```

2. **Ensure request includes correct headers:**
   ```javascript
   headers: {
     'Content-Type': 'application/json'
   }
   ```

3. **Browser automatically sends OPTIONS preflight request** - you don't need to handle it

---

## 📝 RESPONSE FORMAT

### Success Response (200)
```json
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "error": null,
  "timestamp": "2024-04-21T10:30:00.000Z"
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "data": null,
  "error": {
    "message": "Validation failed",
    "code": 400,
    "validationErrors": {
      "email": "Invalid email format"
    }
  },
  "timestamp": "2024-04-21T10:30:00.000Z"
}
```

### All Supported Response Types

| Status | Method | Usage |
|--------|--------|-------|
| 200 | `apiResponse.success()` | Successful operation |
| 201 | `apiResponse.created()` | Resource created |
| 400 | `apiResponse.error()` | Bad request |
| 401 | `apiResponse.unauthorized()` | Missing/invalid auth |
| 403 | `apiResponse.forbidden()` | Access denied |
| 404 | `apiResponse.notFound()` | Resource not found |
| 422 | `apiResponse.validationError()` | Validation failed |
| 500 | `apiResponse.serverError()` | Server error |

---

## 🔧 CREATING NEW ENDPOINTS

### Step 1: Create Service Layer

**File:** `src/services/products.service.js`

```javascript
import prisma from "@/lib/prisma"

export async function getAllProducts(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize
  const products = await prisma.product.findMany({ skip, take: pageSize })
  const total = await prisma.product.count()
  return { items: products, total }
}

export async function getProductById(id) {
  return await prisma.product.findUnique({ where: { id } })
}

export async function createProduct(data) {
  return await prisma.product.create({ data })
}
```

### Step 2: Create Route Handler

**File:** `app/api/products/route.js`

```javascript
import apiResponse from "@/utils/apiResponse"
import * as productsService from "@/services/products.service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")

    const { items, total } = await productsService.getAllProducts(page, pageSize)
    return apiResponse.paginated(items, total, page, pageSize)
  } catch (error) {
    return apiResponse.serverError("Failed to fetch products", error)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const product = await productsService.createProduct(body)
    return apiResponse.created(product)
  } catch (error) {
    return apiResponse.serverError("Failed to create product", error)
  }
}
```

### Step 3: Test the Endpoint

```bash
curl -X GET "http://localhost:3000/api/products?page=1&pageSize=10"
```

---

## 🧪 TESTING

### Using cURL

```bash
# Test public endpoint
curl -X GET "http://localhost:3000/api/example?page=1&pageSize=5"

# Test protected endpoint with token
curl -X GET "http://localhost:3000/api/protected/example/ex_1" \
  -H "Authorization: Bearer test_token"

# Test POST request
curl -X POST "http://localhost:3000/api/example" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","price":9.99}'
```

### Using Postman

1. Import endpoints as Postman collection
2. Set `{{baseUrl}}` = `http://localhost:3000`
3. For protected routes, add Authorization tab: `Bearer test_token`
4. Click Send

### From React Frontend

```javascript
// In your React app
async function fetchExamples() {
  const response = await fetch('http://localhost:3000/api/example?page=1', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  console.log(data)
}

async function createExample() {
  const response = await fetch('http://localhost:3000/api/example', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'New Product',
      description: 'Description',
      price: 49.99
    })
  })
  const data = await response.json()
  console.log(data)
}
```

---

## 🗄️ DATABASE WITH PRISMA

### Initialize Schema

**File:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id    Int     @id @default(autoincrement())
  title String
  description String
  price Float
  createdAt DateTime @default(now())
}
```

### Create Migration

```bash
npm run prisma:migrate
# Follow prompts to name your migration
```

### View Data

```bash
npm run prisma:studio
# Opens http://localhost:5555
```

---

## 📦 DEPLOYMENT

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Vercel

```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🐛 TROUBLESHOOTING

### "Prisma Client not found"
```bash
npm run prisma:generate
```

### "Cannot connect to database"
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Verify credentials are correct

### "CORS error from React frontend"
- Check FRONTEND_URL matches your React app URL
- Verify headers are set correctly in requests
- Clear browser cache and restart dev server

### "401 Unauthorized on protected routes"
- Ensure token is in Authorization header as `Bearer <token>`
- In dev, use `test_` prefix or `admin_token`
- Check that middleware.js is loaded

---

## 📚 RESOURCES

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📝 LICENSE

This project is part of PEPTS E-Commerce Platform

---

**Need Help?** Check the code comments in each file for detailed implementation notes!
