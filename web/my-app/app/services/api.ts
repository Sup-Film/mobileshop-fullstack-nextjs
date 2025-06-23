/**
 * ตัวอย่างการใช้งาน CSRF token สำหรับ protected endpoints
 */

import { getCSRFTokenFromCookie } from '../utils/csrf';
import axios from 'axios';
import { config } from '../config';

// สำหรับใช้ใน components หลัง login
export const apiWithCSRF = {
  // สร้าง Company
  createCompany: async (companyData: any) => {
    const csrfToken = getCSRFTokenFromCookie();
    
    if (!csrfToken) {
      throw new Error('CSRF token not found. Please login again.');
    }
    
    const response = await axios.post(`${config.apiUrl}/company/create`, {
      payload: companyData
    }, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    return response.data;
  },

  // สร้าง Product
  createProduct: async (productData: any) => {
    const csrfToken = getCSRFTokenFromCookie();
    
    if (!csrfToken) {
      throw new Error('CSRF token not found. Please login again.');
    }
    
    const response = await axios.post(`${config.apiUrl}/product/create`, {
      payload: productData
    }, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    return response.data;
  },

  // Logout
  logout: async () => {
    const csrfToken = getCSRFTokenFromCookie();
    
    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }
    
    const response = await axios.post(`${config.apiUrl}/user/signout`, {}, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const csrfToken = getCSRFTokenFromCookie();
    
    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }
    
    const response = await axios.post(`${config.apiUrl}/user/refresh-token`, {}, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    return response.data;
  }
};

// ตัวอย่างการใช้งานใน React component
/*
import { apiWithCSRF } from '../services/api';

const CompanyForm = () => {
  const handleCreateCompany = async (formData) => {
    try {
      const result = await apiWithCSRF.createCompany(formData);
      console.log('Company created:', result);
    } catch (error) {
      console.error('Error creating company:', error);
      // Handle error - อาจต้อง login ใหม่ถ้า CSRF token หายไป
    }
  };

  // ... rest of component
};
*/
