const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * ลบ refresh tokens ที่หมดอายุแล้ว
 */
const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    console.log(`Cleaned up ${result.count} expired refresh tokens`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    throw error;
  }
};

/**
 * ลบ refresh tokens ทั้งหมดของ user (สำหรับ logout from all devices)
 */
const revokeAllUserTokens = async (userId) => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        userId: userId
      }
    });

    console.log(`Revoked ${result.count} tokens for user ${userId}`);
    return result.count;
  } catch (error) {
    console.error('Error revoking user tokens:', error);
    throw error;
  }
};

/**
 * เริ่ม automatic cleanup ทุกชั่วโมง
 */
const startTokenCleanupScheduler = () => {
  // Cleanup ทันทีเมื่อเริ่ม
  cleanupExpiredTokens();

  // ตั้งเวลา cleanup ทุก 1 ชั่วโมง
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
  console.log('Token cleanup scheduler started (runs every hour)');
};

module.exports = {
  cleanupExpiredTokens,
  revokeAllUserTokens,
  startTokenCleanupScheduler
};
