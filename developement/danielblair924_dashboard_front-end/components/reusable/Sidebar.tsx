"use client";

import { CookieHelper } from "@/helper/cookie.helper";
import {
  BadgeIcon,
  ChallengeIcon,
  EventIcon,
  MemberIcon,
  NewIcon,
  SettingIcon,
  SubmissionIcon,
} from "@/public/demoData/Icons";
import mainLogo from "@/public/image/mainLogo.png";
import emptyImg from "@/public/profile.png";
import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface NavItem {
  icon: any;
  label: string;
  href: string;
  allowedRoles?: ("SUPERADMIN" | "ADMIN" | "MEMBER")[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    href: "/",
    allowedRoles: ["SUPERADMIN", "ADMIN", "MEMBER"],
  },
  {
    icon: MemberIcon,
    label: "Members",
    href: "/dashboard/members",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    icon: SubmissionIcon,
    label: "Submissions",
    href: "/dashboard/submissions",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    icon: EventIcon,
    label: "Events",
    href: "/dashboard/events",
    allowedRoles: ["SUPERADMIN", "ADMIN", "MEMBER"],
  },
  {
    icon: ChallengeIcon,
    label: "Challenges",
    href: "/dashboard/challenges",
    allowedRoles: ["SUPERADMIN", "ADMIN", "MEMBER"],
  },
  {
    icon: BadgeIcon,
    label: "Badges",
    href: "/dashboard/badges",
    allowedRoles: ["SUPERADMIN", "ADMIN", "MEMBER"],
  },
  {
    icon: NewIcon,
    label: "News",
    href: "/dashboard/news",
    allowedRoles: ["SUPERADMIN", "ADMIN", "MEMBER"],
  },
  {
    icon: SettingIcon,
    label: "Settings",
    href: "/dashboard/settings",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>("SUPERADMIN");
  const [userName, setUserName] = useState<string>("Admin User");
  const [userRoleLabel, setUserRoleLabel] = useState<string>("Super Admin");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cookieRole = CookieHelper.get({ key: "role" });
      const localRole =
        typeof window !== "undefined" ? localStorage.getItem("role") : null;
      const activeRole = (cookieRole || localRole || "SUPERADMIN").toUpperCase();
      setUserRole(activeRole);

      let label = "Super Admin";
      if (activeRole === "ADMIN") label = "Club Admin";
      if (activeRole === "MEMBER") label = "Club Runner";
      setUserRoleLabel(label);

      const rawUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (rawUser) {
        const u = JSON.parse(rawUser);
        const name = u.fname
          ? `${u.fname} ${u.lname || ""}`.trim()
          : u.name || (activeRole === "MEMBER" ? "Demo Runner" : "Admin User");
        setUserName(name);
        if (u.avatarUrl) setAvatarUrl(u.avatarUrl);
      } else {
        setUserName(activeRole === "MEMBER" ? "Demo Runner" : "Admin User");
      }
    } catch (e) {
      console.error("Failed to load user info in sidebar:", e);
    }
  }, []);

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    CookieHelper.destroy({ key: "token" });
    CookieHelper.destroy({ key: "accessToken" });
    CookieHelper.destroy({ key: "role" });
    CookieHelper.destroy({ key: "user" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const visibleNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole as any);
  });

  return (
    <div className="h-screen">
      {/* Sidebar container */}
      <div
        className={`
          ${
            isOpen
              ? "z-50 h-full w-full overflow-hidden absolute top-0 left-0"
              : "h-full"
          }
          flex flex-col
          min-h-[calc(100vh-100px)] 
          w-full
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
          p-3 lg:p-4 overflow-y-auto transition-all duration-300
        `}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between pb-4 md:pb-5 border-b border-primaryColor">
          <Link
            href={"/"}
            className={`flex items-center justify-center w-full transition-all duration-300`}
          >
            <Image
              src={mainLogo}
              alt="Main Logo"
              width={200}
              height={100}
              className="w-36 h-auto"
            />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 pt-4 md:pt-7">
          <div className="space-y-2">
            {visibleNavItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center group gap-3 px-3 py-2.5 lg:py-3 rounded-xl 
                    hover:text-primaryColor border-l-3 hover:border-primaryColor hover:bg-primaryColor/8 transition-all duration-200
                    ${
                      active
                        ? "bg-primaryColor/8 border-primaryColor opacity-100 text-primaryColor"
                        : "border-transparent"
                    }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-[30px] h-[30px] group flex justify-center items-center flex-shrink-0 text-xl font-medium">
                      <item.icon
                        className={`group-hover:text-primaryColor transition-opacity duration-200 ${
                          active
                            ? "opacity-100 text-primaryColor"
                            : "text-white/90"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-base font-medium transition-colors duration-200 whitespace-nowrap ${
                        active
                          ? "text-primaryColor"
                          : "text-descriptionColor group-hover:text-primaryColor"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Log out & Profile section */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`
              flex items-center justify-between hover:bg-primaryColor/8 backdrop-blur-sm border border-transparent hover:border-primaryColor/10 hover:text-whiteColor cursor-pointer gap-3 px-3 py-3 
              w-full rounded-lg transition-all duration-200
            `}
            title="Log Out Account"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-[40px] h-[40px] flex justify-center items-center flex-shrink-0">
                <Image
                  src={avatarUrl || emptyImg}
                  alt="Profile"
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full overflow-hidden object-cover border border-primaryColor/30"
                />
              </div>
              <div className="text-left overflow-hidden">
                <h4
                  className="text-sm font-semibold text-descriptionColor whitespace-nowrap truncate max-w-[120px]"
                >
                  {userName}
                </h4>
                <span
                  className="text-xs font-normal text-descriptionColor/80 whitespace-nowrap block"
                >
                  {userRoleLabel}
                </span>
              </div>
            </div>
            <LogOutIcon className="text-descriptionColor shrink-0 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
