import { Fetch } from "../../lib/Fetch";
import { unwrap } from "../../lib/apiResponse";

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
  twoFactorAvailable?: boolean;
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
    const response = await Fetch.get("/admin/settings");
    return unwrap<AdminSettingsResponse>(response);
  },

  /**
   * Update admin account details and password.
   */
  updateAdminAccount: async (payload: UpdateAdminAccountPayload): Promise<any> => {
    const response = await Fetch.patch("/admin/settings/account", payload);
    return unwrap(response);
  },

  /**
   * Update notification settings.
   */
  updateNotifications: async (
    payload: Partial<AdminNotificationsData>
  ): Promise<any> => {
    const response = await Fetch.patch("/admin/settings/notifications", payload);
    return unwrap(response);
  },

  /**
   * Get list of active browser sessions.
   */
  getActiveSessions: async (): Promise<AdminSession[]> => {
    const response = await Fetch.get("/admin/settings/sessions");
    const data = unwrap<AdminSession[]>(response);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Revoke an active session.
   */
  revokeSession: async (sessionId: string): Promise<any> => {
    const response = await Fetch.delete(`/admin/settings/sessions/${sessionId}`);
    return unwrap(response);
  },

  /**
   * Revoke all other sessions.
   */
  revokeOtherSessions: async (): Promise<any> => {
    const response = await Fetch.delete("/admin/settings/sessions");
    return unwrap(response);
  },
};

