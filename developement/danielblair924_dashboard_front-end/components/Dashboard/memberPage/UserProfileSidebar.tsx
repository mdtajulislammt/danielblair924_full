"use client";

import DashboardSmallCardWrapper from "@/components/reusable/DashboardSmallCardWrapper";
import Loader from "@/components/reusable/Loader";
import { MemberService } from "@/service/member/member.service";
import calenderImg from "@/public/image/member/calender.png";
import emailImg from "@/public/image/member/email.png";
import locationImg from "@/public/image/member/loaction.png";
import phoneImg from "@/public/image/member/phone.png";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserProfileSidebar({
  userId,
}: {
  userId: number | string;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await MemberService.getMemberById(String(userId));
      setUser(res);
    } catch (err: any) {
      console.error("Failed to load user profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleToggleStatus = async () => {
    if (!user || actionLoading) return;
    const isCurrentlyActive = user.status === "ACTIVE";
    const nextStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";

    try {
      setActionLoading(true);
      await MemberService.updateMemberStatus(String(userId), nextStatus);
      toast.success(
        `Member successfully ${
          isCurrentlyActive ? "suspended" : "activated"
        }!`
      );
      setUser((prev: any) => ({ ...prev, status: nextStatus }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update status";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-borderColor bg-[#070a03] p-12 text-center">
        <Loader />
        <span className="text-xs text-descriptionColor mt-3">
          Loading profile...
        </span>
      </div>
    );
  }

  const name =
    user?.fname || user?.lname
      ? `${user?.fname || ""} ${user?.lname || ""}`.trim()
      : user?.username || "Runner";

  const dateVal = user?.joinDate || user?.createdAt;
  const d = new Date(dateVal);
  const formattedJoinDate = !isNaN(d.getTime())
    ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : dateVal || "Recently";

  const locationText =
    [user?.city, user?.country].filter(Boolean).join(", ") ||
    "Global Runner";

  const badgesCount = user?.badges?.length || 0;
  const submissionsCount = user?.submissions?.length || 0;
  const lifetimeDistance = `${Number(user?.totalDistanceKm || 0).toFixed(1)} km`;
  const isActive = user?.status === "ACTIVE";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Profile Details Card */}
      <div className="relative overflow-hidden backdrop-blur-sm rounded-2xl border border-borderColor bg-[#070a03] p-6 shadow-xl">
        <div
          className="pointer-events-none absolute -right-10 -top-18 h-89 w-44 rounded-full opacity-55 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primaryColor">
            <Image
              src={user?.avatarUrl || "/profile.png"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          {/* Name & Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 pb-4">
            <h3 className="text-lg font-bold text-primaryColor">{name}</h3>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                isActive
                  ? "bg-primaryColor/15 text-primaryColor border border-primaryColor/30"
                  : "bg-redColor/15 text-redColor border border-redColor/30"
              }`}
            >
              {user?.status || "ACTIVE"}
            </span>
          </div>

          {/* Contact Details */}
          <div className="pt-4.5 w-full space-y-3 text-left text-sm text-descriptionColor border-y border-borderColor pb-5">
            <div className="flex items-center gap-2.5">
              <Image
                src={emailImg}
                width={20}
                height={20}
                alt="Email"
                className="h-4 w-4 object-contain shrink-0"
              />
              <span className="truncate">{user?.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Image
                src={phoneImg}
                width={20}
                height={20}
                alt="Phone"
                className="h-4 w-4 object-contain shrink-0"
              />
              <span>
                {user?.recipientPhoneNumber || "Phone not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Image
                src={locationImg}
                width={20}
                height={20}
                alt="Location"
                className="h-4 w-4 object-contain shrink-0"
              />
              <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Image
                src={calenderImg}
                width={20}
                height={20}
                alt="Calendar"
                className="h-4 w-4 object-contain shrink-0"
              />
              <span>Joined {formattedJoinDate}</span>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="w-full divide-y divide-borderColor text-sm">
            <div className="flex items-center justify-between py-3">
              <span className="text-descriptionColor">Lifetime Distance</span>
              <span className="font-bold text-base text-primaryColor">
                {lifetimeDistance}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-descriptionColor">Verified Runs</span>
              <span className="text-descriptionColor font-medium">
                {submissionsCount}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-descriptionColor">Badges Earned</span>
              <span className="font-bold text-amber-500">{badgesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <DashboardSmallCardWrapper>
        <h4 className="text-xs font-semibold tracking-wider text-descriptionColor uppercase mb-3">
          ACTIONS
        </h4>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={actionLoading}
            onClick={handleToggleStatus}
            className={`w-full rounded-lg cursor-pointer border py-2.5 text-xs font-semibold transition disabled:opacity-50 ${
              isActive
                ? "border-redColor text-redColor hover:bg-[#2e1313]"
                : "border-primaryColor text-primaryColor hover:bg-[#1a280c]"
            }`}
          >
            {actionLoading
              ? "Updating..."
              : isActive
              ? "Suspend Runner"
              : "Reactivate Runner"}
          </button>
        </div>
      </DashboardSmallCardWrapper>
    </div>
  );
}
