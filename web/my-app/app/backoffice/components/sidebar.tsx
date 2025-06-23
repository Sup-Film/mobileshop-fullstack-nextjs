"use client";

import Link from "next/link";
import React from "react";
import { FaHome, FaUser, FaCog, FaPhone, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { apiWithCSRF } from "@/app/services/api";
import Swal from "sweetalert2";

const menuItems = [
	{
		name: "Dashboard",
		icon: <FaHome />,
		link: "/backoffice/dashboard",
	},
	{
		name: "Buy",
		icon: <FaUser />,
		link: "/backoffice/buy",
	},
	{
		name: "Sell",
		icon: <FaCog />,
		link: "/backoffice/sell",
	},
	{
		name: "Company",
		icon: <FaUser />,
		link: "/backoffice/company",
	},
];

const SideBar = () => {
	// Responsive toggle state (for mobile menu)
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	// ฟังก์ชัน Logout
	const handleLogout = async () => {
		try {
			// แสดง confirmation dialog
			const result = await Swal.fire({
				title: 'ยืนยันการออกจากระบบ',
				text: 'คุณต้องการออกจากระบบหรือไม่?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: '#dc2626',
				cancelButtonColor: '#6b7280',
				confirmButtonText: 'ออกจากระบบ',
				cancelButtonText: 'ยกเลิก'
			});

			if (result.isConfirmed) {
				// เรียก API logout
				await apiWithCSRF.logout();
				
				// แสดงข้อความสำเร็จ
				await Swal.fire({
					title: 'ออกจากระบบสำเร็จ',
					text: 'กำลังนำท่านไปยังหน้า Sign In',
					icon: 'success',
					timer: 1500,
					showConfirmButton: false
				});

				// เปลี่ยนเส้นทางไปหน้า signin
				router.push('/signin');
			}
		} catch (error) {
			console.error('Logout error:', error);
			
			// แสดงข้อความผิดพลาด
			Swal.fire({
				title: 'เกิดข้อผิดพลาด',
				text: 'ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง',
				icon: 'error',
				confirmButtonText: 'ตกลง'
			});
		}
	};

	return (
		<>
			{/* Hamburger button for mobile */}
			{!open && (
				<button
					className="fixed top-4 left-4 z-50 md:hidden bg-teal-900/80 p-2 rounded-lg shadow-lg text-white hover:bg-teal-800 transition"
					onClick={() => setOpen((v) => !v)}
					aria-label="Toggle sidebar">
					<svg
						width="28"
						height="28"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			)}

			{/* Sidebar */}
			<div
				className={`fixed md:static z-40 h-screen w-64 shadow-lg overflow-y-auto bg-gradient-to-b from-[#11131a] via-[#181a20] to-[#23242a] transition-transform duration-300 border-r border-[#23242a]
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
				<div className="flex items-center justify-center gap-2 h-16 bg-gradient-to-r from-[#181a20] to-[#23242a] p-2 sticky top-0 z-10">
					<FaPhone className="text-gray-400" />
					<h1 className="text-gray-100 text-lg font-bold">MobileShop</h1>
					{/* Close button for mobile */}
					<button
						className="ml-auto md:hidden text-gray-400 hover:text-gray-200 p-2"
						onClick={() => setOpen(false)}
						aria-label="Close sidebar">
						<svg
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="px-4 py-2">
					<h2 className="text-gray-500 text-sm font-semibold mb-2">Menu</h2>
					<ul className="space-y-2 text-gray-400 font-bold">
						{menuItems.map((item) => (
							<Link key={item.name} href={item.link} className="">
								<li className="flex items-center gap-2 p-2 hover:bg-[#23242a]/80 duration-300 cursor-pointer hover:scale-105 hover:text-lg rounded">
									<span className="text-gray-300">{item.icon}</span>
									{item.name}
								</li>
							</Link>
						))}
					</ul>
					
					{/* Logout Section */}
					<div className="mt-8 pt-4 border-t border-gray-700">
						<h2 className="text-gray-500 text-sm font-semibold mb-2">Account</h2>
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 p-2 w-full text-left text-gray-400 font-bold hover:bg-red-900/30 duration-300 cursor-pointer hover:scale-105 hover:text-lg rounded hover:text-red-400 transition-colors">
							<span className="text-gray-300">
								<FaSignOutAlt />
							</span>
							Logout
						</button>
					</div>
				</div>
			</div>
			{/* Overlay for mobile when sidebar is open */}
			{open && (
				<div
					className="fixed inset-0 bg-black/40 z-30 md:hidden"
					onClick={() => setOpen(false)}
					aria-label="Close sidebar overlay"
				/>
			)}
			<style jsx global>{`
				@media (max-width: 768px) {
					.sidebar-mobile {
						width: 80vw !important;
						min-width: 0 !important;
						max-width: 80vw !important;
						position: fixed !important;
						left: 0;
						top: 0;
						z-index: 50;
						height: 100dvh !important;
					}
				}
			`}</style>
		</>
	);
};

export default SideBar;
