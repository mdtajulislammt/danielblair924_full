"use client";

import React from "react";
import Link from "next/link";
import NewsTable from "@/components/Dashboard/news/NewsTable";
import { useAuth } from "@/hooks/useAuth";

export default function NewsPage() {
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold leading-7 text-whiteColor">
          News
        </h2>

        {isAdmin && (
          <Link
            href="/dashboard/news/create"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primaryColor px-4 hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(161,244,0,0.3)]"
          >
            <span className="text-lg font-bold leading-4 text-blackColor">+</span>
            <span className="text-sm font-bold leading-5 text-blackColor">
              New Post
            </span>
          </Link>
        )}
      </div>
      <NewsTable />
    </div>
  );
}
