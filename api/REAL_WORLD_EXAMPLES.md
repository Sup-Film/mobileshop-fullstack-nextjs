# 🌍 Real-World Examples: Dual Token ในระบบจริง

## 🏢 บริษัทและแพลตฟอร์มที่ใช้ Dual Token Strategy

### 1. **Google APIs**
```javascript
// Google OAuth 2.0
{
  "access_token": "ya29.a0AfH6SMC...",
  "refresh_token": "1//04DxQb8vF...",
  "expires_in": 3599,
  "scope": "https://www.googleapis.com/auth/userinfo.email",
  "token_type": "Bearer"
}

// การใช้งาน:
// - YouTube API
// - Gmail API  
// - Google Drive API
// - Google Analytics API
```

### 2. **Spotify Web API**
```javascript
// Spotify ใช้ OAuth 2.0 กับ Dual Token
{
  "access_token": "BQC8Z...",     // 1 ชั่วโมง
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "AQD8...",     // ไม่หมดอายุ (จนกว่าจะถูก revoke)
  "scope": "user-read-private user-read-email"
}
```

### 3. **Discord API**
```javascript
// Discord Bot Token System
{
  "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
  "token_type": "Bearer",
  "expires_in": 604800,           // 7 วัน
  "refresh_token": "D43f5y0ahjqew82jZ4NViEr2YafMKhue",
  "scope": "identify email"
}
```

### 4. **GitHub OAuth**
```javascript
// GitHub App Authentication
{
  "access_token": "ghs_16C7e42F292c6912E7710c838347Ae178B4a",
  "expires_in": 28800,            // 8 ชั่วโมง
  "refresh_token": "ghr_1B4a2e77838347a7E420ce178f2E7c6912E169246c34E0",
  "refresh_token_expires_in": 15811200,  // 6 เดือน
  "token_type": "bearer",
  "scope": "repo,gist"
}
```

### 5. **Slack API**
```javascript
// Slack OAuth 2.0
{
  "ok": true,
  "access_token": "xoxp-23984754863-2348975623103",
  "refresh_token": "xoxe-1-MY5S2B6QWbr9s9Y...",
  "expires_in": 43200,            // 12 ชั่วโมง
  "token_type": "Bearer"
}
```

## 💳 **ระบบ Banking และ FinTech**

