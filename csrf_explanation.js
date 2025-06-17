// ตัวอย่างการทำงานของ CSRF Protection (Simplified)

// === ใน csurf library (Simplified) ===
function generateSecret() {
  return crypto.randomBytes(16).toString('hex'); // สร้าง secret แบบสุ่ม
}

function generateToken(secret) {
  // สร้าง token จาก secret (ไม่ใช่การเข้ารหัส แต่เป็น hash)
  return crypto.createHash('sha256')
    .update(secret)
    .update('some-salt') // เพิ่ม salt
    .digest('hex');
}

function validateToken(secret, token) {
  // สร้าง token ใหม่จาก secret ที่มี
  const expectedToken = generateToken(secret);
  
  // เปรียบเทียบ token ที่ frontend ส่งมา กับ token ที่คาดหวัง
  return expectedToken === token;
}

// === การทำงานใน Express ===

// Step 1: เมื่อ client ขอ CSRF token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  // csurf จะ:
  // 1. สร้าง secret ใหม่
  const secret = generateSecret(); // เช่น: "a1b2c3d4e5f6..."
  
  // 2. เก็บ secret ใน _csrf cookie
  res.cookie('_csrf', secret, { httpOnly: true });
  
  // 3. สร้าง token จาก secret
  const token = generateToken(secret); // เช่น: "9x8y7z6w5v..."
  
  // 4. ส่ง token ให้ frontend
  res.json({ csrfToken: token });
});

// Step 2: เมื่อ client ส่ง request มา
app.post('/api/user/signin', csrfProtection, (req, res) => {
  // csurf จะ:
  // 1. อ่าน secret จาก _csrf cookie
  const secret = req.cookies._csrf; // "a1b2c3d4e5f6..."
  
  // 2. อ่าน token ที่ frontend ส่งมา
  const clientToken = req.headers['x-csrf-token']; // "9x8y7z6w5v..."
  
  // 3. ตรวจสอบความถูกต้อง
  const isValid = validateToken(secret, clientToken);
  
  if (!isValid) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  
  // 4. ถ้าถูกต้อง ให้ดำเนินการต่อ
  // ... login logic ...
});

// === การทำงานใน Frontend ===

// Step 1: ขอ CSRF token
const response = await fetch('/api/csrf-token', {
  credentials: 'include' // ส่ง cookies
});
const { csrfToken } = await response.json(); // "9x8y7z6w5v..."

// Browser จะเก็บ _csrf cookie อัตโนมัติ (httpOnly)

// Step 2: ส่ง request พร้อม token
await fetch('/api/user/signin', {
  method: 'POST',
  credentials: 'include', // ส่ง _csrf cookie อัตโนมัติ
  headers: {
    'X-CSRF-Token': csrfToken // ส่ง token ใน header
  },
  body: JSON.stringify({ username, password })
});

// === ทำไม CSRF Protection ปลอดภัย? ===

// ผู้โจมตี (Attacker) ไม่สามารถ:
// 1. อ่าน _csrf cookie ได้ (httpOnly: true)
// 2. ดังนั้นไม่สามารถสร้าง valid token ได้
// 3. ไม่สามารถทำ CSRF attack ได้

// Legitimate User สามารถ:
// 1. ได้รับ token จาก /api/csrf-token
// 2. Browser เก็บ secret ใน cookie อัตโนมัติ
// 3. ส่ง token ใน header ได้
// 4. Server ตรวจสอบและอนุญาต
