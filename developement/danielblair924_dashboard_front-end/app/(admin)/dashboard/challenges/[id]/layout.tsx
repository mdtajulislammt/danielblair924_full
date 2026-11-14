import ChallengeTabsNav from "@/components/Dashboard/challenges/ChallengeTabsNav";
import BackButton from "@/components/reusable/BackButton";
import React from "react";

async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id?: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="rounded-xl border border-borderColor backdrop-blur-sm">
        <ChallengeTabsNav id={resolvedParams?.id} />
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default layout;
