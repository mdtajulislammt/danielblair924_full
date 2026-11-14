import React from "react";
import Link from "next/link";
import { EditBadges } from "@/components/Dashboard/badges/EditBadges";
import BackButton from "@/components/reusable/BackButton";

interface EditBadgePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBadgePage({ params }: EditBadgePageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="justify-start text-whiteColor text-2xl font-semibold leading-7">
          Edit Badge
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <EditBadges badgeId={id} />
      </div>
    </div>
  );
}
