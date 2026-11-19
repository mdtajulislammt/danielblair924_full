import { Fetch } from "../../lib/Fetch";
import { AppConfig } from "../../config/app.config";
import { getBody, unwrap } from "../../lib/apiResponse";
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
    const body = getBody(response);

    return {
      status: body?.status,
      data: Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [],
      pagination: body?.pagination,
    };
  },

  /**
   * Get single badge by ID or slug.
   */
  getBadge: async (idOrSlug: string): Promise<BadgeItem | null> => {
    const response = await Fetch.get(`/badges/${idOrSlug}`);
    return unwrap(response);
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
    return unwrap(response);
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
    return unwrap(response);
  },

  /**
   * Delete a badge by ID.
   */
  deleteBadge: async (id: string): Promise<any> => {
    const response = await Fetch.delete(`/badges/${id}`);
    return unwrap(response);
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
