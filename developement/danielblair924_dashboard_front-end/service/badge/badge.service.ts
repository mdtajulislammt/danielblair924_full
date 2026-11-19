import { Fetch } from "../../lib/Fetch";
import { AppConfig } from "../../config/app.config";
import type { StaticImageData } from "next/image";

export interface BadgeTag {
  label: string;
  type: "event" | "ratw" | string;
}

export interface BadgeItem {
  id: string;
  slug?: string;
  name: string;
  title: string;
  description: string;
  icon: string | StaticImageData;
  iconUrl?: string;
  isActive: boolean;
  tagType?: string;
  tag: BadgeTag;
  earnedCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BadgeQueryParams {
  search?: string;
  tagType?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface BadgesResponse {
  status?: string;
  data: BadgeItem[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const BadgeService = {
  /**
   * Get list of badges with optional search, filtering, and pagination.
   */
  getBadges: async (query?: BadgeQueryParams): Promise<BadgesResponse> => {
    const params = new URLSearchParams();
    if (query?.search) params.set("search", query.search);
    if (query?.tagType) params.set("tagType", query.tagType);
    if (query?.isActive !== undefined) params.set("isActive", String(query.isActive));
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await Fetch.get(`/badges${queryString}`);
    const resData = response?.data?.data ?? response?.data ?? response;

    // Normalize response structure
    if (Array.isArray(resData)) {
      return {
        data: resData,
        pagination: {
          page: query?.page || 1,
          limit: query?.limit || resData.length,
          totalItems: resData.length,
          totalPages: 1,
        },
      };
    }

    if (resData?.data && Array.isArray(resData.data)) {
      return {
        status: resData.status,
        data: resData.data,
        pagination: resData.pagination,
      };
    }

    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Get single badge by ID or slug.
   */
  getBadge: async (idOrSlug: string): Promise<BadgeItem | null> => {
    const response = await Fetch.get(`/badges/${idOrSlug}`);
    const resData = response?.data?.data ?? response?.data ?? response;
    return resData?.data || resData || null;
  },

  /**
   * Create a new badge.
   */
  createBadge: async (payload: {
    name: string;
    title?: string;
    description: string;
    iconUrl?: string;
    icon?: string;
    tagType?: string;
    isActive?: boolean;
    slug?: string;
  }): Promise<BadgeItem> => {
    const response = await Fetch.post("/badges", payload);
    const resData = response?.data?.data ?? response?.data ?? response;
    return resData?.data || resData;
  },

  /**
   * Update an existing badge.
   */
  updateBadge: async (
    id: string,
    payload: Partial<{
      name: string;
      title?: string;
      description: string;
      iconUrl?: string;
      icon?: string;
      tagType?: string;
      isActive?: boolean;
    }>
  ): Promise<BadgeItem> => {
    const response = await Fetch.patch(`/badges/${id}`, payload);
    const resData = response?.data?.data ?? response?.data ?? response;
    return resData?.data || resData;
  },

  /**
   * Delete a badge by ID.
   */
  deleteBadge: async (id: string): Promise<any> => {
    const response = await Fetch.delete(`/badges/${id}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Upload badge icon image to backend /media/upload with absolute URL
   */
  uploadBadgeIcon: async (file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response: any = await Fetch.post("/media/upload", formData);
      const relativeUrl = response?.data?.data?.url || response?.data?.url || response?.url || "";
      const base = AppConfig().app.url;
      const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
      const absoluteUrl = relativeUrl.startsWith("http")
        ? relativeUrl
        : `${cleanBase}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
      return { url: absoluteUrl };
    } catch (e) {
      console.error("Backend media upload failed:", e);
      throw e;
    }
  },
};
