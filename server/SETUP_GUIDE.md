# Elite Store Backend - Complete Setup Guide

Step-by-step guide to set up and run the Elite Store backend server.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v4.4 or higher)
   - **Option 1 - Local Installation:**
     - Download from: https://www.mongodb.com/try/download/community
     - Follow installation instructions for your OS
   
   - **Option 2 - MongoDB Atlas (Cloud):**
     - Create free account: https://www.mongodb.com/cloud/atlas/register
     - Create a cluster and get connection string

3. **npm** or **yarn** (comes with Node.js)
   - Verify: `npm --version`

## 🚀 Installation Steps

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- helmet
- express-rate-limit
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` file and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/elite-store

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elite-store

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### Step 4: Start MongoDB (if using local)

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

Or if using MongoDB Atlas, ensure your cluster is running.

### Step 5: Seed the Database (Optional but Recommended)

Populate the database with sample data:
```bash
npm run seed
```

This will create:
- 3 users (1 admin, 2 regular users)
- 8 sample products
- 3 banner images

**Test Accounts Created:**
- **Admin:** `admin@example.com` / `admin123`
- **User 1:** `john@example.com` / `password123`
- **User 2:** `jane@example.com` / `password123`

### Step 6: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Step 7: Test the API

Open your browser or Postman and test:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Elite Store API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🧪 Testing API Endpoints

### Using Browser
Visit: `http://localhost:5000/`

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import the API collection (if provided)
3. Set base URL: `http://localhost:5000/api`
4. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product operations
│   ├── orderController.js    # Order management
│   └── bannerController.js   # Banner CRUD
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   └── validation.js        # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── Banner.js            # Banner schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── productRoutes.js     # Product endpoints
│   ├── orderRoutes.js       # Order endpoints
│   └── bannerRoutes.js      # Banner endpoints
├── scripts/
│   └── seed.js              # Database seeding
├── .env                     # Environment variables
├── .env.example             # Environment template
├── server.js                # Main server file
└── package.json             # Dependencies
```

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check status
   sudo systemctl status mongod
   
   # Start if not running
   sudo systemctl start mongod
   ```

2. Check MONGODB_URI in `.env` file
3. For Atlas, check network access settings and whitelist your IP

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change PORT in `.env` file to another port (e.g., 5001)
2. Kill process using port 5000:
   ```bash
   # Find process
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

### Issue 3: JWT Token Errors

**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
1. Ensure you're sending token in correct format:
   ```
   Authorization: Bearer <your_token>
   ```
2. Token might be expired (default: 7 days)
3. Login again to get new token

### Issue 4: Validation Errors

**Error:** `Validation failed: email: Valid email is required`

**Solutions:**
1. Check request body format matches API documentation
2. Ensure all required fields are provided
3. Verify data types are correct

## 📱 Connecting Frontend

Update frontend to use the API:

1. Create `.env` file in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

2. Update API calls to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Example API call
const response = await fetch(`${API_URL}/products`);
```

## 🛡️ Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS only
- [ ] Configure CORS for specific domains
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific MongoDB database
- [ ] Set up proper logging
- [ ] Implement rate limiting per user
- [ ] Add input sanitization
- [ ] Regular security updates

## 📊 Monitoring & Logging

### View Server Logs
Logs are displayed in console. For production, consider:
- Winston for file logging
- Morgan for HTTP request logging
- PM2 for process management

### Database Monitoring
```bash
# Connect to MongoDB
mongo

# Show databases
show dbs

# Use elite-store database
use elite-store

# Show collections
show collections

# Count documents
db.products.count()
db.users.count()
db.orders.count()
```

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku create elite-store-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your_atlas_uri>
heroku config:set JWT_SECRET=<strong_secret>
git push heroku main
```

### Deploy to Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Deploy to DigitalOcean/AWS
1. Set up Node.js server
2. Install MongoDB or use Atlas
3. Configure Nginx as reverse proxy
4. Use PM2 for process management
5. Set up SSL with Let's Encrypt

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🆘 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review API documentation
3. Check server logs for error messages
4. Verify MongoDB connection
5. Ensure all environment variables are set correctly

## 🎉 Success!

If you see this message:
```
✅ MongoDB Connected
🚀 Server running in development mode on port 5000
```

Your backend is ready! You can now:
- Test API endpoints
- Connect frontend application
- Start developing new features

Happy coding! 🚀
