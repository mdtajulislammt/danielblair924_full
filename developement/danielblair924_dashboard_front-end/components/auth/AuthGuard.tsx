"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CookieHelper } from "@/helper/cookie.helper";
import Loader from "@/components/reusable/Loader";

const ADMIN_ONLY_PATHS = [
  "/dashboard/submissions",
  "/dashboard/members",
  "/dashboard/settings",
  "/dashboard/badges/create",
  "/dashboard/badges/edit",
  "/dashboard/events/new",
  "/dashboard/challenges/create-challenge",
  "/dashboard/news/create",
  "/dashboard/news/edit",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const token =
      CookieHelper.get({ key: "token" }) ||
      CookieHelper.get({ key: "accessToken" });

    if (!token) {
      router.replace("/login");
      return;
    }

    const role = (
      CookieHelper.get({ key: "role" }) ||
      (typeof window !== "undefined" ? localStorage.getItem("role") : null) ||
      ""
    ).toUpperCase();

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const isRestrictedForMember =
      role === "MEMBER" &&
      (ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p)) || pathname.includes("/edite"));

    if (isRestrictedForMember) {
      router.replace("/");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#050802]">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}

