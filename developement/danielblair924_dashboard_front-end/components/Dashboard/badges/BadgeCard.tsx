"use client";

import React, { useState } from "react";
import DashboardSmallCardWrapper from "@/components/reusable/DashboardSmallCardWrapper";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { BadgeItem } from "@/service/badge/badge.service";
import { Trash2 } from "lucide-react";

interface BadgeCardProps {
  badge: BadgeItem;
  onDelete?: (id: string) => void;
  canManage?: boolean;
}

const isImageIcon = (icon?: string | StaticImageData): boolean => {
  if (!icon) return false;
  return (
    (typeof icon === "object" && icon !== null && "src" in icon) ||
    (typeof icon === "string" &&
      (icon.startsWith("/") ||
        icon.startsWith("http") ||
        icon.startsWith("blob:") ||
        icon.includes(".png") ||
        icon.includes(".jpg") ||
        icon.includes(".svg")))
  );
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onDelete, canManage = true }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isRatw =
    badge.tag?.type?.toLowerCase() === "ratw" ||
    badge.tagType?.toLowerCase() === "ratw";

  const rawIcon = badge.icon || badge.iconUrl;
  const iconSource =
    typeof rawIcon === "object" && rawIcon !== null
      ? rawIcon
      : typeof rawIcon === "string" &&
        (rawIcon.startsWith("/") ||
          rawIcon.startsWith("http") ||
          rawIcon.startsWith("blob:"))
      ? rawIcon
      : typeof rawIcon === "string" && !rawIcon.includes("/")
      ? `/image/badge/${rawIcon}`
      : "/image/badge/badge1.png";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDelete) return;
    if (confirm(`Are you sure you want to delete "${badge.title || badge.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(badge.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <DashboardSmallCardWrapper className="relative h-56 justify-start items-center gap-2.5 transition-transform hover:-translate-y-1 !rounded-xl !border-lime-800 outline-1 outline-offset-[-1px] outline-lime-800">
      {/* Action Buttons */}
      {canManage && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <Link
            href={`/dashboard/badges/edit/${badge.id}`}
            className="px-3 py-1 bg-primaryColor/10 hover:bg-primaryColor/20 border border-lime-800/80 rounded-md text-primaryColor text-xs font-semibold transition-colors"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Badge"
              className="p-1 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 rounded-md text-red-400 text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Badge Icon */}
      <div className="size-16 bg-gradient-to-b from-primaryColor to-lime-600/0 rounded-[32px] inline-flex justify-center items-center overflow-hidden mt-1">
        {isImageIcon(iconSource) ? (
          <Image
            src={iconSource}
            alt={badge.title || badge.name || "Badge"}
            width={36}
            height={36}
            className="object-contain"
            unoptimized={typeof iconSource === "string"}
          />
        ) : (
          <span className="text-center text-blackColor text-3xl font-normal leading-[48px]">
            {typeof iconSource === "string" ? iconSource : "🏆"}
          </span>
        )}
      </div>

      {/* Badge Title */}
      <h3 className="text-center text-whiteColor text-base font-bold leading-5 px-2 line-clamp-1">
        {badge.title || badge.name}
      </h3>

      {/* Tag Badge */}
      <div
        className={`px-2.5 py-[3px] rounded-[100px] outline-1 outline-offset-[-1px] flex flex-col justify-start items-center ${
          isRatw ? "outline-primaryColor" : "outline-neutral-700 bg-neutral-900/40"
        }`}
      >
        <span
          className={`text-center text-xs font-bold leading-4 ${
            isRatw ? "text-primaryColor" : "text-zinc-400"
          }`}
        >
          {badge.tag?.label || (isRatw ? "RATW" : "Event")}
        </span>
      </div>

      {/* Earned Count Description */}
      <p className="text-center text-neutral-400 text-xs font-normal leading-4 mt-auto pb-1">
        Earned by {badge.earnedCount || 0} members
      </p>
    </DashboardSmallCardWrapper>
  );
};
export default BadgeCard;
