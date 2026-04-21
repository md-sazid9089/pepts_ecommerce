# PEPTS E-Commerce API DOCUMENTATION

## Overview

This is a comprehensive REST API for the PEPTS e-commerce platform. All endpoints return JSON responses following the standard format defined in `src/utils/apiResponse.js`.

---

## Authentication

### Public Endpoints
No authentication required. Anyone can access these endpoints.

### Protected Endpoints
Require Bearer token authentication. Send token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "code": 200,
  "message": "Success message",
  "data": { /* actual data */ },
  "error": null,
  "timestamp": "2024-04-21T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "data": null,
  "error": {
    "message": "Error details",
    "code": 400
  },
  "timestamp": "2024-04-21T10:30:00.000Z"
}
```

---

## API Endpoints

### AUTHENTICATION

#### POST `/api/auth/register`
Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "code": 201,
  "message": "User registered successfully",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### POST `/api/auth/login`
Login with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Login successful",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### GET `/api/auth/me` (Protected)
Get current logged-in user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "User profile retrieved",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

---

### PRODUCTS

#### GET `/api/products`
Get all products with pagination and filtering

**Query Parameters:**
```
?page=1&pageSize=20&category=electronics&search=phone&sortBy=price&sortOrder=asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Products fetched successfully",
  "data": {
    "items": [
      {
        "id": "prod_123",
        "title": "iPhone 15",
        "description": "Latest Apple smartphone",
        "price": 999.99,
        "stock": 50,
        "categoryId": "cat_1",
        "category": { "id": "cat_1", "name": "Electronics" },
        "createdAt": "2024-04-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

#### GET `/api/products/:id`
Get a single product by ID

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Product fetched successfully",
  "data": {
    "id": "prod_123",
    "title": "iPhone 15",
    "description": "Latest Apple smartphone",
    "price": 999.99,
    "stock": 50,
    "categoryId": "cat_1",
    "category": { "id": "cat_1", "name": "Electronics" },
    "bulkPrices": [
      { "minQuantity": 10, "price": 899.99, "discount": 10 },
      { "minQuantity": 50, "price": 799.99, "discount": 20 }
    ],
    "reviews": [
      { "id": "rev_1", "rating": 5, "title": "Great phone!", "comment": "Excellent quality" }
    ]
  }
}
```

---

#### POST `/api/products` (Protected - Admin)
Create a new product

**Request Body:**
```json
{
  "title": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "stock": 100,
  "categoryId": "cat_1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "code": 201,
  "message": "Product created successfully",
  "data": {
    "id": "prod_123",
    "title": "iPhone 15",
    "price": 999.99,
    "stock": 100
  }
}
```

---

#### PUT `/api/products/:id` (Protected - Admin)
Update an existing product

**Request Body:**
```json
{
  "title": "iPhone 15 Pro",
  "price": 1099.99,
  "stock": 120
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

---

#### DELETE `/api/products/:id` (Protected - Admin)
Delete a product

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Product deleted successfully",
  "data": null
}
```

---

### CATEGORIES

#### GET `/api/categories`
Get all product categories

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Categories fetched successfully",
  "data": {
    "items": [
      { "id": "cat_1", "name": "Electronics", "description": "..." },
      { "id": "cat_2", "name": "Dolls", "description": "..." },
      { "id": "cat_3", "name": "Gadgets", "description": "..." }
    ]
  }
}
```

---

#### GET `/api/categories/:id/products`
Get all products in a specific category

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Category products fetched successfully",
  "data": {
    "category": { "id": "cat_1", "name": "Electronics" },
    "products": [...]
  }
}
```

---

### BULK PRICING

#### GET `/api/bulk-pricing/:productId`
Get bulk pricing tiers for a product

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Bulk pricing fetched successfully",
  "data": {
    "productId": "prod_123",
    "product": { "id": "prod_123", "title": "iPhone 15", "price": 999.99 },
    "tiers": [
      { "minQuantity": 10, "price": 899.99, "discount": 10 },
      { "minQuantity": 50, "price": 799.99, "discount": 20 },
      { "minQuantity": 100, "price": 699.99, "discount": 30 }
    ]
  }
}
```

---

#### POST `/api/bulk-pricing` (Protected - Admin)
Create/update bulk pricing tier

**Request Body:**
```json
{
  "productId": "prod_123",
  "minQuantity": 50,
  "price": 799.99,
  "discount": 20
}
```

---

#### DELETE `/api/bulk-pricing/:id` (Protected - Admin)
Delete a bulk pricing tier

---

### INQUIRIES (B2B)

#### GET `/api/inquiries` (Protected - Admin)
Get all wholesale/B2B inquiries

**Query Parameters:**
```
?page=1&pageSize=10&status=new&sortBy=createdAt
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Inquiries fetched successfully",
  "data": {
    "items": [
      {
        "id": "inq_1",
        "companyName": "Wholesale Buyer Co.",
        "contactEmail": "buyer@example.com",
        "contactPhone": "+1-555-0123",
        "productName": "Fashion Dolls",
        "requestedQuantity": 500,
        "message": "Interested in bulk purchase",
        "status": "new",
        "createdAt": "2024-04-21T10:00:00.000Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

#### POST `/api/inquiries`
Submit a new wholesale inquiry (Public)

**Request Body:**
```json
{
  "companyName": "Retail Store Ltd.",
  "contactEmail": "store@example.com",
  "contactPhone": "+1-555-0456",
  "productName": "RC Cars",
  "requestedQuantity": 200,
  "message": "Looking for bulk pricing on RC cars"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "code": 201,
  "message": "Inquiry submitted successfully. We will contact you soon!",
  "data": {
    "id": "inq_1",
    "status": "new",
    "createdAt": "2024-04-21T10:30:00.000Z"
  }
}
```

---

#### PUT `/api/inquiries/:id` (Protected - Admin)
Update inquiry status and notes

**Request Body:**
```json
{
  "status": "replied",
  "notes": "Sent custom quote - awaiting response"
}
```

---

#### DELETE `/api/inquiries/:id` (Protected - Admin)
Delete an inquiry

---

### ORDERS

#### GET `/api/orders` (Protected - Admin)
Get all orders

**Query Parameters:**
```
?page=1&pageSize=10&status=pending&sortBy=createdAt
```

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Orders fetched successfully",
  "data": {
    "items": [
      {
        "id": "ord_1",
        "orderNumber": "ORD-2024-0001",
        "userId": "user_1",
        "status": "processing",
        "totalAmount": 2500.00,
        "items": [
          {
            "productId": "prod_1",
            "product": { "id": "prod_1", "title": "iPhone 15" },
            "quantity": 2,
            "unitPrice": 999.99
          }
        ],
        "createdAt": "2024-04-21T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### GET `/api/orders/:id` (Protected)
Get a single order by ID

---

#### POST `/api/orders` (Protected)
Create a new order from cart

**Request Body:**
```json
{
  "items": [
    { "productId": "prod_1", "quantity": 2 },
    { "productId": "prod_2", "quantity": 1 }
  ],
  "promoCode": "SAVE10"
}
```

---

#### PUT `/api/orders/:id/status` (Protected - Admin)
Update order status

**Request Body:**
```json
{
  "status": "shipped"
}
```

---

### REVIEWS

#### GET `/api/products/:productId/reviews`
Get all reviews for a product

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Reviews fetched successfully",
  "data": {
    "productId": "prod_1",
    "reviews": [
      {
        "id": "rev_1",
        "rating": 5,
        "title": "Excellent quality!",
        "comment": "Very satisfied with this purchase",
        "email": "user@example.com",
        "status": "approved",
        "createdAt": "2024-04-20T10:00:00.000Z"
      }
    ],
    "averageRating": 4.8,
    "totalReviews": 24
  }
}
```

---

#### POST `/api/products/:productId/reviews`
Submit a review for a product

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "Highly recommended",
  "email": "user@example.com"
}
```

---

#### PUT `/api/reviews/:id` (Protected - Admin)
Approve/reject review

**Request Body:**
```json
{
  "status": "approved"
}
```

---

### USERS (Protected - Admin)

#### GET `/api/users`
Get all users

#### GET `/api/users/:id`
Get a specific user

#### PUT `/api/users/:id`
Update user information

#### DELETE `/api/users/:id`
Delete a user account

---

### ADMIN DASHBOARD (Protected - Admin)

#### GET `/api/admin/stats`
Get dashboard statistics

**Response (200 OK):**
```json
{
  "success": true,
  "code": 200,
  "message": "Dashboard stats fetched",
  "data": {
    "totalOrders": 1234,
    "totalRevenue": 125000.00,
    "totalProducts": 156,
    "totalUsers": 892,
    "pendingInquiries": 3,
    "thisMonthOrders": 145,
    "thisMonthRevenue": 12500.00,
    "topProducts": [...]
  }
}
```

---

#### GET `/api/admin/analytics`
Get advanced analytics and trends

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently, there is no rate limiting. In production, add rate limiting middleware:

```
- 100 requests per minute for public endpoints
- 1000 requests per minute for authenticated endpoints
- 10000 requests per minute for admin endpoints
```

---

## Pagination

All list endpoints support pagination:

```
?page=1&pageSize=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 156,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Filtering & Sorting

Example queries:

```
GET /api/products?category=electronics&search=phone&sortBy=price&sortOrder=asc
GET /api/orders?status=pending&sortBy=createdAt&sortOrder=desc
GET /api/inquiries?status=new&assignedTo=admin_1
```

---

## Versioning

API Version: v1
Future versions can be created at `/api/v2/*`

---

## Support

For issues or questions, contact: support@pepts-ecommerce.com

