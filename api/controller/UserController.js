const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt')

dotenv.config()

const prisma = new PrismaClient()

module.exports = {
  UserController: {
    signIn: async (req, res) => {
      try {
        const { username, password } = req.body.payload;

        // Validation
        if (!username || !password) {
          return res.status(400).json({ 
            message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
            code: 'MISSING_REQUIRED_FIELDS'
          });
        }

        const user = await prisma.user.findFirst({
          where: {
            username: username,
            status: 'active'
          }
        })

        if (!user) {
          console.log('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
          return res.status(401).json({ 
            message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
            code: 'INVALID_CREDENTIALS'
          });
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          console.log('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
          return res.status(401).json({ 
            message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
            code: 'INVALID_CREDENTIALS'
          });
        }

        // สร้าง Access Token ระยะสั้น
        const accessToken = jwt.sign(
          { id: user.id, level: user.level },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' } // กำหนดระยะเวลาในการหมดอายุของ token
        )

        // สร้าง Refresh Token ระยะยาว
        const refreshToken = jwt.sign(
          { id: user.id, level: user.level },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' } // กำหนดระยะเวลาในการหมดอายุของ refresh token
        )

        // คำนวณระยะเวลาหมดอายุของ token
        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // กำหนดให้หมดอายุใน 7 วัน

        // บันทึก Refresh Token ลงในฐานข้อมูล
        await prisma.refreshToken.create({
          data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: expireAt
          }
        })

        // ส่ง Access Token กลับไปในรูปแบบ secure cookie
        res.cookie('accessToken', accessToken, {
          httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
          secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ป้องกัน CSRF
          path: '/', // กำหนด path ที่ cookie จะถูกส่ง
          maxAge: 3600000 // 1 ชั่วโมง
        });

        // ส่ง Refresh Token กลับไปในรูปแบบ secure cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
          secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ป้องกัน CSRF
          path: '/', // กำหนด path ที่ cookie จะถูกส่ง
          maxAge: 7 * 24 * 3600000 // 7 วัน
        });

        // ส่ง CSRF token ที่ csurf สร้างให้ใน cookie ที่ JavaScript อ่านได้
        const csrfToken = req.csrfToken();
        res.cookie('csrfToken', csrfToken, {
          httpOnly: false, // JavaScript อ่านได้
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 3600000 // 1 ชั่วโมง (เท่ากับ access token)
        });

        // ส่ง response กลับให้ client
        res.status(200).json({
          message: 'Login successful',
          user: { id: user.id, username: user.username, level: user.level },
        });
      } catch (error) {
        console.error('Error during sign-in:', error);
        
        // จัดการ Error แบบละเอียด
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            message: 'การเข้าสู่ระบบไม่ถูกต้อง',
            code: 'INVALID_TOKEN'
          });
        }
        
        if (error.code === 'EBADCSRFTOKEN') {
          return res.status(403).json({ 
            message: 'การตรวจสอบความปลอดภัยไม่ผ่าน กรุณาลองใหม่อีกครั้ง',
            code: 'INVALID_CSRF'
          });
        }
        
        // Database Errors
        if (error.code && error.code.startsWith('P')) {
          return res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่ภายหลัง',
            code: 'DATABASE_ERROR'
          });
        }
        
        // Default Server Error
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
          code: 'INTERNAL_ERROR'
        });
      }
    },

    signUp: async (req, res) => {
      try {
        const { username, password, name } = req.body.payload
        
        // Validation
        if (!username || !password || !name) {
          return res.status(400).json({ 
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            code: 'MISSING_REQUIRED_FIELDS'
          });
        }

        if (password.length < 6) {
          return res.status(400).json({ 
            message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
            code: 'INVALID_PASSWORD_LENGTH'
          });
        }

        const saltRounds = 10

        // เช็คว่ามีผู้ใช้ที่มีชื่อผู้ใช้นี้อยู่แล้วหรือไม่
        const existingUser = await prisma.user.findUnique({
          where: {
            username: username
          }
        })

        if (existingUser) {
          console.log('ชื่อผู้ใช้งานนี้มีอยู่แล้ว')
          return res.status(400).json({ 
            message: 'ชื่อผู้ใช้งานนี้มีอยู่แล้ว กรุณาเลือกชื่อผู้ใช้อื่น',
            code: 'USER_ALREADY_EXISTS'
          });
        }

        // แฮชรหัสผ่านก่อนบันทึก
        const hashPassword = await bcrypt.hash(password, saltRounds)

        // สร้างผู้ใช้ใหม่
        const newUser = await prisma.user.create({
          data: {
            username: username,
            password: hashPassword,
            name: name,
            level: 'user', // กำหนดระดับผู้ใช้เป็น user
            status: 'active' // กำหนดสถานะเป็น active
          }
        })

        res.status(201).json({
          message: 'User created successfully',
          user: {
            username: newUser.username,
            name: newUser.name,
            level: newUser.level,
            status: newUser.status
          }
        })

      } catch (error) {
        console.log('Error during sign-up:', error)
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง',
          code: 'INTERNAL_ERROR'
        });
      }
    },

    signOut: async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
          await prisma.refreshToken.deleteMany({
            where: {
              token: refreshToken
            }
          })
        }

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.clearCookie('csrfToken') // ลบ CSRF token
        res.clearCookie('_csrf') // ลบ CSRF secret (ที่ csurf สร้าง)
        res.status(200).json({ 
          message: 'ออกจากระบบสำเร็จ',
          code: 'LOGOUT_SUCCESS'
        })
      } catch (error) {
        console.log('Error during sign-out:', error)
        res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการออกจากระบบ',
          code: 'LOGOUT_ERROR'
        })
      }
    },

    refreshToken: async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ 
            message: 'กรุณาเข้าสู่ระบบอีกครั้ง',
            code: 'REFRESH_TOKEN_MISSING'
          });
        }

        // ตรวจสอบ refresh token ในฐานข้อมูล
        const storedToken = await prisma.refreshToken.findFirst({
          where: {
            token: refreshToken,
            expiresAt: { gt: new Date() }
          },
          include: { user: true }
        });

        if (!storedToken) {
          return res.status(401).json({ 
            message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
            code: 'REFRESH_TOKEN_EXPIRED'
          });
        }

        // ตรวจสอบความถูกต้องของ refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // สร้าง Access Token ใหม่ (ใช้ข้อมูลจาก decoded token)
        const newAccessToken = jwt.sign(
          { id: decoded.id, level: decoded.level },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );

        // สร้าง Refresh Token ใหม่ (Token Rotation) (ใช้ข้อมูลจาก decoded token)
        const newRefreshToken = jwt.sign(
          { id: decoded.id, level: decoded.level },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' }
        );

        // คำนวณระยะเวลาหมดอายุของ refresh token ใหม่
        const newExpireAt = new Date();
        newExpireAt.setDate(newExpireAt.getDate() + 7);

        // ลบ refresh token เก่าและสร้างใหม่ (Token Rotation)
        await prisma.refreshToken.delete({
          where: { id: storedToken.id }
        });

        await prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: decoded.id, // ใช้ id จาก decoded token
            expiresAt: newExpireAt
          }
        });

        // ส่ง Access Token กลับไปในรูปแบบ secure cookie
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
          secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ป้องกัน CSRF
          path: '/', // กำหนด path ที่ cookie จะถูกส่ง
          maxAge: 3600000 // 1 ชั่วโมง
        });

        // ส่ง Refresh Token ใหม่กลับไปในรูปแบบ secure cookie
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
          secure: process.env.NODE_ENV === 'production', // ใช้ secure cookie ใน production
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ป้องกัน CSRF
          path: '/', // กำหนด path ที่ cookie จะถูกส่ง
          maxAge: 7 * 24 * 3600000 // 7 วัน
        });

        // สร้าง CSRF token ใหม่ที่ csurf สร้างให้
        const newCsrfToken = req.csrfToken();

        // ส่ง CSRF token ใหม่ใน cookie ที่ JavaScript อ่านได้
        res.cookie('csrfToken', newCsrfToken, {
          httpOnly: false, // JavaScript อ่านได้
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 3600000 // 1 ชั่วโมง
        });

        res.status(200).json({
          message: 'Token refreshed successfully',
          code: 'TOKEN_REFRESH_SUCCESS'
        })

      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
            code: 'TOKEN_EXPIRED',
            expired: true 
          });
        }
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            message: 'การเข้าสู่ระบบไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่',
            code: 'INVALID_TOKEN'
          });
        }
        console.error('Error during refresh token:', error);
        res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการต่ออายุเซสชัน กรุณาลองใหม่อีกครั้ง',
          code: 'REFRESH_ERROR'
        });
      }
    }
  }
}