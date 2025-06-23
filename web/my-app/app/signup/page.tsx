"use client";
import React, { useState } from "react";
import { config } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaIdCard,
} from "react-icons/fa";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const payload = {
        username: username,
        password: password,
        name: name,
      };
      const response = await axios.post(
        `${config.apiUrl}/user/signup`,
        {
          payload,
        },
        {
          withCredentials: true, // ส่งคุกกี้ CSRF token
        }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ!",
          text: response.data.message,
          icon: "success",
          timer: 2000,
        }).then(() => {
          router.push("/signin");
        });
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      // ตัวแปรสำหรับเก็บข้อความ error
      let title = 'เกิดข้อผิดพลาด';
      let message = 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง';
      let showRetryButton = false;
      
      // ตรวจสอบว่าเป็น Axios Error หรือไม่
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        const backendMessage = errorData?.message;
        const errorCode = errorData?.code;
        
        // ใช้ข้อความจาก Backend ถ้ามี
        if (backendMessage) {
          message = backendMessage;
        }
        
        // จัดการตาม Status Code
        if (status === 400) {
          title = 'ข้อมูลไม่ถูกต้อง';
          if (errorCode === 'MISSING_REQUIRED_FIELDS') {
            message = 'กรุณากรอกข้อมูลให้ครบถ้วน';
          } else if (errorCode === 'INVALID_PASSWORD_LENGTH') {
            message = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
          }
        } 
        else if (status === 409) {
          title = 'ข้อมูลซ้ำ';
          if (errorCode === 'USER_ALREADY_EXISTS') {
            message = 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่อผู้ใช้อื่น';
          }
        }
        else if (status === 500) {
          title = 'เกิดข้อผิดพลาดในระบบ';
          message = backendMessage || 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง';
          showRetryButton = true;
        }
        else if (status === undefined) {
          // Network Error
          title = 'ปัญหาการเชื่อมต่อ';
          message = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
          showRetryButton = true;
        }
      } else {
        // กรณี Error อื่น ๆ ที่ไม่ใช่ Axios
        title = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
        message = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง';
        showRetryButton = true;
      }
      
      // แสดง Error Message
      const result = await Swal.fire({
        title: title,
        text: message,
        icon: "error",
        showCancelButton: showRetryButton,
        confirmButtonText: showRetryButton ? 'ลองอีกครั้ง' : 'ตกลง',
        cancelButtonText: showRetryButton ? 'ยกเลิก' : undefined
      });
      
      // หาก user เลือกลองใหม่
      if (result.isConfirmed && showRetryButton) {
        // สามารถเรียก handleSignUp() อีกครั้งได้ หรือให้ผู้ใช้กดปุ่มใหม่
        // await handleSignUp(); // เปิดใช้ถ้าต้องการ auto retry
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
      <div className="backdrop-blur-md bg-gray-800/80 shadow-2xl rounded-2xl p-8 md:p-12 w-[90vw] max-w-md flex flex-col gap-8 animate-fade-in border border-gray-700">
        <div className="flex flex-col items-center gap-2">
          <FaUserCircle className="text-gray-300 drop-shadow-lg text-6xl bg-gradient-to-tr from-green-700 to-green-900 rounded-full p-2" />
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight drop-shadow">
            Sign Up
          </h1>
        </div>
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}>
          <div className="relative flex items-center w-full rounded-lg shadow-lg bg-gray-900/80 focus-within:ring-2 focus-within:ring-green-500 transition border border-gray-700">
            <span className="p-3 rounded-l-lg text-green-400">
              <FaIdCard className="text-xl" />
            </span>
            <input
              type="text"
              className="border-none outline-none bg-transparent rounded-r-lg p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-0"
              placeholder="ชื่อ-นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="relative flex items-center w-full rounded-lg shadow-lg bg-gray-900/80 focus-within:ring-2 focus-within:ring-green-500 transition border border-gray-700">
            <span className="p-3 rounded-l-lg text-green-400">
              <FaUser className="text-xl" />
            </span>
            <input
              type="text"
              className="border-none outline-none bg-transparent rounded-r-lg p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-0"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="relative flex items-center w-full rounded-lg shadow-lg bg-gray-900/80 focus-within:ring-2 focus-within:ring-green-500 transition border border-gray-700">
            <span className="p-3 rounded-l-lg text-green-400">
              <FaLock className="text-xl" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="border-none outline-none bg-transparent rounded-r-lg p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-0"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 text-green-400 hover:text-green-300 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-gray-400">
              มีบัญชีแล้ว?{" "}
              <button
                type="button"
                className="text-green-400 hover:underline hover:text-green-200 transition"
                onClick={() => router.push("/signin")}>
                เข้าสู่ระบบ
              </button>
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-3 rounded-lg font-bold shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-700 to-green-900 text-white hover:scale-[1.03] hover:shadow-xl hover:from-green-800 hover:to-green-950'
            }`}>
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
