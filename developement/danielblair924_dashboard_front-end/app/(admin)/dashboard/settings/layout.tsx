import React from "react";
import DashboardSmallCardWrapper from "@/components/reusable/DashboardSmallCardWrapper";
import SettingsNav from "@/components/Dashboard/settings/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-start items-start gap-6">
      {/* Navigation Sidebar */}
      <DashboardSmallCardWrapper className="w-full md:w-48 !p-2 !rounded-xl !justify-start !gap-0.5 outline-1 outline-offset-[-1px] outline-lime-800 !border-transparent !cursor-default">
        <SettingsNav />
      </DashboardSmallCardWrapper>

      {/* Dynamic Section Render */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
