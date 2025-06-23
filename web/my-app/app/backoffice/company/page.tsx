"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { config } from "@/app/config";
import Swal from "sweetalert2";

const Company = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/company/list`);
      if (response.data) {
        setForm({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          taxCode: response.data.taxCode,
        });
      }
      console.log(response.data);
    } catch (error: any) {
      console.error("Error updating form:", error.response.data.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: call API to save data
    try {
      setShowModal(false);
      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        taxCode: form.taxCode,
      };

      const response = await axios.post(
        `${config.apiUrl}/company/create`,
        payload
      );
      if (response.data) {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          text: "ข้อมูลร้านค้าได้ถูกบันทึกเรียบร้อยแล้ว",
          icon: "success",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  // ฟังก์ชัน handleChange สำหรับ input ทุกช่องใน modal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-2xl bg-gray-900/80 rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in border border-gray-800">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-300 mb-6 text-center drop-shadow">
          ข้อมูลร้าน
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-tr from-blue-700 to-blue-400 shadow-lg border-4 border-blue-900">
            <img
              src="/globe.svg"
              alt="Company Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">ชื่อร้าน</div>
                <div className="flex items-center h-12 bg-gray-800 rounded-lg px-4 py-2 text-gray-200 font-semibold shadow-inner">
                  {form.name}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">เบอร์โทร</div>
                <div className="flex items-center h-12 bg-gray-800 rounded-lg px-4 py-2 text-gray-200 font-semibold shadow-inner">
                  {form.phone}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-400 text-xs mb-1">ที่อยู่</div>
                <div className="flex items-center h-12 bg-gray-800 rounded-lg px-4 py-2 text-gray-200 font-semibold shadow-inner">
                  {form.address}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-400 text-xs mb-1">อีเมล</div>
                <div className="flex items-center h-12 bg-gray-800 rounded-lg px-4 py-2 text-gray-200 font-semibold shadow-inner">
                  {form.email}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-400 text-xs mb-1">
                  รหัสประจำตัวผู้เสียภาษี
                </div>
                <div className="flex items-center h-12 bg-gray-800 rounded-lg px-4 py-2 text-gray-200 font-semibold shadow-inner">
                  {form.taxCode}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowModal(true)}>
                แก้ไขข้อมูลร้าน
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-700 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-400 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="ปิด">
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center">
              แก้ไขข้อมูลร้าน
            </h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  ชื่อร้าน
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full rounded-lg px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">
                  รหัสประจำตัวผู้เสียภาษี
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={form.taxCode}
                  onChange={handleChange}
                  className="w-full rounded-lg px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                  onClick={() => {
                    setShowModal(false);
                    fetchCompanyData();
                  }}>
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
