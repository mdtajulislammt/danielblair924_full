"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, CreatePostFormData } from "./postSchema";
import { JoditEditorWrapper } from "@/components/ui/JoditEditorWrapper";
import { NewsService } from "@/service/news/news.service";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export const CreatePost: React.FC = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      body: "",
      publishDate: new Date().toISOString().slice(0, 16),
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setIsUploadingImage(true);
      try {
        const uploadRes = await NewsService.uploadCoverImage(file);
        if (uploadRes?.url) {
          setCoverImageUrl(uploadRes.url);
        }
      } catch (err) {
        console.warn("Direct image upload failed, using local preview:", err);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleFormSubmit = async (
    data: CreatePostFormData,
    isDraft: boolean = false
  ) => {
    try {
      const payload = {
        title: data.title,
        body: data.body,
        coverImageUrl: coverImageUrl || previewImage || "/image/badge/badge1.png",
        publishDate: data.publishDate
          ? new Date(data.publishDate).toISOString()
          : new Date().toISOString(),
        status: isDraft ? "DRAFT" : "PUBLISHED",
        isDraft,
      };

      await NewsService.createNews(payload);
      toast.success(
        isDraft ? "News post saved as draft!" : "News post published successfully!"
      );
      router.push("/dashboard/news");
    } catch (err: any) {
      console.error("Failed to submit news post:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create news post."
      );
    }
  };

  return (
    <div className="w-full max-w-[1212px] min-h-[951px] inline-flex flex-col justify-start items-center gap-6 rounded-2xl">
      {/* Main Form Area */}
      <form
        onSubmit={handleSubmit((data) => handleFormSubmit(data, false))}
        className="w-full max-w-[720px] flex flex-col justify-start items-start gap-5"
      >
        <div className="w-full p-6 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex flex-col justify-start items-start gap-5">
          {/* Title Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <label className="text-stone-300 text-sm font-semibold leading-5">
              Title
            </label>
            <input
              type="text"
              placeholder="Post title..."
              {...register("title")}
              className="self-stretch h-11 px-3.5 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-lg outline-1 outline-offset-[-1px] outline-lime-800 focus:outline-primaryColor text-white text-sm font-normal transition-all"
            />
            {errors.title && (
              <span className="text-redColor text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Body Rich Text Editor Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <label className="text-stone-300 text-sm font-semibold leading-5">
              Body
            </label>
            <div className="self-stretch">
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <JoditEditorWrapper
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your post content here..."
                  />
                )}
              />
            </div>
            {errors.body && (
              <span className="text-redColor text-xs">
                {errors.body.message}
              </span>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <label className="text-stone-300 text-sm font-semibold leading-5">
              Cover Image
            </label>
            <div className="self-stretch relative">
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                {...register("coverImage")}
                onChange={(e) => {
                  register("coverImage").onChange(e);
                  handleImageChange(e);
                }}
                className="hidden"
              />
              <label
                htmlFor="coverImage"
                className="self-stretch min-h-[144px] bg-radial-[at_97%_0%] from-lime-900/40 to-stone-950 rounded-lg outline-[1.50px] outline-dashed outline-offset-[-1.50px] outline-primaryColor flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-lime-900/60 transition-colors p-4 relative"
              >
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 text-primaryColor animate-spin" />
                  </div>
                )}
                {previewImage ? (
                  <div className="relative w-full h-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <>
                    <div className="size-7 relative overflow-hidden flex items-center justify-center text-descriptionColor">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-descriptionColor text-xs font-normal leading-5">
                        Drag & drop or{" "}
                      </span>
                      <span className="text-primaryColor text-xs font-semibold leading-5 underline">
                        browse
                      </span>
                    </div>
                    <div className="text-descriptionColor text-xs font-normal leading-4">
                      PNG, JPG up to 5MB
                    </div>
                  </>
                )}
              </label>
            </div>
            {errors.coverImage && (
              <span className="text-redColor text-xs">
                {errors.coverImage.message?.toString()}
              </span>
            )}
          </div>

          {/* Publish Date Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <label className="text-stone-300 text-sm font-semibold leading-5">
              Publish Date
            </label>
            <input
              type="datetime-local"
              {...register("publishDate")}
              className="self-stretch h-11 px-3.5 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-lg border border-lime-800 focus:border-primaryColor text-white text-sm font-normal color-scheme-dark"
            />
            {errors.publishDate && (
              <span className="text-redColor text-xs">
                {errors.publishDate.message}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="self-stretch inline-flex justify-end items-start gap-3">
          <button
            type="button"
            disabled={isSubmitting || isUploadingImage}
            onClick={handleSubmit((data) => handleFormSubmit(data, true))}
            className="flex-1 h-11 bg-lime-900/60 hover:bg-lime-900 rounded-lg inline-flex justify-center items-center transition-colors cursor-pointer disabled:opacity-50 border border-lime-800/60"
          >
            <span className="text-center text-stone-200 text-sm font-semibold leading-5">
              Save Draft
            </span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="flex-1 h-11 px-7 bg-primaryColor hover:bg-lime-400 rounded-[10px] inline-flex justify-center items-center transition-colors cursor-pointer disabled:opacity-50 font-bold"
          >
            <span className="text-center text-stone-950 text-sm font-bold leading-5">
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
