# Elite Store - Quick Start Guide

Get the complete Elite Store application (frontend + backend) running in minutes!

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js installed
- MongoDB installed (or MongoDB Atlas account)

### Step 1: Setup Backend (2 minutes)

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start MongoDB (if local)
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# 5. Seed database with sample data
npm run seed

# 6. Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Setup Frontend (2 minutes)

```bash
# 1. Open new terminal, navigate to project root
cd ..

# 2. Install dependencies (if not already done)
npm install

# 3. Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### Step 3: Login & Explore (1 minute)

Open browser: `http://localhost:5173`

**Test Accounts:**
- **Admin:** `admin@example.com` / `admin123`
- **User:** `john@example.com` / `password123`

## 🎯 What You Get

### Frontend (React + Vite)
- ✅ Homepage with banner carousel
- ✅ Product catalog with filters
- ✅ Product detail pages
- ✅ Shopping cart
- ✅ User authentication
- ✅ Order management
- ✅ Admin panel
- ✅ 8 informational pages (Contact, FAQ, etc.)

### Backend (Node.js + Express + MongoDB)
- ✅ RESTful API
- ✅ JWT authentication
- ✅ User management
- ✅ Product CRUD operations
- ✅ Order processing
- ✅ Banner management
- ✅ Role-based access control
- ✅ Data validation
- ✅ Security features

## 📊 Sample Data Included

After running `npm run seed`:
- 3 Users (1 admin, 2 regular)
- 8 Products (Laptops, Mobile Phones, Accessories)
- 3 Banners

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elite-store
JWT_SECRET=elite-store-secret-key-2024
CLIENT_URL=http://localhost:5173
```

### Frontend (Vite default)
```
PORT: 5173 (default)
```

## 📱 API Endpoints

Base URL: `http://localhost:5000/api`

**Public:**
- GET `/products` - All products
- GET `/products/:id` - Single product
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- GET `/banners` - All banners

**Protected (requires login):**
- GET `/auth/profile` - User profile
- POST `/orders` - Create order
- GET `/orders/my-orders` - User orders
- PUT `/orders/:id/cancel` - Cancel order

**Admin Only:**
- POST `/products` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product
- GET `/orders` - All orders
- PUT `/orders/:id/status` - Update order status
- POST `/banners` - Create banner
- PUT `/banners/:id` - Update banner
- DELETE `/banners/:id` - Delete banner

## 🎨 Features to Try

### As User:
1. Browse products
2. Add items to cart
3. Create account / Login
4. Place an order
5. View order history
6. Cancel pending orders
7. Explore FAQ, Contact, etc.

### As Admin:
1. Login with admin account
2. Manage products (Add/Edit/Delete)
3. View all orders
4. Update order status
5. Manage banners
6. Reorder banner carousel

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check if port 5000 is free
lsof -i :5000
```

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `server/server.js`
- Verify `CLIENT_URL` in backend `.env`

### Database errors
```bash
# Reset database
cd server
npm run seed
```

### Login not working
- Check if you seeded the database
- Use correct credentials:
  - `admin@example.com` / `admin123`
  - `john@example.com` / `password123`

## 📚 Detailed Documentation

- **Backend Setup:** `server/SETUP_GUIDE.md`
- **API Reference:** `server/API_DOCUMENTATION.md`
- **Backend README:** `server/README.md`

## 🚢 Deployment Ready

The application is production-ready with:
- Security headers (Helmet)
- Rate limiting
- CORS protection
- Password hashing
- JWT authentication
- Input validation
- Error handling

## 💡 Next Steps

1. **Customize:**
   - Update branding and colors
   - Add your own products
   - Modify banner images

2. **Extend:**
   - Add payment gateway integration
   - Implement real email notifications
   - Add product reviews
   - Implement wishlist
   - Add advanced search

3. **Deploy:**
   - Backend: Heroku, Railway, DigitalOcean
   - Frontend: Vercel, Netlify, GitHub Pages
   - Database: MongoDB Atlas

## 🎉 You're All Set!

Your complete e-commerce application is now running!

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000  
**API Health:** http://localhost:5000/api/health

Happy coding! 🚀
