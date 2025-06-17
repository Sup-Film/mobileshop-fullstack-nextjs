const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Enhanced Authentication Middleware
 * ตรวจสอบทั้ง Access Token และ Refresh Token
 */
const enhancedAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // 1. ตรวจสอบ Access Token
  if (!accessToken) {
    return res.status(401).json({ 
      message: 'Access token is missing',
      code: 'NO_ACCESS_TOKEN'
    });
  }

  try {
    // 2. Verify Access Token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
    // 3. ตรวจสอบว่า Refresh Token ยังมีอยู่ในฐานข้อมูลไหม?
    if (refreshToken) {
      const storedRefreshToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.id,
          expiresAt: { gt: new Date() }
        }
      });

      if (!storedRefreshToken) {
        // 🚨 Refresh Token หมดอายุหรือไม่มีในฐานข้อมูล
        // แต่ Access Token ยังใช้ได้ → เตือนผู้ใช้
        res.setHeader('X-Session-Warning', 'REFRESH_TOKEN_EXPIRED');
        res.setHeader('X-Session-Expires-In', getTokenExpiryTime(accessToken));
      }
    }

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access token expired', 
        expired: true,
        code: 'ACCESS_TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      message: 'Invalid access token',
      code: 'INVALID_ACCESS_TOKEN'
    });
  }
};

/**
 * คำนวณเวลาที่เหลือของ Token
 */
const getTokenExpiryTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const remainingTime = expiryTime - currentTime;
    
    return Math.max(0, Math.floor(remainingTime / 1000)); // Return seconds
  } catch (error) {
    return 0;
  }
};

module.exports = { enhancedAuth };
