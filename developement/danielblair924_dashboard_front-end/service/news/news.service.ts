import { Fetch } from "../../lib/Fetch";
import { AppConfig } from "../../config/app.config";
import { getBody, unwrap } from "../../lib/apiResponse";

export interface NewsAuthor {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  coverImageUrl?: string;
  icon?: string;
  date: string;
  publishDate: string;
  status: "Published" | "Draft" | string;
  statusCode?: string;
  author?: NewsAuthor | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: "asc" | "desc";
}

export interface NewsListResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateNewsPayload {
  title: string;
  body: string;
  coverImageUrl?: string;
  coverImage?: string;
  publishDate?: string;
  status?: string;
  isDraft?: boolean;
}

export interface UpdateNewsPayload {
  title?: string;
  body?: string;
  coverImageUrl?: string;
  coverImage?: string;
  publishDate?: string;
  status?: string;
  isDraft?: boolean;
}

export const NewsService = {
  /**
   * Retrieve list of news articles with search, status filtering, and pagination.
   * Uses /admin/news so drafts are included.
   */
  getNews: async (query?: NewsQueryParams): Promise<NewsListResponse> => {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.search) params.set("search", query.search);
    if (query?.status) params.set("status", query.status);
    if (query?.sort) params.set("sort", query.sort);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await Fetch.get(`/admin/news${queryString}`);
    const body = getBody(response);

    return {
      data: Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [],
      total: body?.total ?? (Array.isArray(body?.data) ? body.data.length : Array.isArray(body) ? body.length : 0),
      page: body?.page ?? 1,
      limit: body?.limit ?? 10,
      totalPages: body?.totalPages ?? 1,
    };
  },

  /**
   * Get single news article by ID.
   */
  getNewsById: async (id: string): Promise<NewsArticle | null> => {
    try {
      const response = await Fetch.get(`/admin/news/${id}`);
      return unwrap(response);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const response = await Fetch.get(`/news/${id}`);
        return unwrap(response);
      }
      throw err;
    }
  },

  /**
   * Create a new news post.
   */
  createNews: async (payload: CreateNewsPayload): Promise<NewsArticle> => {
    try {
      const response = await Fetch.post("/admin/news", payload);
      return unwrap(response);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const response = await Fetch.post("/news", payload);
        return unwrap(response);
      }
      throw err;
    }
  },

  /**
   * Update an existing news post.
   */
  updateNews: async (
    id: string,
    payload: UpdateNewsPayload
  ): Promise<NewsArticle> => {
    try {
      const response = await Fetch.patch(`/admin/news/${id}`, payload);
      return unwrap(response);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const response = await Fetch.patch(`/news/${id}`, payload);
        return unwrap(response);
      }
      throw err;
    }
  },

  /**
   * Delete a news post by ID.
   */
  deleteNews: async (id: string): Promise<any> => {
    try {
      const response = await Fetch.delete(`/admin/news/${id}`);
      return unwrap(response);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const response = await Fetch.delete(`/news/${id}`);
        return unwrap(response);
      }
      throw err;
    }
  },

  /**
   * Upload cover image for news post to backend /media/upload with absolute URL
   */
  uploadCoverImage: async (file: File): Promise<{ url: string }> => {
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
