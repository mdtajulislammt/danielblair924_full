"use client";

import Header from "@/components/reusable/Header";
import Sidebar from "@/components/reusable/Sidebar";
import gradiantColor from "@/public/image/dashboard/Ellipse 17.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
function AdminMenu({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathName = usePathname();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[#050802]">
      <div className="relative flex h-full">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-screen z-30 bg-bgColor border-r border-borderColor
            transition-transform duration-300 ease-in-out w-[300px]
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            xl:static xl:translate-x-0
          `}
        >
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs xl:hidden z-20"
            onClick={closeSidebar}
          />
        )}

        <div className="flex-1 w-full h-full flex flex-col min-h-0">
          <div className="w-full sticky top-0 left-0 z-10">
            <Header sidebarOpen={sidebarOpen} onMenuClick={toggleSidebar} />
          </div>

          {/* Main content area */}
          {/* Main content area */}
          <main className="flex-1 relative overflow-y-auto overflow-x-hidden text-whiteColor p-4 md:p-6 bg-[#070b02]">
            {pathName !== "/" && (
              <Image
                src={gradiantColor}
                alt="Gradient Background"
                className="absolute -top-[38%] -right-[22%]"
              />
            )}
            <div className="relative z-10">{children}</div>

            <ToastContainer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;
