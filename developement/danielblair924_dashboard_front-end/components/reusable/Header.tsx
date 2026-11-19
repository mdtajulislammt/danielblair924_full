"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { Fetch } from "@/lib/Fetch";
import { CookieHelper } from "@/helper/cookie.helper";
import { disconnectSocket } from "@/lib/socket";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
  }>({
    name: "Admin",
    email: "admin@firstmileclub.com",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const name =
          [parsed?.fname, parsed?.lname].filter(Boolean).join(" ") ||
          parsed?.username ||
          parsed?.name ||
          "Admin";
        setUserProfile({
          name,
          email: parsed?.email || "admin@firstmileclub.com",
          avatarUrl: parsed?.avatarUrl,
        });
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = CookieHelper.get({ key: "refreshToken" });
      await Fetch.post("/auth/logout", { refreshToken }).catch(() => null);
    } catch {
      // Ignore network errors on logout
    } finally {
      CookieHelper.destroy({ key: "token" });
      CookieHelper.destroy({ key: "accessToken" });
      CookieHelper.destroy({ key: "refreshToken" });
      CookieHelper.destroy({ key: "role" });
      CookieHelper.destroy({ key: "user" });
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch {
        // Ignore storage errors
      }
      disconnectSocket();
      router.push("/login");
    }
  };

  const badgeText = unreadCount > 9 ? "9+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <nav className="text-blackColor border-b bg-[#0D1402] border-borderColor py-3.75">
      <div className="px-3 md:px-6 relative flex justify-between w-full mb-1 z-50">
        {/* Mobile menu button */}
        <div>
          <div className="xl:hidden h-full flex items-center">
            <button
              onClick={onMenuClick}
              className="pr-2 py-2 text-[#4A4C56]"
            >
              {sidebarOpen ? (
                <X className="z-50 bg-black" />
              ) : (
                <Menu className="text-primaryColor" />
              )}
            </button>
          </div>
        </div>

        {/* Notification and Profile Group */}
        <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
          <h4 className="text-2xl font-bold text-white hidden md:block w-full">
            Admin Dashboard
          </h4>
          <div className="flex items-center gap-2 lg:gap-5 justify-between">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                className="cursor-pointer relative flex justify-center items-center"
                onClick={() => setPopoverOpen(!popoverOpen)}
              >
                {badgeText && (
                  <span className="absolute -top-1.5 -right-1.5 flex justify-center items-center text-xs min-w-5 h-5 px-1 text-black font-semibold border-2 border-descriptionColor rounded-full bg-primaryColor">
                    {badgeText}
                  </span>
                )}

                <IoMdNotificationsOutline
                  className="text-descriptionColor"
                  size={26}
                />
              </PopoverTrigger>

              <PopoverContent className="w-80 md:w-[320px] mt-4 p-0 max-h-[500px] flex flex-col bg-[#0D1402] border border-lime-800 text-white shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-lime-900 sticky top-0 bg-[#0D1402] z-10">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primaryColor/20 text-primaryColor font-semibold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-primaryColor hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setPopoverOpen(false)}
                      className="text-stone-400 hover:text-white p-1 rounded-full cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto px-2 py-2 flex-1 max-h-[380px] divide-y divide-lime-900/40">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-stone-400 py-8">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!n.isRead) markAsRead(n.id);
                          if (n.data?.route) {
                            setPopoverOpen(false);
                            router.push(n.data.route);
                          }
                        }}
                        className={`p-3 rounded-lg transition-colors cursor-pointer ${
                          n.isRead
                            ? "bg-transparent hover:bg-stone-900/40 opacity-75"
                            : "bg-lime-950/30 hover:bg-lime-950/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs ${n.isRead ? "font-medium text-stone-300" : "font-bold text-white"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {n.createdAt
                              ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                              : ""}
                          </span>
                        </div>
                        {n.body && (
                          <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                            {n.body}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="relative sm:ml-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-2 h-full items-center">
                    <div
                      className="flex items-center p-1 rounded-full cursor-pointer hover:opacity-90"
                      style={{
                        boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md overflow-hidden bg-stone-800">
                        <Image
                          src={userProfile.avatarUrl || "/profile.png"}
                          alt="Admin Avatar"
                          width={40}
                          height={40}
                          className="rounded-md w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <button className="cursor-pointer">
                      <IoIosArrowDown size={16} className="text-primaryColor" />
                    </button>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 bg-[#0D1402] border border-lime-800 text-white">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {userProfile.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-lime-900" />

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/settings")}
                    className="hover:bg-lime-900/30 cursor-pointer text-xs"
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-lime-900" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-red-950/40! hover:text-red-300! flex justify-center w-full font-semibold cursor-pointer"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