### 1. **Stripe API**
```javascript
// Stripe ใช้ Long-lived token แต่มีการ rotate
{
  "access_token": "sk_live_51H...",
  "refresh_token": "rk_live_51H...",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

### 2. **PayPal API**
```javascript
// PayPal OAuth 2.0
{
  "scope": "https://uri.paypal.com/services/subscriptions",
  "access_token": "A21AAKkdJvC...",
  "token_type": "Bearer",
  "app_id": "APP-80W284485P519543T",
  "expires_in": 32400,            // 9 ชั่วโมง
  "nonce": "2020-04-03T15:35:36ZaYZlGvEkh4yVSz8g6bAKFoGSEzuy3CQf0zrwwHkJeuFQ"
}
```

### 3. **Thai PromptPay / Thai QR**
```javascript
// ธนาคารไทยส่วนใหญ่ใช้ JWT + Refresh Token
{
  "accessToken": "eyJhbGciOiJSUzI1NiJ9...",
  "refreshToken": "def502004a8b7e...",
  "expiresIn": 900,               // 15 นาที (security สูง)
  "tokenType": "Bearer"
}
```

## 📱 **Mobile Apps ที่ใช้ Dual Token**

### 1. **Instagram/Facebook**
```javascript
// Meta (Facebook) Platform
{
  "access_token": "EAAG...",      // 1-2 ชั่วโมง
  "token_type": "bearer",
  "expires_in": 5183944           // ประมาณ 60 วัน สำหรับ long-lived token
}
// Note: Facebook มี Short-lived และ Long-lived tokens
```

### 2. **Twitter/X API**
```javascript
// Twitter OAuth 2.0 with PKCE
{
  "access_token": "VGhpcyBpcyBhbiBleFa...",
  "refresh_token": "bWlzc2luZyBhIGNvZG...",
  "expires_in": 7200,             // 2 ชั่วโมง
  "token_type": "bearer"
}
```

### 3. **TikTok for Developers**
```javascript
// TikTok Business API
{
  "access_token": "act.1234567890abcdef...",
  "expires_in": 86400,            // 24 ชั่วโมง
  "refresh_token": "rt.1234567890abcdef...",
  "refresh_expires_in": 31536000, // 365 วัน
  "token_type": "Bearer"
}
```

## 🛒 **E-commerce Platforms**

### 1. **Shopify**
```javascript
// Shopify Private Apps
{
  "access_token": "shppa_a1b2c3d4e5f6...",
  "scope": "read_products,write_orders",
  "expires_in": null,             // ไม่หมดอายุ แต่มี API rate limits
  "associated_user_scope": "write_orders,read_customers"
}
```

### 2. **WooCommerce REST API**
```javascript
// WooCommerce OAuth 1.0a (older) และ JWT (newer)
{
  "access_token": "ck_a1b2c3d4e5f6...",
  "refresh_token": "cs_a1b2c3d4e5f6...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## 🎯 **Enterprise Systems**

### 1. **Salesforce**
```javascript
// Salesforce OAuth 2.0
{
  "access_token": "00D000000000000!AR8AQBM...",
  "refresh_token": "5Aep8614iLM.Dq_UVN02PqEk...",
  "signature": "hmacSHA256Hash",
  "scope": "api web full",
  "id_token": "eyJhbGciOiJSUzI1NiJ9...",
  "instance_url": "https://MyDomainName.my.salesforce.com",
  "id": "https://login.salesforce.com/id/00D.../005...",
  "token_type": "Bearer",
  "issued_at": "1393350558895"
}
```

### 2. **Microsoft Graph API**
```javascript
// Microsoft 365 / Office 365
{
  "token_type": "Bearer",
  "expires_in": 3599,             // 1 ชั่วโมง
  "ext_expires_in": 3599,
  "access_token": "eyJ0eXAiOiJKV1QiLC...",
  "refresh_token": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBC..."
}
```

## 🎮 **Gaming Platforms**

### 1. **Steam Web API**
```javascript
// Steam ใช้ API Key แบบ static + Session tokens
{
  "steamid": "76561198063657797",
  "token": "A1B2C3D4E5F6G7H8I9J0",
  "expires": 1609459200          // Unix timestamp
}
```

### 2. **Epic Games**
```javascript
// Epic Games Store API
{
  "access_token": "eg1~eyJ0eXAiOiJKV1QiLC...",
  "expires_in": 28800,            // 8 ชั่วโมง
  "expires_at": "2023-01-01T08:00:00.000Z",
  "token_type": "bearer",
  "refresh_token": "eg1~eyJ0eXAiOiJKV1QiLC...",
  "refresh_expires": 115200,      // 32 ชั่วโมง
  "refresh_expires_at": "2023-01-02T08:00:00.000Z"
}
```

## 📊 **Analytics Platforms**

### 1. **Google Analytics**
```javascript
// GA4 Measurement Protocol
{
  "access_token": "ya29.c.b0Aaekm1J...",
  "expires_in": 3599,
  "refresh_token": "1//04-rNfREskjE...",
  "scope": "https://www.googleapis.com/auth/analytics.readonly",
  "token_type": "Bearer"
}
```

### 2. **Adobe Analytics**
```javascript
// Adobe I/O JWT
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 86399             // 24 ชั่วโมง - 1 วินาที
}
```

## 🔑 **ทำไม Dual Token ถึงได้รับความนิยม?**

### ✅ **ข้อดี:**
1. **Security**: ลดความเสี่ยงจาก token theft
2. **User Experience**: ไม่ต้อง login บ่อย
3. **Scalability**: จัดการ session ข้ามอุปกรณ์ได้
4. **Control**: สามารถ revoke token ได้ทันที
5. **Compliance**: ตรงตาม security standards (OAuth 2.0, OpenID Connect)

### 📋 **Best Practices จากระบบจริง:**

```javascript
// 1. Token Expiry Times (แนวทางทั่วไป)
const tokenConfig = {
  accessToken: {
    expiry: '15m - 1h',         // ระบบ security สูง: 15 นาที
    purpose: 'API calls'        // ระบบทั่วไป: 1 ชั่วโมง
  },
  refreshToken: {
    expiry: '7d - 6m',          // ระบบ mobile: 30-90 วัน
    purpose: 'Token renewal',   // ระบบ web: 7-14 วัน
    rotation: true              // Enterprise: 6 เดือน
  }
};

// 2. Token Storage
const storage = {
  accessToken: 'httpOnly cookie',     // หรือ memory (SPA)
  refreshToken: 'httpOnly cookie + DB', // เก็บในฐานข้อมูลเสมอ
  csrfToken: 'header/form field'
};

// 3. Token Rotation
const rotationPolicy = {
  onRefresh: 'always',          // ส่วนใหญ่ rotate ทุกครั้ง
  onSuspicious: 'immediate',    // ถ้าสงสัยว่าถูกขโมย
  onLogout: 'revoke_all'        // logout = ลบ refresh tokens ทั้งหมด
};
```

## 🎯 **สรุป**

**ใช่ครับ!** Dual Token เป็นมาตรฐานที่ใช้กันจริงๆ ในระบบใหญ่ๆ ทั่วโลก เพราะ:

- ✅ **ความปลอดภัยสูง** - มาตรฐาน OAuth 2.0
- ✅ **User Experience ดี** - ไม่ต้อง login บ่อย  
- ✅ **Scalable** - รองรับ enterprise level
- ✅ **Controllable** - จัดการ session ได้ดี

ระบบที่คุณดูนี้จึงเป็นการนำ **industry best practices** มาใช้จริง ไม่ใช่แค่ทฤษฎีหรือการทดลองครับ! 🚀
