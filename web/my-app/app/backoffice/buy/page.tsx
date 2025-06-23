"use client";

import React, { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import Modal from "../components/modal";
import { apiWithCSRF } from "@/app/services/api";

const Buy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState({
    serial: "",
    name: "",
    release: "",
    color: "",
    price: 0,
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    remark: "",
  });
  const [productList, setProductList] = useState<
    Array<{
      id: string | number;
      serial: string;
      name: string;
      release: string;
      color: string;
      price: number;
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      remark: string;
    }>
  >([]);

  useEffect(() => {
    fetchProductList();
  }, []);

  const fetchProductList = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/product/list`, {
        withCredentials: true // ส่ง cookies ไปด้วย
      });
      setProductList(response.data);
    } catch (error) {
      let errMsg = "Error fetching product list";
      if (typeof error === "object" && error && "response" in error) {
        const errObj = error as { response?: { data?: { message?: string } } };
        errMsg = errObj.response?.data?.message || errMsg;
      }
      console.error("Error fetching product list:", errMsg);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    setProducts({
      serial: "",
      name: "",
      release: "",
      color: "",
      price: 0,
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      remark: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setProducts((prev) => ({
      ...prev,
      [id]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...products };
      console.log("Payload:", payload);
      
      // ใช้ apiWithCSRF แทนการเรียก axios โดยตรง
      await apiWithCSRF.createProduct(payload);
      
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        text: "สร้างสินค้าใหม่เรียบร้อยแล้ว",
        icon: "success",
      }).then(() => {
        setIsOpen(false);
        setProducts({
          serial: "",
          name: "",
          release: "",
          color: "",
          price: 0,
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          remark: "",
        });
        fetchProductList(); // อัพเดทตารางหลังบันทึกสำเร็จ
      });
    } catch (error) {
      let errMsg = "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง";
      if (typeof error === "object" && error && "response" in error) {
        const errObj = error as { response?: { data?: { message?: string } } };
        errMsg = errObj.response?.data?.message || errMsg;
      } else if (error instanceof Error) {
        errMsg = error.message;
      }
      
      console.error("Error creating product:", error);
      
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: errMsg,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="w-full bg-gray-900/80 rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in border border-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight drop-shadow">
          Buy
        </h1>
        {/* Line */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
        {/* Content */}
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-2 px-5 rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
            onClick={handleOpenModal}>
            <FaPlus className="text-pink-200 drop-shadow" />
            <span className="tracking-wide">เพิ่มรายการซื้อ</span>
          </button>
        </div>

        {/* Product List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-gray-700 rounded-full"></span>
            รายการสินค้า
          </h2>
          <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-800 bg-gray-900">
            <table className="w-full min-w-[600px] text-left text-gray-200">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-4 font-bold tracking-wide text-sm rounded-tl-2xl border-b border-gray-700">
                    Serial
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    ชื่อสินค้า
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    รุ่น
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    สี
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    ราคา
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    ลูกค้า
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm border-b border-gray-700">
                    เบอร์โทร
                  </th>
                  <th className="p-4 font-bold tracking-wide text-sm rounded-tr-2xl border-b border-gray-700">
                    หมายเหตุ
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 animate-pulse">
                      ไม่พบข้อมูลสินค้า
                    </td>
                  </tr>
                ) : (
                  productList.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-700/80 transition duration-200`}
                    >
                      <td className="p-4 font-mono">{product.serial}</td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.release}</td>
                      <td className="p-4">{product.color}</td>
                      <td className="p-4">{product.price} บาท</td>
                      <td className="p-4">{product.customerName}</td>
                      <td className="p-4">{product.customerPhone}</td>
                      <td className="p-4">{product.remark}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="เพิ่มรายการซื้อ"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl">
        <form className="flex flex-col gap-6" onSubmit={handleSave}>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="serial">
              Serial
            </label>
            <input
              id="serial"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="Serial Number"
              maxLength={50}
              required
              value={products.serial}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="productName">
              ชื่อสินค้า
            </label>
            <input
              id="name"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="กรอกชื่อสินค้า เช่น iPhone 15 Pro Max"
              maxLength={50}
              required
              value={products.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="release">
              ปีที่วางจำหน่าย
            </label>
            <input
              id="release"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="ปีที่วางจำหน่าย เช่น 2023"
              maxLength={10}
              value={products.release}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="color">
              สี
            </label>
            <input
              id="color"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="สีของสินค้า"
              maxLength={30}
              value={products.color}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="price">
              ราคา
            </label>
            <input
              id="price"
              type="number"
              min={0}
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="ราคาสินค้า"
              required
              value={products.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="customerName">
              ชื่อลูกค้า
            </label>
            <input
              id="customerName"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="ชื่อลูกค้า"
              maxLength={50}
              value={products.customerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="customerPhone">
              เบอร์โทรลูกค้า
            </label>
            <input
              id="customerPhone"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="เบอร์โทรลูกค้า"
              maxLength={20}
              value={products.customerPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="customerAddress">
              ที่อยู่ลูกค้า
            </label>
            <input
              id="customerAddress"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="ที่อยู่ลูกค้า"
              maxLength={100}
              value={products.customerAddress}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-semibold"
              htmlFor="remark">
              หมายเหตุ
            </label>
            <input
              id="remark"
              type="text"
              className="border-none outline-none bg-gray-800 rounded-xl p-3 w-full placeholder:font-semibold text-gray-200 focus:ring-2 focus:ring-blue-500 shadow-inner transition-all duration-150"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
              maxLength={100}
              value={products.remark}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition font-semibold"
              onClick={() => setIsOpen(false)}>
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
              บันทึก
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Buy;
