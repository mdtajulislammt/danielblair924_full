import React from "react";
import { NotificationsSection } from "@/components/Dashboard/settings/NotificationsSection";
import settingsData from "@/components/Dashboard/settings/settingsData.json";

export default function NotificationsSettingsPage() {
  return <NotificationsSection initialValues={settingsData.notifications} />;
}