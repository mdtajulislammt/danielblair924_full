"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowDropup } from "react-icons/io";
import Image from "next/image";
import DynamicTable from "@/components/reusable/DynamicTable";
import PaginationPage from "@/components/reusable/PaginationPage";
import { NewsArticle, NewsService } from "@/service/news/news.service";
import { toast } from "react-toastify";
import { Search, Trash2, AlertCircle, RefreshCw, Newspaper, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NewsDetailsModal from "./NewsDetailsModal";

export type NewsRecord = {
  id: string;
  title: string;
  icon: string;
  coverImageUrl?: string;
  date: string;
  status: "Published" | "Draft" | string;
};

interface NewsTableProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

export default function NewsTable({ searchParams }: NewsTableProps) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const currentPage = Number(searchParams?.page || searchParamsHook?.get("page")) || 1;
  const itemsPerPage = Number(searchParams?.limit || searchParamsHook?.get("limit")) || 10;

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewArticle = (articleId: string) => {
    const found = news.find((n) => n.id === articleId);
    if (found) {
      setSelectedArticle(found);
      setIsModalOpen(true);
    }
  };

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await NewsService.getNews({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });

      setNews(res.data || []);
      setTotalItems(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to load news articles:", err);
      setError("Unable to load news articles from server.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDeleteNews = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) return;
    try {
      await NewsService.deleteNews(id);
      setNews((prev) => prev.filter((p) => p.id !== id));
      setTotalItems((prev) => Math.max(0, prev - 1));
      toast.success("News article deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      toast.error(err?.response?.data?.message || "Failed to delete article.");
    }
  };

  const tableData: NewsRecord[] = news.map((item) => {
    const iconName = item.coverImageUrl
      ? item.coverImageUrl
      : item.icon
      ? item.icon
      : "badge1.png";

    return {
      id: item.id,
      title: item.title,
      icon: iconName,
      coverImageUrl: item.coverImageUrl,
      date: item.date || (item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "Recent"),
      status: item.status || (item.statusCode === "PUBLISHED" ? "Published" : "Draft"),
    };
  });

  const columns = [
    {
      label: (
        <span className="inline-flex text-whiteColor font-bold items-center gap-1 uppercase tracking-wider text-xs">
          TITLE <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "title",
      width: "480px",
      formatter: (_: string, row: NewsRecord) => {
        const rawIcon = row.coverImageUrl || row.icon;
        const imageSrc =
          rawIcon && (rawIcon.startsWith("http") || rawIcon.startsWith("/") || rawIcon.startsWith("blob:"))
            ? rawIcon
            : rawIcon && !rawIcon.includes("/")
            ? `/image/badge/${rawIcon}`
            : "/image/badge/badge1.png";

        return (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleViewArticle(row.id)}
            title="Click to view article details"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-lime-950/40 border border-lime-800/40 flex items-center justify-center shrink-0 group-hover:border-primaryColor transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={row.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/image/badge/badge1.png";
                }}
              />
            </div>
            <span className="font-medium text-stone-200 text-sm line-clamp-1 group-hover:text-primaryColor transition-colors">
              {row.title}
            </span>
          </div>
        );
      },
    },
    {
      label: (
        <span className="inline-flex text-whiteColor font-bold items-center gap-1 uppercase tracking-wider text-xs">
          DATE <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "date",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-descriptionColor text-sm">{value}</span>
      ),
    },
    {
      label: (
        <span className="inline-flex text-whiteColor font-bold items-center gap-1 uppercase tracking-wider text-xs">
          STATUS <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "status",
      width: "160px",
      formatter: (value: string) => {
        const isPublished = value?.toLowerCase() === "published";
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isPublished
                ? "bg-primaryColor/20 text-lime-400 border border-primaryColor/30"
                : "bg-stone-800 text-stone-400 border border-stone-700"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
        );
      },
    },
    {
      label: <span className="uppercase tracking-wider text-xs w-full text-right block pr-4">ACTIONS</span>,
      accessor: "id",
      width: "220px",
      formatter: (_: any, row: NewsRecord) => (
        <div className="flex items-center justify-end gap-2 pr-2">
          {/* View Details Button with Eye Icon (Available to everyone) */}
          <button
            type="button"
            onClick={() => handleViewArticle(row.id)}
            title="View article details"
            className="p-1.5 sm:px-2.5 sm:py-1 bg-lime-950/60 hover:bg-lime-900/60 border border-lime-800/80 rounded-md text-stone-300 hover:text-primaryColor text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-primaryColor" />
            <span className="hidden sm:inline">View</span>
          </button>

          {/* Admin-only Edit & Delete Actions */}
          {isAdmin && (
            <>
              <Link
                href={`/dashboard/news/edit/${row.id}`}
                className="px-3 py-1 bg-primaryColor/10 hover:bg-primaryColor/20 border border-lime-800/80 rounded-md text-primaryColor text-xs font-semibold transition-colors"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteNews(row.id, row.title)}
                title="Delete article"
                className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 rounded-md text-red-400 text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-radial-[at_97%_0%] from-lime-950/40 to-stone-950 p-3 rounded-xl border border-lime-900/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1402] border border-lime-900/60 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-200 placeholder:text-zinc-500 focus:outline-none focus:border-primaryColor transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === tab
                  ? "bg-primaryColor text-stone-950 shadow-[0_0_10px_rgba(161,244,0,0.25)]"
                  : "bg-lime-950/30 text-stone-300 hover:bg-lime-900/40 border border-lime-900/40"
              }`}
            >
              {tab === "ALL" ? "All Posts" : tab === "PUBLISHED" ? "Published" : "Drafts"}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="w-full p-4 rounded-xl bg-red-950/30 border border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchNews}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-800 rounded-lg text-xs font-semibold text-red-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-lime-900/60 bg-radial-[at_97%_0%] from-lime-950 to-stone-950 shadow-2xl">
        <div className="relative z-10">
          <DynamicTable
            columns={columns}
            data={tableData}
            noDataMessage={searchQuery ? `No news items matching "${searchQuery}"` : "No news articles found"}
            loading={isLoading}
            width="w-full"
          />
        </div>

        {totalItems > 0 && (
          <div className="px-4 border-t border-lime-900/40 pb-4 pt-2">
            <PaginationPage
              totalPages={totalPages}
              dataLength={tableData.length}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={(page: number) => {
                const query = new URLSearchParams(searchParamsHook?.toString() || "");
                query.set("page", String(page));
                query.set("limit", String(itemsPerPage));
                router.push(`/dashboard/news?${query.toString()}`);
              }}
            />
          </div>
        )}
      </div>

      {/* News Details Modal */}
      <NewsDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={selectedArticle}
        isAdmin={isAdmin}
      />
    </div>
  );
}
