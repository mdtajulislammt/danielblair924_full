import React, { ReactNode } from "react";

interface DashboardCardWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCardWrapper({
  children,
  className = "",

}: DashboardCardWrapperProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-borderColor h-full backdrop-blur-2xl bg-[#0A0D05] p-6 shadow-xl shadow-black/60 ${className}`}
    >
      {/* Corner Green Ambient Glow */}
      <div
        className="pointer-events-none absolute -right-46 -top-5 h-70 -rotate-30 w-150 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #365005  0%, #34500c 25%, transparent 65%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}