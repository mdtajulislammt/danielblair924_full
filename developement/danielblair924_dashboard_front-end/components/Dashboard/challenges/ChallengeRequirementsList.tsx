"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChallengeItem, ChallengeService } from "@/service/event/challenge.service";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChallengeRequirement {
  id: number;
  title: string;
  isTrue: boolean;
  isRequired?: boolean;
}

export const CHALLENGE_REQUIREMENTS_DATA: ChallengeRequirement[] = [
  {
    id: 1,
    title: "Complete Distance",
    isTrue: true,
    isRequired: true,
  },
  {
    id: 2,
    title: "Upload Running Evidence (Strava/GPX)",
    isTrue: true,
  },
  {
    id: 3,
    title: "Post on TikTok",
    isTrue: false,
  },
  {
    id: 4,
    title: "Tag First Mile Club",
    isTrue: true,
  },
  {
    id: 5,
    title: "Use Specific Hashtag (#RATW2026)",
    isTrue: true,
  },
];

export default function ChallengeRequirementsList() {
  const params = useParams();
  const challengeId = params?.id as string;
  const [items, setItems] = useState<ChallengeRequirement[]>(CHALLENGE_REQUIREMENTS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!challengeId) return;
    setIsLoading(true);
    ChallengeService.getChallengeById(challengeId)
      .then((res) => {
        const challenge: ChallengeItem = (res as any)?.data || res;
        if (challenge?.requirements) {
          const req = challenge.requirements;
          const dynamicList: ChallengeRequirement[] = [
            {
              id: 1,
              title: "Complete Distance",
              isTrue: req.completeDistance ?? true,
              isRequired: true,
            },
            {
              id: 2,
              title: "Upload Running Evidence (Strava/GPX)",
              isTrue: req.uploadRunningEvidence ?? true,
            },
            {
              id: 3,
              title: req.tiktokCaptionInstructions
                ? `Post on TikTok (${req.tiktokCaptionInstructions})`
                : "Post on TikTok",
              isTrue: req.postOnTikTok ?? false,
            },
            {
              id: 4,
              title: req.collaboratingPageName
                ? `Tag First Mile Club & ${req.collaboratingPageName}`
                : "Tag First Mile Club",
              isTrue: req.tagFirstMileClub ?? true,
            },
            {
              id: 5,
              title: req.specificHashtag
                ? `Use Specific Hashtag (${req.specificHashtag})`
                : "Use Specific Hashtag (#RATW2026)",
              isTrue: req.useSpecificHashtag ?? true,
            },
          ];
          setItems(dynamicList);
        }
      })
      .catch((err) => {
        console.warn("Failed to load challenge requirements:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [challengeId]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-full bg-zinc-800/40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 flex flex-col">
        {/* Requirements List Rows */}
        <div className="divide-y divide-borderColor">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-6 py-4.5 transition-colors hover:bg-bgColor/40"
            >
              {/* Tick Icon or Empty Circle based on isTrue */}
              {item.isTrue ? (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primaryColor text-black shadow-xs shadow-[#84cc16]/30">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full bg-bgColor border border-borderColor" />
              )}

              {/* Title */}
              <span
                className={`text-sm font-semibold tracking-wide ${
                  item.isTrue ? "text-white" : "text-descriptionColor font-medium"
                }`}
              >
                {item.title}
              </span>

              {/* Required Badge if applicable */}
              {item.isRequired && (
                <span className="rounded-full bg-bgColor border border-borderColor px-2.5 py-0.5 text-[12px] font-medium text-descriptionColor select-none">
                  Required
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Edit Requirements Action Button */}
        <div className="p-6">
          <Link
            href={`/dashboard/challenges/create-challenge/step-two`}
            className="inline-flex items-center justify-center rounded-lg border border-borderColor bg-bgColor px-4 py-2 text-sm font-medium text-white transition hover:bg-[#84cc16]/10 cursor-pointer"
          >
            Edit Requirements
          </Link>
        </div>
      </div>
    </div>
  );
}
