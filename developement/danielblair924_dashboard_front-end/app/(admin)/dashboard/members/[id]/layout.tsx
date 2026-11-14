import ProfileTabsContainer from "@/components/Dashboard/memberPage/ProfileTabsContainer";
import UserProfileSidebar from "@/components/Dashboard/memberPage/UserProfileSidebar";
import BackButton from "@/components/reusable/BackButton";
import React from "react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id?: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="w-full">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <aside className="lg:col-span-4 xl:col-span-3">
          <UserProfileSidebar userId={resolvedParams?.id || "1"} />
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
          <ProfileTabsContainer userId={resolvedParams?.id || "1"}>
            {children}
          </ProfileTabsContainer>
        </main>
      </div>
    </div>
  );
}
