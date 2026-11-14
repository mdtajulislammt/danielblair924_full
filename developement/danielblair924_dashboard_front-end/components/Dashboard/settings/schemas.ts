import { z } from "zod";

export const adminAccountSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password.",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be at least 8 characters.",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match.",
      path: ["confirmNewPassword"],
    },
  );

export type AdminAccountFormData = z.infer<typeof adminAccountSchema>;

export const notificationSchema = z.object({
  newSubmissionAlert: z.boolean(),
  newRegistrationAlert: z.boolean(),
  weeklySummaryEmail: z.boolean(),
  eventPublishedConfirmation: z.boolean(),
  badgeEarnedNotifications: z.boolean(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
