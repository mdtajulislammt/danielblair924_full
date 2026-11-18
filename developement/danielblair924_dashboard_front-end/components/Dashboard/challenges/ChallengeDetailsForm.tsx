"use client";

import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ChallengeService } from "@/service/event/challenge.service";

export interface ChallengeDetailsFormValues {
  challengeName: string;
  type: "Community-wide" | "Individual";
  targetProgress: number;
  description: string;
  coverImage?: FileList;
}

export default function ChallengeDetailsForm() {
  const router = useRouter();
  const [challengeType, setChallengeType] = useState<
    "Community-wide" | "Individual"
  >("Community-wide");
  const [previewName, setPreviewName] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeDetailsFormValues>({
    mode: "onSubmit",
    defaultValues: {
      challengeName: "",
      type: "Community-wide",
      targetProgress: 500,
      description: "",
    },
  });

  const coverImageFiles = watch("coverImage");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewName(file.name);
      // Instant local preview
      const localBlob = URL.createObjectURL(file);
      setCoverImageUrl(localBlob);
      setIsUploadingImage(true);
      try {
        const uploadRes = await ChallengeService.uploadCoverImage(file);
        if (uploadRes?.url) {
          setCoverImageUrl(uploadRes.url);
        }
      } catch (err) {
        console.error("Challenge cover upload failed:", err);
        setCoverImageUrl("");
        toast.error("Failed to upload image. Please try again with a valid JPG/PNG/WEBP image under 5MB.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const onFormSubmit = (data: ChallengeDetailsFormValues) => {
    // Ensure blob URLs are not saved on upload failure
    const safeCoverImageUrl =
      coverImageUrl && !coverImageUrl.startsWith("blob:") ? coverImageUrl : undefined;

    const payloadToSave = {
      eventName: data.challengeName,
      title: data.challengeName,
      challengeName: data.challengeName,
      type: challengeType,
      scope: challengeType === "Community-wide" ? "COMMUNITY_WIDE" : "INDIVIDUAL",
      targetProgress: Number(data.targetProgress) || 500,
      description: data.description,
      coverImageUrl: safeCoverImageUrl,
      isChallenge: true,
    };

    localStorage.setItem(
      "pending_challenge_data",
      JSON.stringify(payloadToSave),
    );
    localStorage.setItem("pending_event_data", JSON.stringify(payloadToSave));

    router.push("/dashboard/challenges/create-challenge/step-two");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Outer Card with Ambient Glow */}
        <div className="relative overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Soft Ambient Glow (Top Right) */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
            }}
          />

          <div className="relative z-10 space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white">
                Challenge Details
              </h2>
              <p className="text-xs text-descriptionColor mt-1">
                Step 1 of 2: Challenge configuration, scope, and goal distance
              </p>
            </div>

            {/* Challenge Name */}
            <div className="space-y-2">
              <label className="text-sm block font-medium text-white/90">
                Challenge Name
              </label>
              <input
                type="text"
                placeholder="e.g. Run Around the World"
                {...register("challengeName", {
                  required: "Challenge name is required",
                })}
                style={{
                  background:
                    "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
                }}
                className={`w-full rounded-md border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-descriptionColor focus:outline-none transition-colors ${
                  errors.challengeName
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.challengeName && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.challengeName.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm block font-medium text-white/90">
                Type &amp; Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChallengeType("Community-wide")}
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition cursor-pointer text-center ${
                    challengeType === "Community-wide"
                      ? "border border-primaryColor bg-[#162507] text-primaryColor font-semibold shadow-sm shadow-[#84cc16]/20"
                      : "border border-borderColor/60 bg-[#0a0f04]/60 text-descriptionColor hover:text-white"
                  }`}
                >
                  Community-wide
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeType("Individual")}
                  className={`py-2.5 px-4 rounded-md text-sm font-medium transition cursor-pointer text-center ${
                    challengeType === "Individual"
                      ? "border border-primaryColor bg-[#162507] text-primaryColor font-semibold shadow-sm shadow-[#84cc16]/20"
                      : "border border-borderColor/60 bg-[#0a0f04]/60 text-descriptionColor hover:text-white"
                  }`}
                >
                  Individual
                </button>
              </div>
              <p className="text-xs text-descriptionColor font-normal pt-1">
                {challengeType === "Community-wide"
                  ? "All members contribute to a shared collective goal (like RATW milestones)."
                  : "Members track and complete their own individual distance targets."}
              </p>
            </div>

            {/* Target Distance (KM) */}
            <div className="space-y-2">
              <label className="text-sm block font-medium text-white/90">
                Target Distance (km)
              </label>
              <input
                type="number"
                placeholder="500"
                {...register("targetProgress", {
                  required: "Target progress is required",
                  min: { value: 1, message: "Target must be at least 1 km" },
                })}
                style={{
                  background:
                    "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
                }}
                className={`w-full rounded-md border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-descriptionColor focus:outline-none transition-colors ${
                  errors.targetProgress
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.targetProgress && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.targetProgress.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm block font-medium text-white/90">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the challenge rules, destination route, and rewards..."
                {...register("description", {
                  required: "Description is required",
                })}
                style={{
                  background:
                    "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
                }}
                className={`w-full resize-none rounded-xl border bg-[#0a0f04]/60 p-4 text-sm text-white placeholder:text-descriptionColor focus:outline-none transition-colors ${
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm block font-medium text-white/90">
                Cover Image / Banner
              </label>
              <label
                className="relative flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primaryColor p-2 sm:p-4 text-center transition hover:opacity-90 overflow-hidden"
                style={{
                  background:
                    "var(--aa, radial-gradient(62.51% 72.17% at 96.7% 0%, #365005 0%, #0A0D05 100%))",
                }}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <Loader2 className="h-6 w-6 text-primaryColor animate-spin" />
                    <span className="text-xs text-primaryColor">Uploading cover...</span>
                  </div>
                ) : coverImageUrl ? (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImageUrl}
                      alt="Challenge Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                      <Upload className="h-5 w-5 text-primaryColor" />
                      <span className="text-xs font-semibold text-white">Click or drop to replace banner</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6">
                    <Upload className="h-7 w-7 text-white/90 mb-2.5 mx-auto" />
                    <p className="text-sm text-zinc-300">
                      Drag &amp; drop or{" "}
                      <span className="font-semibold text-primaryColor">
                        browse
                      </span>
                    </p>
                    <span className="mt-1 text-xs text-descriptionColor block">
                      {previewName || "PNG, JPG up to 5MB"}
                    </span>
                  </div>
                )}
              </label>
              {coverImageUrl && (
                <div className="flex items-center justify-between text-[11px] text-primaryColor font-medium">
                  <span>✔ Cover banner ready</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageUrl("");
                      setPreviewName("");
                    }}
                    className="text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Remove banner
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full rounded-md bg-primaryColor py-3.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#84cc16]/20 flex items-center justify-center gap-2"
              >
                <span>Next: Set Requirements</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
