import axios from 'axios';
import { config } from '../config';

/**
 * ดึง CSRF token จาก server
 */
export const getCSRFToken = async (): Promise<string> => {
  try {
    const response = await axios.get(`${config.apiUrl}/csrf-token`, {
      withCredentials: true
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw new Error('Unable to get CSRF token');
  }
};

/**
 * ดึง CSRF token จาก cookie (หลัง login)
 */
export const getCSRFTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrfToken=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';')[0] || null;
  }
  return null;
};

/**
 * สร้าง axios instance พร้อม CSRF token
 */
export const createAuthenticatedAxios = () => {
  const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true
  });

  // Request interceptor เพื่อเพิ่ม CSRF token
  axiosInstance.interceptors.request.use(
    async (config) => {
      // ดึง CSRF token จาก cookie ก่อน
      let csrfToken = getCSRFTokenFromCookie();
      
      // ถ้าไม่มีใน cookie ให้ดึงจาก server (กรณี request แรก)
      if (!csrfToken && config.method !== 'get') {
        try {
          csrfToken = await getCSRFToken();
        } catch (error) {
          console.error('Failed to get CSRF token:', error);
        }
      }
      
      // เพิ่ม CSRF token ใน header
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
