const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// Services
const { startTokenCleanupScheduler } = require('./services/tokenCleanup');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Controllers
const { UserController } = require('./controller/UserController');
const { CompanyController } = require('./controller/CompanyController');
const { ProductController } = require('./controller/ProductController');

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CSRF Protection Configuration - Double Submit Cookie Pattern
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ใน production เท่านั้น
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // strict ใน production, lax ใน development
    path: '/',
    maxAge: 3600000 // 1 hour
  },
  value: (req) => {
    // ดึง CSRF token จาก header, body หรือ cookie
    return req.headers['x-csrf-token'] ||
      req.body._csrf ||
      req.cookies.csrfToken;
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] // อนุญาตให้ GET requests ผ่านได้
});

// เพิ่ม endpoint สำหรับดึง CSRF token (ก่อน login)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({
    csrfToken: req.csrfToken(),
    message: 'CSRF token generated successfully'
  });
});

// User routes - เพิ่ม CSRF protection สำหรับ signin
app.post('/api/user/signin', csrfProtection, UserController.signIn);
app.post('/api/user/signup', csrfProtection, UserController.signUp);
app.post('/api/user/refresh-token', csrfProtection, UserController.refreshToken);
app.post('/api/user/signout', csrfProtection, UserController.signOut);

// Protected Routes - ใช้ middleware ตรวจสอบ token
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

// Company routes (Authenticate)
app.post('/api/company/create', authenticateToken, csrfProtection, CompanyController.create);
app.get('/api/company/list', authenticateToken, CompanyController.getAll);

// Product routes (Authenticate)
app.post('/api/product/create', authenticateToken, csrfProtection, ProductController.create);
app.get('/api/product/list', authenticateToken, ProductController.getAll);

// เริ่ม Token Cleanup Scheduler
startTokenCleanupScheduler();

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Press Ctrl+C to stop the server.`);
});