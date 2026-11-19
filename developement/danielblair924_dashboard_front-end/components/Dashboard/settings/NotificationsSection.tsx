"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSchema, NotificationFormData } from "./schemas";
import { Toggle } from "@/components/reusable/Toggle";
import { SettingsService } from "@/service/settings/settings.service";
import { getErrorMessage } from "@/lib/apiResponse";
import { toast } from "react-toastify";

interface NotificationsSectionProps {
  initialValues?: NotificationFormData;
}

const DEFAULT_NOTIFICATIONS: NotificationFormData = {
  newSubmissionAlert: true,
  newRegistrationAlert: true,
  weeklySummaryEmail: false,
  eventPublishedConfirmation: true,
  badgeEarnedNotifications: false,
};

const NOTIFICATION_ITEMS: Array<{
  key: keyof NotificationFormData;
  title: string;
  description: string;
}> = [
  {
    key: "newSubmissionAlert",
    title: "New submission alert",
    description: "Get notified when a member submits activity",
  },
  {
    key: "newRegistrationAlert",
    title: "New registration alert",
    description: "Get notified when someone registers",
  },
  {
    key: "weeklySummaryEmail",
    title: "Weekly summary email",
    description: "Receive a weekly digest every Monday",
  },
  {
    key: "eventPublishedConfirmation",
    title: "Event published confirmation",
    description: "Confirm when an event goes live",
  },
  {
    key: "badgeEarnedNotifications",
    title: "Badge earned notifications",
    description: "Alert when members earn badges",
  },
];

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  initialValues,
}) => {
  const { control, handleSubmit, reset } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: initialValues || DEFAULT_NOTIFICATIONS,
  });

  useEffect(() => {
    if (!initialValues) {
      SettingsService.getAdminSettings()
        .then((res) => {
          if (res?.notifications) {
            reset(res.notifications);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch notification settings:", err);
        });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: NotificationFormData) => {
    try {
      await SettingsService.updateNotifications(data);
      toast.success("Notification preferences updated.");
    } catch (err: any) {
      console.error("Failed to update notifications:", err);
      toast.error(getErrorMessage(err, "Failed to update notification settings."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-6 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex flex-col gap-6"
    >
      <div>
        <h2 className="text-whiteColor text-xl font-bold leading-6">
          Notification Preferences
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Select which automated alerts you receive as an administrator.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {NOTIFICATION_ITEMS.map((item, idx) => (
          <React.Fragment key={item.key}>
            <div className="flex items-center justify-between py-1">
              <div>
                <h3 className="text-stone-200 text-sm font-semibold leading-5">
                  {item.title}
                </h3>
                <p className="text-descriptionColor text-xs font-normal leading-4">
                  {item.description}
                </p>
              </div>
              <Controller
                name={item.key}
                control={control}
                render={({ field }) => (
                  <Toggle
                    checked={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      handleSubmit(onSubmit)();
                    }}
                  />
                )}
              />
            </div>
            {idx < NOTIFICATION_ITEMS.length - 1 && (
              <div className="h-0 outline-1 outline-offset-[-0.50px] outline-lime-900/50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </form>
  );
};
export default NotificationsSection;
