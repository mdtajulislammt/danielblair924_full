"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TiPlus } from "react-icons/ti";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import ch1 from "@/public/image/challenge/ch1.png";
import ch2 from "@/public/image/challenge/ch2.png";
import ch3 from "@/public/image/challenge/ch3.png";
import { ChallengeItem, ChallengeService } from "@/service/event/challenge.service";
import { CHALLENGES_DATA } from "@/public/demoData/DemoData";
import { useAuth } from "@/hooks/useAuth";

const defaultChallengeImages = [ch1, ch2, ch3];

export default function ChallengePage() {
  const { isAdmin } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<string>("ALL");

  const fetchChallenges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ChallengeService.getChallenges();
      const items: ChallengeItem[] =
        response?.data?.items || response?.items || response || [];
      setChallenges(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error("Backend challenges fetch error:", err?.message);
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchScope =
        scopeFilter === "ALL" ||
        (scopeFilter === "COMMUNITY_WIDE" && (c.scope === "COMMUNITY_WIDE" || c.type === "Community-wide")) ||
        (scopeFilter === "INDIVIDUAL" && (c.scope === "INDIVIDUAL" || c.type === "Individual"));

      return matchSearch && matchScope;
    });
  }, [challenges, searchQuery, scopeFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 items-start sm:flex-row justify-between sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Challenges (RATW)
          </h2>
          <p className="text-xs text-descriptionColor mt-0.5">
            Run Around the World community milestones, destination targets &amp; progress
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-descriptionColor h-4 w-4" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-borderColor bg-[#0a0f04]/80 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-primaryColor focus:outline-none transition-colors"
            />
          </div>

          {isAdmin && (
            <Link
              href="/dashboard/challenges/create-challenge"
              className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-primaryColor rounded-lg text-black font-bold text-sm hover:opacity-90 transition shadow-md shadow-primaryColor/20 shrink-0"
            >
              <TiPlus className="text-lg" /> Create Challenge
            </Link>
          )}
        </div>
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: "All Challenges", value: "ALL" },
          { label: "Community-wide", value: "COMMUNITY_WIDE" },
          { label: "Individual", value: "INDIVIDUAL" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setScopeFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              scopeFilter === tab.value
                ? "bg-primaryColor/20 text-primaryColor border border-primaryColor/40"
                : "bg-bgColor/60 text-descriptionColor border border-borderColor hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] p-4 space-y-4 h-72"
            >
              <Skeleton className="h-40 w-full rounded-xl bg-zinc-800/40" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-zinc-800/50" />
                <Skeleton className="h-4 w-full bg-zinc-800/40" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center space-y-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchChallenges}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primaryColor/20 text-primaryColor text-xs font-bold hover:bg-primaryColor/30 cursor-pointer"
          >
            <FiRefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="rounded-2xl border border-borderColor bg-[#070a03]/80 p-12 text-center space-y-4">
          <p className="text-base font-semibold text-white">No challenges found</p>
          <p className="text-xs text-descriptionColor max-w-sm mx-auto">
            {searchQuery
              ? `No challenges match "${searchQuery}".`
              : "No challenges currently active. Launch a new community or individual challenge!"}
          </p>
          {isAdmin && (
            <Link
              href="/dashboard/challenges/create-challenge"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primaryColor text-black font-bold text-xs hover:opacity-90 transition"
            >
              <TiPlus className="text-base" /> Create First Challenge
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((item, index) => {
            const hasProgress = typeof item.targetProgress === "number" && item.targetProgress > 0;
            const progressPercent = hasProgress
              ? Math.min(100, Math.max(0, ((item.currentProgress || 0) / item.targetProgress) * 100))
              : 0;

            const statusLower = (item.status || "ACTIVE").toLowerCase();
            const rawCover = item.coverImageUrl;
            const displayImg =
              rawCover &&
              (rawCover.startsWith("http") ||
                rawCover.startsWith("/") ||
                rawCover.startsWith("blob:"))
                ? rawCover
                : defaultChallengeImages[index % defaultChallengeImages.length];

            return (
              <Link
                key={item.id}
                href={`/dashboard/challenges/${item.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] min-h-[320px] transition hover:border-primaryColor/50 shadow-xl"
              >
                {/* Card Background Image */}
                <div className="relative h-44 w-full overflow-hidden bg-black/40">
                  <Image
                    src={displayImg}
                    alt={item.title}
                    fill
                    unoptimized={typeof displayImg === "string"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a03] via-transparent to-black/60" />
                </div>

                {/* Top Bar: Scope Badge & Status Badge */}
                <div className="absolute top-0 left-0 w-full p-4 z-10 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-black/60 border border-borderColor/60 px-3 py-1 text-[11px] font-semibold text-primaryColor backdrop-blur-md">
                    {item.scope === "COMMUNITY_WIDE" || item.type === "Community-wide"
                      ? "Community-wide"
                      : "Individual"}
                  </span>

                  {statusLower === "active" && (
                    <span className="inline-flex items-center rounded-full bg-primaryColor px-3 py-1 text-[11px] font-bold text-black shadow-md shadow-primaryColor/25">
                      Active
                    </span>
                  )}
                  {statusLower === "ended" && (
                    <span className="inline-flex items-center rounded-full bg-red-950/60 border border-red-800/40 px-3 py-1 text-[11px] font-medium text-red-300 backdrop-blur-md">
                      Ended
                    </span>
                  )}
                  {statusLower === "draft" && (
                    <span className="inline-flex items-center rounded-full bg-zinc-800/80 border border-zinc-700 px-3 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
                      Draft
                    </span>
                  )}
                  {statusLower === "published" && (
                    <span className="inline-flex items-center rounded-full bg-primaryColor px-3 py-1 text-[11px] font-bold text-black shadow-md shadow-primaryColor/25">
                      Published
                    </span>
                  )}
                </div>

                {/* Bottom Content Area */}
                <div className="p-4 z-10 space-y-3 bg-[#070a03]/95 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-primaryColor transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-descriptionColor line-clamp-1 mt-0.5">
                      {item.description || "Community Running Challenge"}
                    </p>
                  </div>

                  {hasProgress ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-descriptionColor font-medium">Progress</span>
                        <span className="font-semibold text-primaryColor">
                          {item.currentProgress || 0}/{item.targetProgress} {item.progressUnit || "km"}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#1b260c]">
                        <div
                          className="h-full rounded-full bg-primaryColor transition-all duration-500 shadow-sm shadow-[#84cc16]/50"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-descriptionColor font-medium pt-0.5">
                      Individual distance challenge
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
