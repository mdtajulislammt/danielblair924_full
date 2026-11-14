import React from "react";
import { SecuritySection } from "@/components/Dashboard/settings/SecuritySection";
import settingsData from "@/components/Dashboard/settings/settingsData.json";

export default function SecuritySettingsPage() {
  return (
    <SecuritySection
      initial2FA={settingsData.security.enable2FA}
      initialSessions={settingsData.security.sessions}
    />
  );
}