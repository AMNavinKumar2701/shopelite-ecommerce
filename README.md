# 🛒 ShopElite — E-Commerce Application

A full-stack e-commerce application built using:

- **Backend:** Node.js, Express  
- **Frontend:** React.js  
- **Database:** MongoDB Atlas  
- **Caching:** Redis  
- **Containerization:** Docker  

---

## 📁 Project Structure


```
ECOMMERCE_Latest/
├── backend/                     # Node.js/Express REST API
│   ├── config/
│   │   ├── db.js               # MongoDB connection with retry & events
│   │   └── redis.js            # Redis client with reconnection strategy
│   ├── controllers/
│   │   ├── authController.js   # Register, OTP verify, Login
│   │   ├── productController.js# CRUD with Redis caching
│   │   └── cartController.js   # Cart operations
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verify + role-based authorize
│   │   ├── errorMiddleware.js  # Global error handler (Mongoose, JWT, etc.)
│   │   ├── rateLimiter.js      # General + Auth rate limiters
│   │   └── validateRequest.js  # express-validator error formatter
│   ├── models/
│   │   ├── User.js             # User schema with validation
│   │   ├── Otp.js              # OTP schema with TTL auto-expiry
│   │   ├── Product.js          # Product schema with rating
│   │   └── Cart.js             # Cart schema with items array
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── productRoutes.js    # /api/products/*
│   │   └── cartRoutes.js       # /api/cart/*
│   ├── utils/
│   │   ├── ApiError.js         # Custom error class with factory methods
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   ├── generateToken.js    # JWT token generator
│   │   ├── logger.js           # Winston logger (file + console)
│   │   ├── sendEmail.js        # Nodemailer email service
│   │   ├── validators.js       # express-validator validation rules
│   │   └── deleteUnverifiedUsers.js # Cron cleanup task
│   ├── .env                    # Environment variables
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   ├── Dockerfile              # Backend Docker image
│   └── package.json
├── frontend/                    # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation with auth-aware rendering
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state (Context API)
│   │   ├── pages/
│   │   │   ├── ProductsPage.js # Product grid + search + admin CRUD
│   │   │   ├── CartPage.js     # Cart with quantity controls
│   │   │   ├── LoginPage.js    # Login form
│   │   │   └── RegisterPage.js # Multi-step register + OTP
│   │   ├── services/
│   │   │   └── api.js          # Axios client with interceptors
│   │   ├── App.js              # Root component + routing
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles (dark mode)
│   ├── Dockerfile              # Frontend Docker image (multi-stage)
│   ├── nginx.conf              # Nginx SPA config
│   └── package.json
├── docker-compose.yml           # Full-stack orchestration
└── README.md                    # This file
```
---

## 🚀 Features

- 🔐 JWT Authentication  
- 📧 OTP Email Verification  
- 🛍️ Product Management (Admin)  
- 🛒 Shopping Cart (User)  
- ⚡ Redis Caching  
- 🛡️ Security (Helmet, Rate Limit, Validation)  
- 📊 Logging (Winston)  
- 🐳 Dockerized Full Stack  

---

## ⚙️ Tech Stack

| Layer     | Technology |
|----------|-----------|
| Frontend | React.js |
| Backend  | Node.js, Express |
| Database | MongoDB Atlas |
| Cache    | Redis |
| DevOps   | Docker, Nginx |

---

## 🚀 Running the Project

### Using Docker (Recommended)

docker-compose up --build

### Access URLs

- Frontend → http://localhost:3000  
- Backend → http://localhost:5000  

---

## 💻 Local Setup

### Backend

cd backend  
npm install  
npm run dev  

### Frontend

cd frontend  
npm install  
npm start  

---

## 🔐 Environment Variables

Create `.env` in backend:

PORT=5000  
MONGO_URI=your_mongo_uri  
JWT_SECRET=your_secret  
REDIS_HOST=localhost  
REDIS_PORT=6379  
EMAIL_USER=your_email  
EMAIL_PASS=your_app_password  

---

## 🧠 Architecture Highlights

- Clean folder structure  
- Centralized error handling  
- Middleware-based security  
- Redis caching layer  
- Role-based authorization  
- Scalable design  

---

## 📦 Key Modules

- Auth (JWT + OTP)  
- Products (CRUD + caching)  
- Cart (user operations)  
- Logging & Monitoring  
- Rate Limiting  

---

## 📜 License

ISC License
