"use client";

import React, { useEffect, useState } from "react";
import { CreateBadges } from "./CreateBadges";
import { BadgeItem, BadgeService } from "@/service/badge/badge.service";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface EditBadgesProps {
  badgeId: string;
}

export const EditBadges: React.FC<EditBadgesProps> = ({ badgeId }) => {
  const [badge, setBadge] = useState<BadgeItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    BadgeService.getBadge(badgeId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setBadge(data);
        } else {
          setError("Badge not found.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load badge:", err);
        setError("Failed to load badge data.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [badgeId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[640px] h-96 flex flex-col items-center justify-center gap-3 rounded-xl border border-lime-900/40 bg-radial-[at_97%_0%] from-lime-950/20 to-stone-950">
        <Loader2 className="w-8 h-8 text-primaryColor animate-spin" />
        <span className="text-sm text-stone-400">Loading badge details...</span>
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div className="w-full max-w-[640px] p-8 text-center rounded-xl border border-red-900/40 bg-red-950/20">
        <p className="text-red-400 text-sm mb-4">{error || "Badge not found."}</p>
        <Link
          href="/dashboard/badges"
          className="inline-flex px-4 py-2 bg-primaryColor text-stone-950 text-xs font-bold rounded-lg hover:bg-lime-400 transition-colors"
        >
          Return to Badges
        </Link>
      </div>
    );
  }

  const initialData = {
    id: badge.id,
    name: badge.title || badge.name,
    description: badge.description,
    isActive: badge.isActive,
    iconUrl: badge.iconUrl || (typeof badge.icon === "string" ? badge.icon : undefined),
    icon: badge.icon,
  };

  const existingIcon = badge.iconUrl || (typeof badge.icon === "object" ? (badge.icon as any)?.src : badge.icon);

  return (
    <CreateBadges
      mode="edit"
      initialData={initialData as any}
      existingIcon={existingIcon}
    />
  );
};

export default EditBadges;
