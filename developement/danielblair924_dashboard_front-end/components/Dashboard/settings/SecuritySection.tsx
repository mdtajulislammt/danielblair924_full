"use client";

import { Toggle } from "@/components/reusable/Toggle";
import React, { useState, useEffect } from "react";
import { AdminSession, SettingsService } from "@/service/settings/settings.service";
import { toast } from "react-toastify";
import { Laptop, Smartphone, Monitor } from "lucide-react";

interface Session {
  id: string;
  device: string;
  location: string;
  isCurrent: boolean;
}

interface SecuritySectionProps {
  initial2FA?: boolean;
  initialSessions?: Session[];
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  initial2FA = false,
  initialSessions,
}) => {
  const [enable2FA, setEnable2FA] = useState<boolean>(initial2FA);
  const [sessions, setSessions] = useState<Session[]>(initialSessions || []);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(!initialSessions);

  useEffect(() => {
    SettingsService.getActiveSessions()
      .then((activeSessions: AdminSession[]) => {
        if (activeSessions && activeSessions.length > 0) {
          setSessions(
            activeSessions.map((s) => ({
              id: s.id,
              device: s.device,
              location: s.location || "Active Session",
              isCurrent: Boolean(s.isCurrent),
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Could not load sessions from server:", err);
      })
      .finally(() => {
        setIsLoadingSessions(false);
      });
  }, []);

  const handleLogoutSession = async (id: string) => {
    try {
      await SettingsService.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session revoked successfully.");
    } catch (err: any) {
      console.error("Failed to revoke session:", err);
      toast.error(err?.response?.data?.message || "Failed to revoke session.");
    }
  };

  const handleLogoutAll = async () => {
    const toRevoke = sessions.filter((s) => !s.isCurrent);
    if (toRevoke.length === 0) {
      toast.info("No other active sessions to log out.");
      return;
    }

    try {
      await Promise.all(toRevoke.map((s) => SettingsService.revokeSession(s.id)));
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success("All other sessions logged out.");
    } catch (err: any) {
      console.error("Failed to revoke sessions:", err);
      toast.error("Failed to log out all devices.");
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* 2FA Toggle Card */}
      <div className="p-6 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex items-center justify-between">
        <div>
          <h2 className="text-whiteColor text-base font-bold leading-5">
            Enable 2FA
          </h2>
          <p className="text-stone-400 text-xs font-normal leading-4 mt-1">
            Two-factor authentication via authenticator app
          </p>
        </div>
        <Toggle
          checked={enable2FA}
          onChange={(val) => {
            setEnable2FA(val);
            toast.info(`Two-factor authentication ${val ? "enabled" : "disabled"}.`);
          }}
        />
      </div>

      {/* Active Sessions Card */}
      <div className="p-6 bg-radial-[at_97%_0%] from-lime-900 to-stone-950 rounded-xl outline-1 outline-offset-[-1px] outline-lime-800 flex flex-col gap-5">
        <div>
          <h2 className="text-whiteColor text-base font-bold leading-5">
            Active Sessions
          </h2>
          <p className="text-stone-400 text-xs font-normal leading-4 mt-1">
            Browser sessions currently authenticated into your admin account.
          </p>
        </div>

        {isLoadingSessions ? (
          <div className="py-6 text-center text-xs text-stone-400 animate-pulse">
            Loading active sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-4 text-center text-xs text-stone-400">
            No active sessions recorded.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => {
              const isMobile =
                session.device.toLowerCase().includes("mobile") ||
                session.device.toLowerCase().includes("iphone") ||
                session.device.toLowerCase().includes("android");

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2 border-b border-lime-900/40 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-lime-900/30 rounded-lg flex items-center justify-center text-primaryColor">
                      {isMobile ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Monitor className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-stone-200 text-sm font-semibold">
                        {session.device}
                      </div>
                      <div className="text-stone-400 text-xs font-normal">
                        {session.location}{" "}
                        {session.isCurrent && (
                          <span className="text-primaryColor font-semibold">
                            • Current Session
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleLogoutSession(session.id)}
                      className="px-3 py-1 bg-stone-900 border border-primaryColor/60 hover:bg-stone-800 text-primaryColor text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Log out
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleLogoutAll}
            className="px-4 py-2 border border-red-900/80 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Log out all devices
          </button>
        </div>
      </div>
    </div>
  );
};
export default SecuritySection;
