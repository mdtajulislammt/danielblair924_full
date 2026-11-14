import React from "react";
import { AdminAccountSection } from "@/components/Dashboard/settings/AdminAccountSection";
import settingsData from "@/components/Dashboard/settings/settingsData.json";

export default function SettingsPage() {
  return (
    <AdminAccountSection
      initialValues={{
        name: settingsData.account.name,
        email: settingsData.account.email,
      }}
    />
  );
}