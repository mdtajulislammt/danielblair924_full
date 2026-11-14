"use client";

import { Toggle } from "@/components/reusable/Toggle";
import { Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventService } from "@/service/event/event.service";
import { ChallengeService } from "@/service/event/challenge.service";
import { CustomToast } from "@/lib/Toast/CustomToast";

interface RequirementsFormValues {
  completeDistance: boolean;
  uploadRunningEvidence: boolean;
  postOnTikTok: boolean;
  tiktokCaptionInstructions: string;
  tagFirstMileClub: boolean;
  tagCollaboratingPage: boolean;
  collaboratingPageName: string;
  useSpecificHashtag: boolean;
  specificHashtag: string;
}

export default function EventRequirementsForm({
  onBack,
  onPublishSuccess,
}: {
  onBack?: () => void;
  onPublishSuccess?: () => void;
}) {
  const router = useRouter();
  const [eventName, setEventName] = useState("New Event");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [requirements, setRequirements] = useState<RequirementsFormValues>({
    completeDistance: true,
    uploadRunningEvidence: true,
    postOnTikTok: true,
    tiktokCaptionInstructions: "",
    tagFirstMileClub: true,
    tagCollaboratingPage: false,
    collaboratingPageName: "",
    useSpecificHashtag: true,
    specificHashtag: "",
  });

  useEffect(() => {
    const savedData =
      localStorage.getItem("pending_challenge_data") ||
      localStorage.getItem("pending_event_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed?.challengeName || parsed?.eventName || parsed?.title) {
          setEventName(parsed.challengeName || parsed.eventName || parsed.title);
        }
        if (parsed?.requirements) {
          setRequirements((prev) => ({
            ...prev,
            ...parsed.requirements,
          }));
        }
      } catch (err) {
        console.error("Failed to parse data from localStorage", err);
      }
    }
  }, []);

  const handleToggle = (key: keyof RequirementsFormValues) => {
    setRequirements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (
    key: keyof RequirementsFormValues,
    val: string
  ) => {
    setRequirements((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveAndPublish = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const savedData =
        localStorage.getItem("pending_challenge_data") ||
        localStorage.getItem("pending_event_data");
      const baseData = savedData ? JSON.parse(savedData) : {};

      const fullPayload = {
        ...baseData,
        requirements: {
          completeDistance: requirements.completeDistance,
          uploadRunningEvidence: requirements.uploadRunningEvidence,
          postOnTikTok: requirements.postOnTikTok,
          tiktokCaptionInstructions: requirements.tiktokCaptionInstructions || undefined,
          tagFirstMileClub: requirements.tagFirstMileClub,
          tagCollaboratingPage: requirements.tagCollaboratingPage,
          collaboratingPageName: requirements.collaboratingPageName || undefined,
          useSpecificHashtag: requirements.useSpecificHashtag,
          specificHashtag: requirements.specificHashtag || undefined,
        },
      };

      if (baseData.isChallenge) {
        // CHALLENGE API CALL
        if (baseData.challengeId && baseData.challengeId !== "new") {
          await ChallengeService.updateChallenge(baseData.challengeId, fullPayload);
          CustomToast.show("Challenge successfully updated!");
        } else {
          await ChallengeService.createChallenge({
            title: baseData.challengeName || baseData.title || "Run Around the World",
            challengeName: baseData.challengeName || baseData.title,
            description: baseData.description || "Community Running Challenge",
            type: baseData.type || "Community-wide",
            coverImageUrl: baseData.coverImageUrl,
            targetProgress: baseData.targetProgress ? Number(baseData.targetProgress) : 500,
            requirements: fullPayload.requirements,
          });
          CustomToast.show("Challenge successfully created & published!");
        }

        localStorage.removeItem("pending_challenge_data");
        localStorage.removeItem("pending_event_data");

        if (onPublishSuccess) {
          onPublishSuccess();
        } else {
          router.push("/dashboard/challenges");
        }
      } else {
        // EVENT API CALL
        if (baseData.eventId && baseData.eventId !== "new") {
          await EventService.updateEvent(baseData.eventId, fullPayload);
          CustomToast.show("Event successfully updated!");
        } else {
          await EventService.createEvent({
            title: baseData.eventName || baseData.title || "First Mile Club Event",
            eventName: baseData.eventName || baseData.title,
            description: baseData.description || "First Mile Club Event",
            eventDate: baseData.eventDate,
            distanceType: baseData.distanceType || "10K",
            coverImageUrl: baseData.coverImageUrl,
            requirements: fullPayload.requirements,
          });
          CustomToast.show("Event successfully created & published!");
        }

        localStorage.removeItem("pending_event_data");
        localStorage.removeItem("pending_challenge_data");

        if (onPublishSuccess) {
          onPublishSuccess();
        } else {
          router.push("/dashboard/events");
        }
      }
    } catch (error: any) {
      console.error("Publishing error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save and publish. Please check backend connection.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-wide text-white">
          Event Requirements
        </h2>
        <p className="text-sm text-descriptionColor font-normal">
          Set the criteria members must meet to verify participation for:{" "}
          <span className="text-primaryColor font-medium">{eventName}</span>
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/30 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-4">
        {/* 1. Complete Distance (Locked Mandatory) */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Complete Distance
            </h4>
            <p className="text-sm text-descriptionColor font-normal">
              Member must complete the required distance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1b260c] border border-borderColor px-2.5 py-1 text-[11px] font-semibold text-primaryColor">
              <Lock className="h-3 w-3" /> Mandatory
            </span>
          </div>
        </div>

        {/* 2. Upload Running Evidence */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Upload Running Evidence
            </h4>
            <p className="text-sm text-descriptionColor font-normal">
              Strava link, smartwatch screenshot, or GPS activity data.
            </p>
          </div>
          <Toggle
            checked={requirements.uploadRunningEvidence}
            onChange={() => handleToggle("uploadRunningEvidence")}
          />
        </div>

        {/* 3. Post on TikTok */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Post on TikTok</h4>
              <p className="text-sm text-descriptionColor font-normal">
                Member posts run video on TikTok.
              </p>
            </div>
            <Toggle
              checked={requirements.postOnTikTok}
              onChange={() => handleToggle("postOnTikTok")}
            />
          </div>
          {requirements.postOnTikTok && (
            <textarea
              rows={2}
              value={requirements.tiktokCaptionInstructions}
              onChange={(e) =>
                handleInputChange("tiktokCaptionInstructions", e.target.value)
              }
              placeholder="Provide instructions for video content or caption..."
              className="w-full resize-none rounded-md border border-borderColor bg-[#050802] p-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#84cc16] focus:outline-none transition-colors"
            />
          )}
        </div>

        {/* 4. Tag First Mile Club */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Tag First Mile Club
            </h4>
            <p className="text-sm text-descriptionColor font-normal">
              Member must tag @firstmileclub in their social post.
            </p>
          </div>
          <Toggle
            checked={requirements.tagFirstMileClub}
            onChange={() => handleToggle("tagFirstMileClub")}
          />
        </div>

        {/* 5. Tag Collaborating Page */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Tag Collaborating Page
              </h4>
              <p className="text-sm text-descriptionColor font-normal">
                Tag a sponsor, brand, or collaborating partner page.
              </p>
            </div>
            <Toggle
              checked={requirements.tagCollaboratingPage}
              onChange={() => handleToggle("tagCollaboratingPage")}
            />
          </div>
          {requirements.tagCollaboratingPage && (
            <input
              type="text"
              value={requirements.collaboratingPageName}
              onChange={(e) =>
                handleInputChange("collaboratingPageName", e.target.value)
              }
              placeholder="@brandname or sponsor handle"
              className="w-full rounded-md border border-borderColor bg-[#050802] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primaryColor focus:outline-none transition-colors"
            />
          )}
        </div>

        {/* 6. Use Specific Hashtag */}
        <div
          style={{
            background:
              "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
          }}
          className="rounded-2xl border border-borderColor p-5 shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Use Specific Hashtag
              </h4>
              <p className="text-sm text-descriptionColor font-normal">
                Member uses a required campaign hashtag.
              </p>
            </div>
            <Toggle
              checked={requirements.useSpecificHashtag}
              onChange={() => handleToggle("useSpecificHashtag")}
            />
          </div>
          {requirements.useSpecificHashtag && (
            <input
              type="text"
              value={requirements.specificHashtag}
              onChange={(e) =>
                handleInputChange("specificHashtag", e.target.value)
              }
              placeholder="#FirstMileClub #RATW2026"
              className="w-full rounded-md border border-borderColor bg-[#050802] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#84cc16] focus:outline-none transition-colors"
            />
          )}
        </div>
      </div>

      {/* Save & Publish Action */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSaveAndPublish}
          className="w-full rounded-xl bg-primaryColor py-3.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#84cc16]/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Publishing Event...</span>
            </>
          ) : (
            <span>Save &amp; Publish</span>
          )}
        </button>
      </div>
    </div>
  );
}
