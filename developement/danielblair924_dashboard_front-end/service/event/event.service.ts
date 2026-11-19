import { Fetch } from "../../lib/Fetch";
import { AppConfig } from "../../config/app.config";

export interface EventRequirements {
  completeDistance?: boolean;
  uploadRunningEvidence?: boolean;
  postOnTikTok?: boolean;
  tiktokCaptionInstructions?: string;
  tagFirstMileClub?: boolean;
  tagCollaboratingPage?: boolean;
  collaboratingPageName?: string;
  useSpecificHashtag?: boolean;
  specificHashtag?: string;
}

export interface EventItem {
  id: string;
  title: string;
  eventName?: string;
  description: string;
  eventDate?: string | null;
  distanceType?: string | null;
  coverImageUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  category?: string;
  registeredCount: number;
  submissionsCount?: number;
  requirements?: EventRequirements;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventParticipant {
  id: string;
  submissionId?: string;
  name: string;
  initials: string;
  email?: string;
  avatarUrl?: string;
  joinDate: string;
  distanceKm: number;
  submissionStatus: string;
  duration?: number;
  pace?: string;
}

export interface CreateEventPayload {
  title?: string;
  eventName?: string;
  description: string;
  eventDate?: string;
  distanceType?: string;
  coverImageUrl?: string;
  category?: string;
  status?: string;
  requirements?: EventRequirements;
}

export const EventService = {
  /**
   * Get events with optional filtering, search, and pagination
   */
  getEvents: async (params?: {
    status?: string;
    category?: string;
    distanceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.category) query.append("category", params.category);
    if (params?.distanceType) query.append("distanceType", params.distanceType);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const response = await Fetch.get(`/admin/events${qs}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Get single event detail by ID
   */
  getEventById: async (id: string): Promise<{ status: string; data: EventItem }> => {
    const response = await Fetch.get(`/admin/events/${id}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Get event participants & submissions
   */
  getEventParticipants: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<{
    status: string;
    data: {
      event: { id: string; title: string; registeredCount: number };
      participants: EventParticipant[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const response = await Fetch.get(`/admin/events/${id}/participants${qs}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Create new event
   */
  createEvent: async (payload: CreateEventPayload) => {
    const response = await Fetch.post("/admin/events", payload);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Update existing event
   */
  updateEvent: async (id: string, payload: Partial<CreateEventPayload>) => {
    const response = await Fetch.patch(`/admin/events/${id}`, payload);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Delete an event
   */
  deleteEvent: async (id: string) => {
    const response = await Fetch.delete(`/admin/events/${id}`);
    return response?.data?.data ?? response?.data ?? response;
  },

  /**
   * Upload cover image file to backend /media/upload with absolute URL
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

// Re-export ChallengeService for backwards compatibility
export { ChallengeService } from "./challenge.service";
