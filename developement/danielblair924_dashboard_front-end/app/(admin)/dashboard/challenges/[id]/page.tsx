"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NeonWorldMap from "@/components/Dashboard/Submission/NeonWorldMap";
import DashboardSmallCardWrapper from "@/components/reusable/DashboardSmallCardWrapper";
import { ChallengeItem, ChallengeService, MilestoneDestination } from "@/service/event/challenge.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengeOverviewPage() {
  const params = useParams();
  const challengeId = params?.id as string;

  const [challenge, setChallenge] = useState<ChallengeItem | null>(null);
  const [destinations, setDestinations] = useState<MilestoneDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!challengeId) return;

    setIsLoading(true);
    Promise.allSettled([
      ChallengeService.getChallengeById(challengeId),
      ChallengeService.getDestinations(challengeId),
    ])
      .then(([challengeRes, destRes]) => {
        if (challengeRes.status === "fulfilled" && challengeRes.value) {
          const item = (challengeRes.value as any)?.data || challengeRes.value;
          if (item) setChallenge(item);
        }
        if (destRes.status === "fulfilled" && destRes.value) {
          const res = destRes.value;
          const list = Array.isArray(res) ? res : (res as any)?.data?.destinations ?? (res as any)?.destinations ?? [];
          if (Array.isArray(list)) setDestinations(list);
        }
      })
      .catch((err) => {
        console.warn("Failed to load challenge overview:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [challengeId]);

  // Determine current destination from milestones
  const currentDest =
    destinations.find((d) => d.status === "Current")?.destination ||
    destinations.filter((d) => d.status === "Unlocked").pop()?.destination ||
    "India (500 km)";

  const totalProgressDisplay = challenge
    ? `${challenge.currentProgress || 0} ${challenge.progressUnit || "km"}`
    : "342 km";

  const targetProgressDisplay = challenge?.targetProgress
    ? ` / ${challenge.targetProgress} km`
    : " / 500 km";

  const contributorsDisplay = String(
    challenge?.participantsCount || challenge?.submissionsCount || "1,000+"
  );

  const overViewData = [
    {
      title: "Total Progress",
      value: `${totalProgressDisplay}${targetProgressDisplay}`,
    },
    {
      title: "Contributors",
      value: contributorsDisplay,
    },
    {
      title: "Current Destination",
      value: currentDest,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Challenge Cover Banner if available */}
      {challenge?.coverImageUrl && (
        <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-borderColor bg-[#070a03] shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={challenge.coverImageUrl}
            alt={challenge.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a03] via-transparent to-black/40" />
          <div className="absolute bottom-4 left-4 z-10 space-y-1">
            <span className="px-3 py-1 bg-primaryColor text-black font-bold text-xs rounded-full shadow-md">
              {challenge.scope === "COMMUNITY_WIDE" ? "Community Challenge" : "Individual Challenge"}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
              {challenge.title}
            </h2>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full bg-zinc-800/40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid-cols-1 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overViewData.map((item, index) => (
            <DashboardSmallCardWrapper key={index}>
              <div className="relative space-y-2 z-10">
                <p className="text-xs text-descriptionColor font-medium tracking-wide uppercase">
                  {item.title}
                </p>

                <div
                  className={`text-2xl md:text-3xl font-bold ${
                    index === 0 ? "text-primaryColor" : "text-whiteColor"
                  } tracking-tight`}
                >
                  {item.value}
                </div>
              </div>
            </DashboardSmallCardWrapper>
          ))}
        </div>
      )}

      {/* Interactive Neon Map */}
      <div>
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-white/90">
            RATW Global Route &amp; Flight Path
          </h3>
          <p className="text-xs text-descriptionColor">
            Live interactive telemetry of collective club mileage traversing milestones
          </p>
        </div>
        <NeonWorldMap />
      </div>
    </div>
  );
}
