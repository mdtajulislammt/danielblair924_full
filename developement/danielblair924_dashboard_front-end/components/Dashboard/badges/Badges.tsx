"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BadgeItem, BadgeService } from "@/service/badge/badge.service";
import { BadgeCard } from "./BadgeCard";
import Link from "next/link";
import { toast } from "react-toastify";
import { Search, AlertCircle, RefreshCw, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BadgesGridProps {
  initialBadges?: BadgeItem[];
}

export const Badges: React.FC<BadgesGridProps> = ({ initialBadges }) => {
  const { isAdmin } = useAuth();
  const [badges, setBadges] = useState<BadgeItem[]>(initialBadges || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialBadges || initialBadges.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ALL" | "EVENT" | "RATW">("ALL");

  const fetchBadges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await BadgeService.getBadges({
        search: searchQuery.trim() || undefined,
        tagType: activeTab !== "ALL" ? activeTab : undefined,
      });
      setBadges(res.data || []);
    } catch (err: any) {
      console.error("Failed to load badges:", err);
      setError("Unable to load badges from server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const handleDeleteBadge = async (id: string) => {
    try {
      await BadgeService.deleteBadge(id);
      setBadges((prev) => prev.filter((b) => b.id !== id));
      toast.success("Badge deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete badge:", err);
      toast.error(err?.response?.data?.message || "Failed to delete badge.");
    }
  };

  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      (badge.title || badge.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (badge.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const isRatw =
      badge.tag?.type?.toLowerCase() === "ratw" ||
      badge.tagType?.toLowerCase() === "ratw";

    if (activeTab === "EVENT") return matchesSearch && !isRatw;
    if (activeTab === "RATW") return matchesSearch && isRatw;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-whiteColor">
            Badges
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage achievement trophies and distance criteria for club runners.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/dashboard/badges/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primaryColor hover:bg-lime-400 px-4 transition-colors font-bold text-sm text-stone-950 shadow-[0_0_15px_rgba(161,244,0,0.3)]"
          >
            <span className="text-lg leading-none">+</span>
            <span>Create Badge</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-radial-[at_97%_0%] from-lime-950/40 to-stone-950 p-3 rounded-xl border border-lime-900/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search badges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1402] border border-lime-900/60 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-200 placeholder:text-zinc-500 focus:outline-none focus:border-primaryColor transition-colors"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          {(["ALL", "EVENT", "RATW"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-primaryColor text-stone-950 shadow-[0_0_10px_rgba(161,244,0,0.25)]"
                  : "bg-lime-950/30 text-stone-300 hover:bg-lime-900/40 border border-lime-900/40"
              }`}
            >
              {tab === "ALL" ? "All Badges" : tab === "EVENT" ? "Event Badges" : "RATW Badges"}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="w-full p-4 rounded-xl bg-red-950/30 border border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchBadges}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-800 rounded-lg text-xs font-semibold text-red-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 rounded-xl border border-lime-900/40 bg-lime-950/20 p-4 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-[32px] bg-lime-900/30 mt-2" />
              <div className="w-24 h-4 rounded bg-lime-900/30" />
              <div className="w-16 h-5 rounded-full bg-lime-900/20" />
              <div className="w-28 h-3 rounded bg-lime-900/20" />
            </div>
          ))}
        </div>
      ) : filteredBadges.length > 0 ? (
        /* Default / Success State */
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onDelete={isAdmin ? handleDeleteBadge : undefined}
              canManage={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-lime-800/60 bg-radial-[at_97%_0%] from-lime-950/20 to-stone-950 text-center">
          <div className="w-16 h-16 rounded-full bg-lime-900/20 border border-lime-800/60 flex items-center justify-center text-primaryColor mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-whiteColor">
            No Badges Found
          </h3>
          <p className="text-sm text-stone-400 max-w-sm mt-1 mb-5">
            {searchQuery
              ? `No badges matching "${searchQuery}". Try clearing your search filter.`
              : "No badges have been created yet. Get started by creating your first runner badge."}
          </p>
          <Link
            href="/dashboard/badges/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primaryColor hover:bg-lime-400 text-stone-950 text-sm font-bold transition-colors"
          >
            <span>+</span>
            <span>Create First Badge</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Badges;
