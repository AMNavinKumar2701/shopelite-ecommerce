# 🛒 ShopElite — E-Commerce Application

A full-stack e-commerce application built using:

- **Backend:** Node.js, Express  
- **Frontend:** React.js  
- **Database:** MongoDB Atlas  
- **Caching:** Redis  
- **Containerization:** Docker  

---

## 📁 Project Structure

ECOMMERCE_Latest/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md

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