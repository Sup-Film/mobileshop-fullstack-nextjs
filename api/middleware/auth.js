const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // สร้างตัวแปรสำหรับเก็บ access token ที่ได้จาก cookie
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    // ตรวจสอบและยืนยัน access token
    // ใช้ jwt.verify เพื่อตรวจสอบความถูกต้องของ token
    // และดึงข้อมูลผู้ใช้จาก token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // ถ้า token ถูกต้อง จะมีข้อมูลผู้ใช้ใน decoded
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token หมดอายุ', expired: true });
    }
    return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
  }
}

// สำหรับตรวจสอบสิทธิ์ตาม level (optional)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.level)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };