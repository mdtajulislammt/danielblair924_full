"use client";

import { getErrorMessage } from "@/lib/apiResponse";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { badgeSchema, BadgeFormData } from "./badgeSchema";
import badgeInitialData from "./badgeInitialData.json";
import { Toggle } from "@/components/reusable/Toggle";
import Image, { StaticImageData } from "next/image";
import { BadgeService } from "@/service/badge/badge.service";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface BadgeFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<BadgeFormData> & { id?: string; iconUrl?: string };
  existingIcon?: string | StaticImageData;
}

const isStaticImageData = (value: unknown): value is StaticImageData =>
  typeof value === "object" &&
  value !== null &&
  "src" in value &&
  "height" in value &&
  "width" in value;

export const CreateBadges: React.FC<BadgeFormProps> = ({
  mode = "create",
  initialData,
  existingIcon: existingIconProp,
}) => {
  const router = useRouter();
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState<boolean>(false);
  const [existingIconState, setExistingIconState] = useState<
    string | StaticImageData | null
  >(existingIconProp || initialData?.iconUrl || null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BadgeFormData>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      name: initialData?.name || (mode === "create" ? badgeInitialData.name : ""),
      description: initialData?.description || (mode === "create" ? badgeInitialData.description : ""),
      isActive: initialData?.isActive ?? badgeInitialData.isActive,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        isActive: initialData.isActive ?? true,
      });
      if (initialData.iconUrl) {
        setExistingIconState(initialData.iconUrl);
      } else if (initialData.icon) {
        const iconValue = initialData.icon as unknown;
        if (typeof iconValue === "string") {
          setExistingIconState(iconValue);
        } else if (isStaticImageData(iconValue)) {
          setExistingIconState(iconValue);
        }
      }
    }
  }, [mode, initialData, reset]);

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIconPreview(url);
      setExistingIconState(null);

      // Attempt immediate background upload
      setIsUploadingIcon(true);
      try {
        const uploadRes = await BadgeService.uploadBadgeIcon(file);
        if (uploadRes?.url) {
          setUploadedIconUrl(uploadRes.url);
        }
      } catch (err) {
        console.warn("Direct icon upload failed, preview will be used:", err);
      } finally {
        setIsUploadingIcon(false);
      }
    }
  };

  const onSubmit = async (data: BadgeFormData) => {
    try {
      let finalIcon = uploadedIconUrl;
      if (!finalIcon && typeof existingIconState === "string") {
        finalIcon = existingIconState;
      }
      if (!finalIcon && typeof existingIconProp === "string") {
        finalIcon = existingIconProp;
      }
      if (!finalIcon) {
        finalIcon = "/image/badge/badge1.png";
      }

      if (mode === "edit" && initialData?.id) {
        await BadgeService.updateBadge(initialData.id, {
          name: data.name,
          title: data.name,
          description: data.description,
          isActive: data.isActive,
          iconUrl: finalIcon,
        });
        toast.success("Badge updated successfully!");
      } else {
        await BadgeService.createBadge({
          name: data.name,
          title: data.name,
          description: data.description,
          isActive: data.isActive,
          iconUrl: finalIcon,
        });
        toast.success("Badge created successfully!");
      }

      router.push("/dashboard/badges");
    } catch (err: any) {
      console.error("Failed to save badge:", err);
      toast.error(
        getErrorMessage(err, "Failed to save badge.")
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[640px] inline-flex flex-col justify-start items-start gap-5"
    >
      {/* Container */}
      <div className="self-stretch p-4 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex flex-col justify-start items-start gap-5">
        {/* Badge Icon Field */}
        <div className="self-stretch flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start">
            <label className="justify-start text-whiteColor text-xs font-semibold leading-5">
              Badge Icon
            </label>
          </div>
          <div className="w-full h-20 pt-1.5 inline-flex justify-start items-center gap-5">
            {/* Circular Badge Icon Display */}
            <div className="size-20 bg-gradient-to-b from-primaryColor to-lime-600/0 rounded-full flex justify-center items-center overflow-hidden shrink-0 relative">
              {isUploadingIcon && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-primaryColor animate-spin" />
                </div>
              )}
              {iconPreview || uploadedIconUrl || existingIconState ? (
                isStaticImageData(existingIconState) ? (
                  <Image
                    src={existingIconState}
                    alt="Badge Icon Preview"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconPreview || uploadedIconUrl || (existingIconState as string)}
                    alt="Badge Icon Preview"
                    className="w-12 h-12 object-contain"
                  />
                )
              ) : (
                <span className="text-black text-4xl font-normal leading-[54px]">
                  {badgeInitialData.defaultIconEmoji}
                </span>
              )}
            </div>

            {/* Upload Button & Helper Text */}
            <div className="flex flex-col justify-start items-start gap-1">
              <input
                type="file"
                id="badgeIcon"
                accept="image/*"
                {...register("icon")}
                onChange={(e) => {
                  register("icon").onChange(e);
                  handleIconChange(e);
                }}
                className="hidden"
              />
              <label
                htmlFor="badgeIcon"
                className="w-28 h-9 bg-primaryColor/10 rounded-lg outline-1 outline-offset-[-1px] outline-lime-800 hover:bg-primaryColor/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="text-center text-primaryColor text-xs font-semibold leading-5">
                  {isUploadingIcon ? "Uploading..." : "Upload Icon"}
                </span>
              </label>
              <div className="pt-0.5 flex flex-col justify-start items-start">
                <span className="text-descriptionColor text-xs font-normal leading-4">
                  Circular PNG recommended · min 200×200px
                </span>
              </div>
            </div>
          </div>
          {errors.icon && (
            <span className="text-redColor text-xs mt-1">
              {errors.icon.message?.toString()}
            </span>
          )}
        </div>

        {/* Badge Name Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
          <div className="pb-0.5">
            <label className="text-whiteColor text-xs font-semibold leading-5">
              Badge Name
            </label>
          </div>
          <input
            type="text"
            placeholder="e.g. First 5K"
            {...register("name")}
            className="w-full h-11 px-3.5 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-lg outline-1 outline-offset-[-1px] outline-lime-800 focus:outline-primaryColor text-white text-sm font-normal transition-all"
          />
          {errors.name && (
            <span className="text-redColor text-xs">{errors.name.message}</span>
          )}
        </div>

        {/* Description Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
          <div className="pb-0.5">
            <label className="text-whiteColor text-xs font-semibold leading-5">
              Description
            </label>
          </div>
          <textarea
            rows={4}
            placeholder="Describe when this badge is awarded..."
            {...register("description")}
            className="w-full min-h-[112px] p-3.5 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-lg outline-1 outline-offset-[-1px] outline-lime-800 focus:outline-primaryColor text-white text-sm font-normal leading-5 resize-none transition-all"
          />
          {errors.description && (
            <span className="text-redColor text-xs">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Status Toggle Row */}
        <div className="self-stretch inline-flex justify-between items-center py-1">
          <div className="inline-flex flex-col justify-start items-start">
            <span className="text-whiteColor text-sm font-semibold leading-5">
              Status
            </span>
            <span className="text-descriptionColor text-xs font-normal leading-5">
              Badge is visible and can be earned
            </span>
          </div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Toggle checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="self-stretch inline-flex justify-end items-start">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingIcon}
          className="h-11 px-8 bg-primaryColor hover:bg-lime-400 rounded-[10px] inline-flex justify-center items-center transition-colors cursor-pointer disabled:opacity-50 font-bold"
        >
          <span className="text-center text-stone-950 text-sm font-bold leading-5">
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Update Badge"
                : "Save Changes"}
          </span>
        </button>
      </div>
    </form>
  );
};
