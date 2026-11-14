"use client";

import BackButton from "@/components/reusable/BackButton";
import Loader from "@/components/reusable/Loader";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SubmissionService } from "@/service/submission/submission.service";
import SubmissionModal from "./SubmissionModal";

export default function SubmissionDetailPage({
  params: propParams,
}: {
  params?: { id?: string };
}) {
  const router = useRouter();
  const routeParams = useParams();
  const submissionId =
    (routeParams?.id as string) || propParams?.id || "";

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!submissionId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await SubmissionService.getSubmissionById(submissionId);
      setSubmission(res);
    } catch (err: any) {
      console.error("Failed to load submission details:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load submission details"
      );
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleApprove = async () => {
    if (!submissionId || actionLoading) return;
    try {
      setActionLoading(true);
      await SubmissionService.moderateSubmission(submissionId, {
        status: "APPROVED",
      });
      toast.success("Submission approved successfully!");
      fetchDetail();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve submission";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSuccess = () => {
    fetchDetail();
  };

  if (loading) {
    return (
      <div className="relative w-full space-y-5 text-white">
        <BackButton />
        <div className="flex flex-col items-center justify-center p-20 border border-borderColor rounded-2xl bg-[#070a03]">
          <Loader />
          <p className="mt-4 text-sm text-descriptionColor">
            Loading submission verification data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="relative w-full space-y-5 text-white">
        <BackButton />
        <div className="flex flex-col items-center justify-center p-16 border border-borderColor rounded-2xl bg-[#070a03] text-center">
          <p className="text-xl font-bold text-red-500 mb-2">
            Submission Not Found
          </p>
          <p className="text-sm text-descriptionColor mb-6">
            {error || "The requested submission could not be retrieved."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-full bg-primaryColor text-black font-semibold text-sm cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const memberName =
    submission.member ||
    (submission.user?.fname || submission.user?.lname
      ? `${submission.user?.fname || ""} ${submission.user?.lname || ""}`.trim()
      : submission.user?.username || "Runner");

  const avatarUrl =
    submission.icon || submission.user?.avatarUrl || "/profile.png";

  const eventTitle =
    submission.event ||
    submission.eventDetail?.title ||
    submission.challengeDetail?.title ||
    "Open Run";

  const distanceText =
    submission.distance ||
    (submission.distanceKm ? `${submission.distanceKm.toFixed(1)} km` : "N/A");

  const runDateText = submission.date || submission.runDate || "N/A";
  const durationText = submission.duration || "N/A";
  const submittedAtText = submission.submittedAt || "Recently";

  return (
    <div>
      <div className="relative w-full space-y-5 text-white">
        {/* Back Button */}
        <BackButton />

        {/* Status Banner */}
        <div className="flex items-center justify-between px-5 py-3 rounded-xl border border-borderColor bg-[#0D1402]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-descriptionColor uppercase tracking-wider font-semibold">
              Status:
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                submission.status === "APPROVED"
                  ? "bg-primaryColor/20 text-primaryColor border border-primaryColor/40"
                  : submission.status === "REJECTED"
                  ? "bg-redColor/20 text-redColor border border-redColor/40"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
              }`}
            >
              {submission.status || "PENDING"}
            </span>
          </div>
          {submission.rejectionReason && (
            <div className="text-xs text-red-400">
              <span className="font-semibold">Reason:</span>{" "}
              {submission.rejectionReason}
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 h-full gap-5 lg:grid-cols-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-4 h-full lg:col-span-5">
            {/* Member Card */}
            <div className="relative overflow-hidden rounded-2xl border border-borderColor p-5 shadow-xl shadow-black/80">
              <div
                className="pointer-events-none absolute -right-18 -top-12 h-22 w-100 rounded-full opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
                }}
              />

              <div className="relative z-10 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-zinc-700">
                  <Image
                    src={avatarUrl}
                    alt={memberName}
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primaryColor">
                    {memberName}
                  </h3>
                  <p className="text-[13px] text-descriptionColor">
                    {submittedAtText}
                  </p>
                </div>
              </div>

              {/* Event Box */}
              <div className="relative z-10 mt-4 rounded-sm border bg-[#0D1402] backdrop-blur-sm border-borderColor px-4 py-2.5 text-sm">
                <span className="text-descriptionColor font-semibold">
                  Event:{" "}
                </span>
                <span className="font-bold text-primaryColor">{eventTitle}</span>
              </div>
            </div>

            {/* Run Details Card */}
            <div className="relative overflow-hidden rounded-2xl border border-borderColor p-5 shadow-xl shadow-black/80">
              <div
                className="pointer-events-none absolute -right-18 -top-12 h-26 w-100 rounded-full opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
                }}
              />
              <h4 className="text-sm font-bold tracking-wider text-whiteColor uppercase">
                RUN DETAILS
              </h4>

              <div className="mt-4 divide-y divide-[#344217] text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-descriptionColor">Distance</span>
                  <span className="font-bold text-primaryColor">
                    {distanceText}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-descriptionColor">Date</span>
                  <span className="font-bold text-primaryColor">
                    {runDateText}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-descriptionColor">Duration</span>
                  <span className="font-bold text-primaryColor">
                    {durationText}
                  </span>
                </div>
                {submission.pace && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-descriptionColor">Average Pace</span>
                    <span className="font-bold text-primaryColor">
                      {submission.pace}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative overflow-hidden lg:col-span-7 h-full rounded-2xl border border-borderColor bg-[#0A0D05] p-5 shadow-xl shadow-black/80">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
              }}
            />

            <div className="relative z-10 space-y-4">
              {/* Screenshots Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strava Screenshot */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-borderColor bg-[#0D1402] p-6 text-center transition hover:border-[#2b4015] min-h-[160px]">
                  {submission.stravaImageUrl ? (
                    <a
                      href={submission.stravaImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center"
                    >
                      <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                        <Image
                          src={submission.stravaImageUrl}
                          alt="Strava Proof"
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <span className="text-xs text-primaryColor underline">
                        View Full Strava Proof
                      </span>
                    </a>
                  ) : (
                    <>
                      <span className="text-2xl">🖼️</span>
                      <span className="mt-2 text-sm font-normal text-descriptionColor">
                        Strava Screenshot
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        (No image uploaded)
                      </span>
                    </>
                  )}
                </div>

                {/* GPS Route Screenshot */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-borderColor bg-[#0D1402] p-6 text-center transition hover:border-[#2b4015] min-h-[160px]">
                  {submission.gpsImageUrl ? (
                    <a
                      href={submission.gpsImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center"
                    >
                      <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                        <Image
                          src={submission.gpsImageUrl}
                          alt="GPS Route Proof"
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <span className="text-xs text-primaryColor underline">
                        View Full GPS Proof
                      </span>
                    </a>
                  ) : (
                    <>
                      <span className="text-2xl">🗺️</span>
                      <span className="mt-2 text-sm font-normal text-descriptionColor">
                        GPS Route Screenshot
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        (No image uploaded)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-sm border border-borderColor bg-[#0D1402] px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={
                        submission.postedOnTikTok
                          ? "text-primaryColor"
                          : "text-gray-500"
                      }
                    >
                      {submission.postedOnTikTok ? "✓" : "○"}
                    </span>
                    <span className="text-descriptionColor">Posted on TikTok</span>
                  </div>
                  {submission.socialPostUrl && (
                    <a
                      href={submission.socialPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primaryColor hover:underline"
                    >
                      View Post
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2.5 rounded-sm border border-borderColor bg-[#0D1402] px-4 py-2.5">
                  <span
                    className={
                      submission.taggedClub
                        ? "text-primaryColor"
                        : "text-gray-500"
                    }
                  >
                    {submission.taggedClub ? "✓" : "○"}
                  </span>
                  <span className="text-descriptionColor">
                    Tagged First Mile Club
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-sm border border-borderColor bg-[#0D1402] px-4 py-2.5">
                  <span
                    className={
                      submission.usedHashtag
                        ? "text-primaryColor"
                        : "text-gray-500"
                    }
                  >
                    {submission.usedHashtag ? "✓" : "○"}
                  </span>
                  <span className="text-descriptionColor">
                    Used official event hashtags
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {submission.status !== "REJECTED" && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setRejectModalOpen(true)}
              className="rounded-md border border-borderColor bg-[#344217] px-4 md:px-6 py-3 text-sm md:text-base font-semibold text-descriptionColor transition hover:bg-[#233213] cursor-pointer disabled:opacity-50"
            >
              Reject Submission
            </button>
          )}
          {submission.status !== "APPROVED" && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleApprove}
              className="rounded-md bg-primaryColor px-4 md:px-6 py-3 hover:shadow-lg text-sm md:text-base font-semibold text-black transition hover:opacity-90 cursor-pointer shadow-lg shadow-primaryColor/20 disabled:opacity-50"
            >
              {actionLoading ? "Approving..." : "Approve Submission"}
            </button>
          )}
        </div>
      </div>

      {rejectModalOpen && (
        <SubmissionModal
          open={rejectModalOpen}
          setOpen={setRejectModalOpen}
          submissionId={submissionId}
          onSuccess={handleRejectSuccess}
        />
      )}
    </div>
  );
}
