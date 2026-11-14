"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import settingsData from "@/components/Dashboard/settings/settingsData.json";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (id: string) => {
    const route =
      id === "admin-account"
        ? "/dashboard/settings"
        : `/dashboard/settings/${id}`;
    router.push(route);
  };

  return (
    <>
      {settingsData.navigation.map((nav) => {
        const targetPath =
          nav.id === "admin-account"
            ? "/dashboard/settings"
            : `/dashboard/settings/${nav.id}`;
        const isActive = pathname === targetPath;
        return (
          <button
            key={nav.id}
            type="button"
            onClick={() => handleTabChange(nav.id)}
            className={`w-full h-10 px-3.5 rounded-lg flex items-center justify-start text-sm  cursor-pointer transition-all ${
              isActive
                ? "bg-primaryColor/10 outline-1 outline-offset-[-1px] outline-primaryColor text-primaryColor font-bold"
                : "text-stone-300 font-medium hover:bg-stone-900/50"
            }`}
          >
            {nav.label}
          </button>
        );
      })}
    </>
  );
};

export default SettingsNav;
