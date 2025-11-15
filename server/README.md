# Elite Store Backend API

Backend server for Elite Store e-commerce application built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- JWT-based authentication
- Role-based access control (User/Admin)
- MongoDB database with Mongoose ODM
- Data validation and sanitization
- Error handling and logging
- Security best practices (Helmet, CORS, Rate Limiting)
- Password hashing with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/elite-store
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products (`/api/products`)
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders (`/api/orders`)
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Banners (`/api/banners`)
- `GET /api/banners` - Get all active banners
- `GET /api/banners/:id` - Get banner by ID
- `POST /api/banners` - Create banner (Admin)
- `PUT /api/banners/:id` - Update banner (Admin)
- `PUT /api/banners/reorder` - Reorder banners (Admin)
- `DELETE /api/banners/:id` - Delete banner (Admin)

## Database Schema

### User
- firstName, lastName, email, password
- isAdmin, phone, addresses
- Timestamps

### Product
- name, description, price, originalPrice
- category, subcategory, brand
- image, images, stock, sku
- rating, reviews, featured
- isRefurbished, condition
- Timestamps

### Order
- user (ref), items (array)
- shippingAddress, paymentMethod, paymentStatus
- subtotal, tax, shipping, total
- status, trackingNumber
- cancelledAt, deliveredAt
- Timestamps

### Banner
- title, subtitle, image, link
- order, isActive
- Timestamps

## Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

API returns consistent error responses:
```json
{
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- MongoDB injection prevention

## License

ISC
