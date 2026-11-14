import { Fetch } from "../../lib/Fetch";

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
   * Tries /admin/news first to include drafts, falls back to /news if needed.
   */
  getNews: async (query?: NewsQueryParams): Promise<NewsListResponse> => {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.search) params.set("search", query.search);
    if (query?.status) params.set("status", query.status);
    if (query?.sort) params.set("sort", query.sort);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    try {
      const response = await Fetch.get(`/admin/news${queryString}`);
      const resData = response?.data || response;

      if (resData && Array.isArray(resData.data)) {
        return {
          data: resData.data,
          total: resData.total ?? resData.data.length,
          page: resData.page ?? 1,
          limit: resData.limit ?? 10,
          totalPages: resData.totalPages ?? 1,
        };
      }
      if (Array.isArray(resData)) {
        return {
          data: resData,
          total: resData.length,
          page: 1,
          limit: resData.length,
          totalPages: 1,
        };
      }
    } catch {
      // Fall back to public /news endpoint
      const response = await Fetch.get(`/news${queryString}`);
      const resData = response?.data || response;
      if (resData && Array.isArray(resData.data)) {
        return {
          data: resData.data,
          total: resData.total ?? resData.data.length,
          page: resData.page ?? 1,
          limit: resData.limit ?? 10,
          totalPages: resData.totalPages ?? 1,
        };
      }
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  },

  /**
   * Get single news article by ID.
   */
  getNewsById: async (id: string): Promise<NewsArticle | null> => {
    try {
      const response = await Fetch.get(`/admin/news/${id}`);
      const resData = response?.data || response;
      return resData?.data || resData || null;
    } catch {
      const response = await Fetch.get(`/news/${id}`);
      const resData = response?.data || response;
      return resData?.data || resData || null;
    }
  },

  /**
   * Create a new news post.
   */
  createNews: async (payload: CreateNewsPayload): Promise<NewsArticle> => {
    try {
      const response = await Fetch.post("/admin/news", payload);
      const resData = response?.data || response;
      return resData?.data || resData;
    } catch {
      const response = await Fetch.post("/news", payload);
      const resData = response?.data || response;
      return resData?.data || resData;
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
      const resData = response?.data || response;
      return resData?.data || resData;
    } catch {
      const response = await Fetch.patch(`/news/${id}`, payload);
      const resData = response?.data || response;
      return resData?.data || resData;
    }
  },

  /**
   * Delete a news post by ID.
   */
  deleteNews: async (id: string): Promise<any> => {
    try {
      const response = await Fetch.delete(`/admin/news/${id}`);
      return response?.data || response;
    } catch {
      const response = await Fetch.delete(`/news/${id}`);
      return response?.data || response;
    }
  },

  /**
   * Upload cover image for news post locally to public/uploads
   */
  uploadCoverImage: async (file: File): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return { url: data?.url || data?.data?.url || "" };
    } catch (e) {
      console.warn("Local upload fallback:", e);
      return { url: URL.createObjectURL(file) };
    }
  },
};

