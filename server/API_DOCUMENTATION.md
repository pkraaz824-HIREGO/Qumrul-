# Elite Store API Documentation

Complete API reference for Elite Store e-commerce backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Access:** Public

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get User Profile
Get current user's profile information.

**Endpoint:** `GET /api/auth/profile`  
**Access:** Private (requires authentication)

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "isAdmin": false,
  "addresses": []
}
```

---

### Update User Profile
Update user profile information.

**Endpoint:** `PUT /api/auth/profile`  
**Access:** Private

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0123",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

---

## 📦 Product Endpoints

### Get All Products
Retrieve all products with optional filters.

**Endpoint:** `GET /api/products`  
**Access:** Public

**Query Parameters:**
- `category` - Filter by category (e.g., "Laptops", "Mobile Phones")
- `search` - Search in name, description, brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `featured` - Filter featured products (true/false)
- `sort` - Sort order ("price-asc", "price-desc", "name")

**Example:** `GET /api/products?category=Laptops&minPrice=1000&sort=price-asc`

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "MacBook Pro 16",
      "description": "Powerful laptop...",
      "price": 2499.99,
      "originalPrice": 2999.99,
      "category": "Laptops",
      "brand": "Apple",
      "image": "https://...",
      "stock": 15,
      "rating": 4.8,
      "reviews": 234,
      "featured": true
    }
  ]
}
```

---

### Get Product by ID
Retrieve a single product by ID.

**Endpoint:** `GET /api/products/:id`  
**Access:** Public

**Response:** `200 OK`

---

### Get Categories
Get all unique product categories.

**Endpoint:** `GET /api/products/categories`  
**Access:** Public

**Response:** `200 OK`
```json
["Laptops", "Mobile Phones", "Accessories", "Electronics"]
```

---

### Create Product
Create a new product (Admin only).

**Endpoint:** `POST /api/products`  
**Access:** Private/Admin

**Request Body:**
```json
{
  "name": "MacBook Pro 16",
  "description": "Powerful laptop for professionals",
  "price": 2499.99,
  "originalPrice": 2999.99,
  "category": "Laptops",
  "subcategory": "Professional",
  "brand": "Apple",
  "image": "https://...",
  "stock": 15,
  "sku": "MBP16-2024",
  "featured": true
}
```

**Response:** `201 Created`

---

### Update Product
Update existing product (Admin only).

**Endpoint:** `PUT /api/products/:id`  
**Access:** Private/Admin

**Request Body:** Same as create product

**Response:** `200 OK`

---

### Delete Product
Delete a product (Admin only).

**Endpoint:** `DELETE /api/products/:id`  
**Access:** Private/Admin

**Response:** `200 OK`
```json
{
  "message": "Product removed"
}
```

---

## 🛒 Order Endpoints

### Create Order
Create a new order.

**Endpoint:** `POST /api/orders`  
**Access:** Private

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "name": "MacBook Pro 16",
      "image": "https://...",
      "price": 2499.99,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Credit Card",
  "subtotal": 2499.99,
  "tax": 199.99,
  "shipping": 0,
  "total": 2699.98
}
```

**Response:** `201 Created`

---

### Get User Orders
Get all orders for logged-in user.

**Endpoint:** `GET /api/orders/my-orders`  
**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "items": [...],
    "total": 2699.98,
    "status": "pending",
    "paymentMethod": "Credit Card",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Order by ID
Get single order details.

**Endpoint:** `GET /api/orders/:id`  
**Access:** Private (owner or admin)

**Response:** `200 OK`

---

### Cancel Order
Cancel an order (before shipping).

**Endpoint:** `PUT /api/orders/:id/cancel`  
**Access:** Private

**Response:** `200 OK`
```json
{
  "message": "Order cancelled successfully",
  "order": {...}
}
```

---

### Get All Orders (Admin)
Get all orders from all users.

**Endpoint:** `GET /api/orders`  
**Access:** Private/Admin

**Response:** `200 OK`

---

### Update Order Status (Admin)
Update order status and tracking.

**Endpoint:** `PUT /api/orders/:id/status`  
**Access:** Private/Admin

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA10123456784"
}
```

**Response:** `200 OK`

---

## 🎨 Banner Endpoints

### Get All Banners
Get all active banners.

**Endpoint:** `GET /api/banners`  
**Access:** Public

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Premium Laptops",
    "subtitle": "Up to 30% off",
    "image": "https://...",
    "link": "/products?category=Laptops",
    "order": 1,
    "isActive": true
  }
]
```

---

### Get Banner by ID
Get single banner.

**Endpoint:** `GET /api/banners/:id`  
**Access:** Public

**Response:** `200 OK`

---

### Create Banner (Admin)
Create new banner.

**Endpoint:** `POST /api/banners`  
**Access:** Private/Admin

**Request Body:**
```json
{
  "title": "Premium Laptops",
  "subtitle": "Up to 30% off",
  "image": "https://...",
  "link": "/products?category=Laptops",
  "order": 1
}
```

**Response:** `201 Created`

---

### Update Banner (Admin)
Update existing banner.

**Endpoint:** `PUT /api/banners/:id`  
**Access:** Private/Admin

**Request Body:** Same as create banner

**Response:** `200 OK`

---

### Delete Banner (Admin)
Delete a banner.

**Endpoint:** `DELETE /api/banners/:id`  
**Access:** Private/Admin

**Response:** `200 OK`

---

### Reorder Banners (Admin)
Reorder multiple banners.

**Endpoint:** `PUT /api/banners/reorder`  
**Access:** Private/Admin

**Request Body:**
```json
{
  "banners": [
    { "_id": "507f...", "order": 1 },
    { "_id": "608f...", "order": 2 }
  ]
}
```

**Response:** `200 OK`

---

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error description",
  "stack": "..." // Only in development
}
```

---

## 📊 Order Status Values

- `pending` - Order placed, awaiting processing
- `processing` - Order being prepared
- `shipped` - Order shipped to customer
- `delivered` - Order delivered successfully
- `cancelled` - Order cancelled by user/admin
- `refunded` - Order refunded

## 💳 Payment Methods

- `Credit Card`
- `Debit Card`
- `UPI`
- `Net Banking`
- `Cash on Delivery`

## 📦 Product Categories

- `Laptops`
- `Mobile Phones`
- `Accessories`
- `Fashion`
- `Home`
- `Electronics`
