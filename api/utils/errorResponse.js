/**
 * Backend Error Response Standards
 * 
 * แนวทางการส่ง Error Response ที่ดีจาก Backend
 */

// ===== 1. Standard Error Response Format =====
interface StandardErrorResponse {
  message: string;           // User-friendly message
  code: string;             // Error code สำหรับ Frontend จัดการ
  details?: any;            // รายละเอียดเพิ่มเติม (optional)
  timestamp?: string;       // เวลาที่เกิด error
  requestId?: string;       // ID สำหรับ tracking
}

// ===== 2. Error Codes Definition =====
const ERROR_CODES = {
  // Authentication Errors (401)
  INVALID_CREDENTIALS: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
  ACCESS_TOKEN_EXPIRED: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
  INVALID_ACCESS_TOKEN: 'การเข้าสู่ระบบไม่ถูกต้อง',
  
  // Authorization Errors (403)
  INSUFFICIENT_PERMISSIONS: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้',
  INVALID_CSRF_TOKEN: 'การตรวจสอบความปลอดภัยไม่ผ่าน กรุณาลองใหม่อีกครั้ง',
  
  // Validation Errors (400)
  USER_ALREADY_EXISTS: 'ชื่อผู้ใช้งานนี้มีอยู่แล้ว',
  INVALID_INPUT: 'กรุณาตรวจสอบข้อมูลที่กรอก',
  MISSING_REQUIRED_FIELDS: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  
  // Not Found Errors (404)
  USER_NOT_FOUND: 'ไม่พบผู้ใช้งานในระบบ',
  RESOURCE_NOT_FOUND: 'ไม่พบทรัพยากรที่ต้องการ',
  
  // Server Errors (500)
  DATABASE_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
  INTERNAL_ERROR: 'เกิดข้อผิดพลาดภายในระบบ'
};

// ===== 3. Error Response Helper Functions =====

const createErrorResponse = (
  statusCode: number,
  code: string,
  customMessage?: string,
  details?: any
): StandardErrorResponse => {
  return {
    message: customMessage || ERROR_CODES[code as keyof typeof ERROR_CODES] || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
    code,
    details,
    timestamp: new Date().toISOString()
  };
};

// Auth Errors
const authError = (res: any, code: string, customMessage?: string) => {
  return res.status(401).json(createErrorResponse(401, code, customMessage));
};

// Validation Errors  
const validationError = (res: any, code: string, customMessage?: string, details?: any) => {
  return res.status(400).json(createErrorResponse(400, code, customMessage, details));
};

// Permission Errors
const permissionError = (res: any, code: string, customMessage?: string) => {
  return res.status(403).json(createErrorResponse(403, code, customMessage));
};

// Not Found Errors
const notFoundError = (res: any, code: string, customMessage?: string) => {
  return res.status(404).json(createErrorResponse(404, code, customMessage));
};

// Server Errors
const serverError = (res: any, code: string, customMessage?: string, details?: any) => {
  return res.status(500).json(createErrorResponse(500, code, customMessage, details));
};

// ===== 4. ตัวอย่างการใช้งานใน Controller =====

/*
// ในไฟล์ UserController.js

// ตัวอย่าง Sign In
signIn: async (req, res) => {
  try {
    const { username, password } = req.body.payload;

    if (!username || !password) {
      return validationError(res, 'MISSING_REQUIRED_FIELDS', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    }

    const user = await prisma.user.findFirst({
      where: { username, status: 'active' }
    });

    if (!user) {
      return authError(res, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return authError(res, 'INVALID_CREDENTIALS');
    }

    // Success response...
    
  } catch (error) {
    console.error('Sign in error:', error);
    return serverError(res, 'INTERNAL_ERROR', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  }
},

// ตัวอย่าง Sign Up
signUp: async (req, res) => {
  try {
    const { username, password, name } = req.body.payload;

    // Validation
    if (!username || !password || !name) {
      return validationError(res, 'MISSING_REQUIRED_FIELDS');
    }

    if (password.length < 6) {
      return validationError(res, 'INVALID_INPUT', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return validationError(res, 'USER_ALREADY_EXISTS');
    }

    // Create user...
    
  } catch (error) {
    console.error('Sign up error:', error);
    return serverError(res, 'INTERNAL_ERROR', 'เกิดข้อผิดพลาดในการลงทะเบียน');
  }
}
*/

// ===== 5. Middleware สำหรับจัดการ Error =====

/*
// Global Error Handler Middleware
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  // CSRF Error
  if (error.code === 'EBADCSRFTOKEN') {
    return permissionError(res, 'INVALID_CSRF_TOKEN');
  }
  
  // JWT Error
  if (error.name === 'JsonWebTokenError') {
    return authError(res, 'INVALID_ACCESS_TOKEN');
  }
  
  if (error.name === 'TokenExpiredError') {
    return authError(res, 'ACCESS_TOKEN_EXPIRED');
  }
  
  // Prisma Errors
  if (error.code === 'P2002') { // Unique constraint
    return validationError(res, 'USER_ALREADY_EXISTS');
  }
  
  if (error.code?.startsWith('P')) { // Other Prisma errors
    return serverError(res, 'DATABASE_ERROR');
  }
  
  // Default server error
  return serverError(res, 'INTERNAL_ERROR');
});
*/

module.exports = {
  createErrorResponse,
  authError,
  validationError,
  permissionError,
  notFoundError,
  serverError,
  ERROR_CODES
};
