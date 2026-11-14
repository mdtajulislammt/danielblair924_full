"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Calendar, User, Edit, Newspaper } from "lucide-react";
import { NewsArticle } from "@/service/news/news.service";

interface NewsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  isAdmin?: boolean;
}

export default function NewsDetailsModal({
  isOpen,
  onClose,
  article,
  isAdmin = false,
}: NewsDetailsModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  // Resolve cover image safely
  const rawCover = article.coverImageUrl || article.icon;
  const coverImage =
    rawCover &&
    (rawCover.startsWith("/") ||
      rawCover.startsWith("http") ||
      rawCover.startsWith("blob:"))
      ? rawCover
      : rawCover && !rawCover.includes("/")
      ? `/image/badge/${rawCover}`
      : "/image/badge/badge1.png";

  const isPublished =
    article.status?.toLowerCase() === "published" ||
    article.statusCode?.toLowerCase() === "published";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#090d04] border border-lime-800/80 rounded-2xl shadow-[0_0_50px_rgba(161,244,0,0.15)] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Soft Ambient Background Glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
          }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-lime-900/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primaryColor/10 border border-primaryColor/30 text-primaryColor">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                FMC Club News
              </span>
              <span
                className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isPublished
                    ? "bg-primaryColor/20 text-primaryColor border border-primaryColor/40"
                    : "bg-stone-800 text-stone-400 border border-stone-700"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-900/80 hover:bg-lime-900/40 text-stone-400 hover:text-white border border-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 relative z-10 text-stone-200">
          {/* Cover Image Banner */}
          <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-lime-900/60 bg-black/60 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default badge icon if image load fails
                (e.target as HTMLImageElement).src = "/image/badge/badge1.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d04] via-transparent to-black/30" />
          </div>

          {/* Article Meta: Date & Author */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 border-b border-lime-900/30 pb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primaryColor" />
              <span>{article.date || article.publishDate || "Recent Post"}</span>
            </div>
            {article.author?.name && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-primaryColor" />
                <span>By {article.author.name}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug">
              {article.title}
            </h2>
          </div>

          {/* Body Content */}
          <div className="text-sm text-stone-300 leading-relaxed space-y-3 whitespace-pre-line">
            {article.body ? (
              // Check if body looks like HTML
              article.body.includes("<") && article.body.includes(">") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: article.body }}
                  className="prose prose-invert prose-lime max-w-none prose-p:leading-relaxed prose-headings:text-white"
                />
              ) : (
                <p>{article.body}</p>
              )
            ) : (
              <p className="italic text-stone-500">No article body provided.</p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-lime-900/40 bg-[#060a03] flex items-center justify-between gap-3 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {isAdmin && (
            <Link
              href={`/dashboard/news/edit/${article.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primaryColor hover:bg-lime-400 text-stone-950 font-bold text-xs transition-colors shadow-[0_0_15px_rgba(161,244,0,0.25)]"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

