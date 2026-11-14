import React from "react";
import Link from "next/link";
import { CreateBadges } from "@/components/Dashboard/badges/CreateBadges";
import BackButton from "@/components/reusable/BackButton";

export default function CreateBadgesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <h2 className="justify-start text-whiteColor text-2xl font-semibold leading-7">
          Create Badge
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <CreateBadges mode="create" />
      </div>
    </div>
  );
}
