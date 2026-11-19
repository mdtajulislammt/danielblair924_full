"use client";

import { Upload, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { EventService } from "@/service/event/event.service";

export interface EventDetailsFormValues {
  eventName: string;
  description: string;
  eventDate: string;
  distanceType: string;
  coverImage?: FileList;
}

export default function EventDetailsForm() {
  const [previewName, setPreviewName] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const isEditing = eventId && eventId !== "new";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventDetailsFormValues>({
    mode: "onSubmit",
    defaultValues: {
      eventName: "",
      description: "",
      eventDate: "",
      distanceType: "",
    },
  });

  const coverImageFiles = watch("coverImage");

  // Load existing event data when editing
  useEffect(() => {
    if (isEditing) {
      setIsLoadingExisting(true);
      EventService.getEventById(eventId)
        .then((res) => {
          const evt = (res as any)?.data || res;
          if (evt) {
            setValue("eventName", evt.title || evt.eventName || "");
            setValue("description", evt.description || "");
            setValue(
              "eventDate",
              evt.eventDate
                ? new Date(evt.eventDate).toISOString().split("T")[0]
                : ""
            );
            setValue("distanceType", evt.distanceType || "");
            if (evt.coverImageUrl) {
              setCoverImageUrl(evt.coverImageUrl);
              setPreviewName("Current cover image loaded");
            }
          }
        })
        .catch((err) => {
          console.warn("Failed to load existing event:", err?.message);
        })
        .finally(() => {
          setIsLoadingExisting(false);
        });
    } else {
      // Check if there was pending draft in localStorage
      const cached = localStorage.getItem("pending_event_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.eventName) setValue("eventName", parsed.eventName);
          if (parsed.description) setValue("description", parsed.description);
          if (parsed.eventDate) setValue("eventDate", parsed.eventDate);
          if (parsed.distanceType) setValue("distanceType", parsed.distanceType);
          if (parsed.coverImageUrl) {
            setCoverImageUrl(parsed.coverImageUrl);
            setPreviewName("Saved cover image");
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [eventId, isEditing, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewName(file.name);
      // Immediate local preview so the user sees the banner immediately
      const localBlob = URL.createObjectURL(file);
      setCoverImageUrl(localBlob);
      setIsUploadingImage(true);
      try {
        const uploadRes = await EventService.uploadCoverImage(file);
        if (uploadRes?.url) {
          setCoverImageUrl(uploadRes.url);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        setCoverImageUrl("");
        toast.error("Failed to upload image. Please try again with a valid JPG/PNG/WEBP image under 5MB.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const onFormSubmit = (data: EventDetailsFormValues) => {
    // Avoid saving blob: preview URLs if upload failed
    const safeCoverImageUrl =
      coverImageUrl && !coverImageUrl.startsWith("blob:") ? coverImageUrl : undefined;

    const payloadToSave = {
      eventId: isEditing ? eventId : undefined,
      eventName: data.eventName,
      title: data.eventName,
      description: data.description,
      eventDate: data.eventDate,
      distanceType: data.distanceType,
      coverImageUrl: safeCoverImageUrl,
      isChallenge: false,
    };
    localStorage.setItem("pending_event_data", JSON.stringify(payloadToSave));
    router.push(`/dashboard/events/${eventId || "new"}/edite/step-two`);
  };

  if (isLoadingExisting) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primaryColor mx-auto" />
        <p className="text-sm text-descriptionColor">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Outer Card with Ambient Glow */}
      <div className="relative overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Soft Ambient Light (Top Right) */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
          }}
        />

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-wide text-white">
              {isEditing ? "Edit Event Details" : "Create Event Details"}
            </h2>
            <p className="text-xs text-descriptionColor mt-1">
              Step 1 of 2: Basic event info, schedule, and distance criteria
            </p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Event Name */}
            <div className="space-y-2">
              <label className="text-sm block font-semibold text-white/90">
                Event Name
              </label>
              <input
                type="text"
                placeholder="e.g. Run For Life 2026"
                {...register("eventName", {
                  required: "Event name is required",
                })}
                className={`w-full rounded-md border bg-[#0a0f04]/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  errors.eventName
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.eventName && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.eventName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm block font-semibold text-white/90">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the event, goals, instructions..."
                {...register("description", {
                  required: "Description is required",
                })}
                className={`w-full resize-none rounded-md border bg-[#0a0f04]/60 p-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
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

            {/* Event Date */}
            <div className="space-y-2">
              <label className="text-sm block font-semibold text-white/90">
                Event Date
              </label>
              <input
                type="date"
                {...register("eventDate", {
                  required: "Event date is required",
                })}
                className={`w-full rounded-md border bg-[#0a0f04]/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  errors.eventDate
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.eventDate && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.eventDate.message}
                </p>
              )}
            </div>

            {/* Distance Type */}
            <div className="space-y-2">
              <label className="text-sm block font-semibold text-white/90">
                Distance Type
              </label>
              <input
                type="text"
                placeholder="e.g. 5K / 10K / Half Marathon / Full Marathon"
                {...register("distanceType", {
                  required: "Distance type is required",
                })}
                className={`w-full rounded-md border bg-[#0a0f04]/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  errors.distanceType
                    ? "border-red-500 focus:border-red-500"
                    : "border-borderColor focus:border-[#84cc16]"
                }`}
              />
              {errors.distanceType && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.distanceType.message}
                </p>
              )}
            </div>

            {/* Cover Image Upload Area */}
            <div className="space-y-2">
              <label className="text-sm block font-semibold text-white/90">
                Cover Image / Banner
              </label>
              <label className="relative flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#2f4214] bg-[#0a0f04]/50 p-2 sm:p-4 text-center transition hover:border-[#84cc16]/50 overflow-hidden">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <Loader2 className="h-6 w-6 text-primaryColor animate-spin" />
                    <span className="text-xs text-primaryColor">Uploading cover image...</span>
                  </div>
                ) : coverImageUrl ? (
                  <div className="relative w-full h-44 rounded-lg overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                      <Upload className="h-5 w-5 text-primaryColor" />
                      <span className="text-xs font-semibold text-white">Click or drop to replace banner</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6">
                    <Upload className="h-6 w-6 text-descriptionColor mb-2 mx-auto" />
                    <p className="text-sm text-descriptionColor">
                      Drag &amp; drop or{" "}
                      <span className="font-semibold text-primaryColor">
                        browse
                      </span>
                    </p>
                    <span className="mt-1 text-[11px] text-zinc-500 block">
                      {previewName || coverImageFiles?.[0]?.name || "PNG, JPG up to 5MB"}
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

            {/* Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full rounded-xl bg-primaryColor py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#84cc16]/20 flex items-center justify-center gap-1.5"
              >
                <span>
                  {isSubmitting ? "Saving..." : "Next: Set Requirements"}
                </span>
                <span>&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
