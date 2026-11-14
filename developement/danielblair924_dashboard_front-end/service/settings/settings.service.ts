import { Fetch } from "../../lib/Fetch";

export interface AdminAccountData {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface AdminNotificationsData {
  newSubmissionAlert: boolean;
  newRegistrationAlert: boolean;
  weeklySummaryEmail: boolean;
  eventPublishedConfirmation: boolean;
  badgeEarnedNotifications: boolean;
}

export interface AdminSession {
  id: string;
  device: string;
  location: string;
  isCurrent: boolean;
  createdAt?: string | Date;
  expiresAt?: string | Date;
}

export interface AdminSecurityData {
  enable2FA: boolean;
  sessions: AdminSession[];
}

export interface AdminSettingsResponse {
  account: AdminAccountData;
  notifications: AdminNotificationsData;
  security: AdminSecurityData;
}

export interface UpdateAdminAccountPayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const SettingsService = {
  /**
   * Retrieve administrative settings including account details,
   * alert notification preferences, and active browser sessions.
   */
  getAdminSettings: async (): Promise<AdminSettingsResponse> => {
    try {
      const response = await Fetch.get("/admin/settings");
      const resData = response?.data || response;
      if (resData?.account) return resData;
    } catch {
      // Fallback
    }

    try {
      // Try /user/me
      const meRes = await Fetch.get("/user/me");
      const user = meRes?.data || meRes;
      const notifRes = await Fetch.get("/settings/notifications").catch(() => null);
      const sessRes = await Fetch.get("/settings/sessions").catch(() => null);

      const fullName = [user?.fname, user?.lname].filter(Boolean).join(" ") || user?.username || "Admin User";

      return {
        account: {
          id: user?.id,
          name: fullName,
          email: user?.email || "admin@firstmileclub.com",
          avatarUrl: user?.avatarUrl,
          role: user?.role || "ADMIN",
        },
        notifications: notifRes?.data || {
          newSubmissionAlert: true,
          newRegistrationAlert: true,
          weeklySummaryEmail: false,
          eventPublishedConfirmation: true,
          badgeEarnedNotifications: false,
        },
        security: {
          enable2FA: false,
          sessions: sessRes?.data || [
            {
              id: "session-current",
              device: "Chrome / macOS (Active)",
              location: "New York, USA",
              isCurrent: true,
            },
          ],
        },
      };
    } catch {
      return {
        account: {
          name: "Admin User",
          email: "admin@firstmileclub.com",
        },
        notifications: {
          newSubmissionAlert: true,
          newRegistrationAlert: true,
          weeklySummaryEmail: false,
          eventPublishedConfirmation: true,
          badgeEarnedNotifications: false,
        },
        security: {
          enable2FA: false,
          sessions: [
            {
              id: "session-default",
              device: "Chrome / Desktop (Active)",
              location: "Local Network",
              isCurrent: true,
            },
          ],
        },
      };
    }
  },

  /**
   * Update admin account details and password.
   */
  updateAdminAccount: async (payload: UpdateAdminAccountPayload): Promise<any> => {
    try {
      const response = await Fetch.patch("/admin/settings/account", payload);
      return response?.data || response;
    } catch {
      const response = await Fetch.patch("/user/profile", payload);
      return response?.data || response;
    }
  },

  /**
   * Update notification settings.
   */
  updateNotifications: async (
    payload: Partial<AdminNotificationsData>
  ): Promise<any> => {
    try {
      const response = await Fetch.patch("/admin/settings/notifications", payload);
      return response?.data || response;
    } catch {
      const response = await Fetch.patch("/settings/notifications", payload);
      return response?.data || response;
    }
  },

  /**
   * Get list of active browser sessions.
   */
  getActiveSessions: async (): Promise<AdminSession[]> => {
    try {
      const response = await Fetch.get("/admin/settings/sessions");
      const resData = response?.data || response;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData)) return resData;
    } catch {
      const response = await Fetch.get("/settings/sessions").catch(() => null);
      const resData = response?.data || response;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData)) return resData;
    }

    return [
      {
        id: "session-active-1",
        device: "Chrome on macOS",
        location: "Current Device",
        isCurrent: true,
      },
    ];
  },

  /**
   * Revoke an active session.
   */
  revokeSession: async (sessionId: string): Promise<any> => {
    try {
      const response = await Fetch.delete(`/admin/settings/sessions/${sessionId}`);
      return response?.data || response;
    } catch {
      const response = await Fetch.delete(`/settings/sessions/${sessionId}`);
      return response?.data || response;
    }
  },
};

