"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface TabItem {
  name: string;
  href: string;
}

interface ProfileTabsContainerProps {
  children: React.ReactNode;
  userId?: string;
}

export default function ProfileTabsContainer({
  children,
  userId = "1",
}: ProfileTabsContainerProps) {
  const pathname = usePathname();

  const basePath = `/dashboard/members/${userId}`;

  const tabs: TabItem[] = [
    { name: "Activity", href: basePath },
    { name: "Submissions", href: `${basePath}/submissions` },
    { name: "Badges", href: `${basePath}/badges` },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border backdrop-blur-2xl  border-borderColor  ">
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-6 border-b border-borderColor py-4 px-6 pb-3 text-base font-medium">
          {tabs.map((tab) => {
            const isActive =
              tab.name === "Activity"
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative  transition-colors ${
                  isActive
                    ? "text-primaryColor font-semibold"
                    : "text-descriptionColor hover:text-white"
                }`}
              >
                {tab.name}
                {isActive && (
                  <span className="absolute bottom-[-13px] left-0 h-[2px] w-full rounded-full bg-primaryColor" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Dynamic Nested Route Data Table */}
        <div className=" flex-1">{children}</div>
      </div>
    </div>
  );
}
