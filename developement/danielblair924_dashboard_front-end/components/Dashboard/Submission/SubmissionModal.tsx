"use client";

import { getErrorMessage } from "@/lib/apiResponse";

import RootDialog from "@/components/reusable/RootDialog";
import { useState } from "react";
import { toast } from "react-toastify";
import { SubmissionService } from "@/service/submission/submission.service";

interface SubmissionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  submissionId?: string;
  onSuccess?: () => void;
}

function SubmissionModal({
  open,
  setOpen,
  submissionId,
  onSuccess,
}: SubmissionModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setReason("");
    setOpen(false);
  };

  const handleSendAndReject = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }

    if (!submissionId) {
      toast.error("No submission selected.");
      return;
    }

    try {
      setSubmitting(true);
      await SubmissionService.moderateSubmission(submissionId, {
        status: "REJECTED",
        rejectionReason: reason.trim(),
      });
      toast.success("Submission rejected successfully.");
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const msg =
        getErrorMessage(err, "Failed to reject submission");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="md:max-w-md w-full overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] p-4 md:p-6 shadow-2xl shadow-black/90 sm:max-w-lg"
    >
      {/* Corner Ambient Glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
        }}
      />

      <div className="relative z-10">
        {/* Title & Description */}
        <div className="space-y-1 mb-5">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Reason for Rejection
          </h3>
          <p className="text-sm text-descriptionColor font-normal">
            This message will be sent to the member.
          </p>
        </div>

        {/* Textarea Input */}
        <div className="mb-4">
          <textarea
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            placeholder="Explain what needs fixing (e.g. Incomplete Strava screenshot, pace mismatch)..."
            className="w-full resize-none rounded-xl border border-borderColor bg-[#0D1402] p-4 text-xs text-white placeholder:text-descriptionColor/70 focus:border-primaryColor focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-md border border-borderColor bg-[#344217] px-3 md:px-6 py-3 text-base font-semibold text-descriptionColor transition hover:bg-[#233213] cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendAndReject}
            disabled={submitting}
            className="rounded-md bg-primaryColor px-3 md:px-6 py-3 hover:shadow-lg text-base font-semibold text-black transition hover:opacity-90 cursor-pointer shadow-lg shadow-primaryColor/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Sending..." : "Send & Reject"}
          </button>
        </div>
      </div>
    </RootDialog>
  );
}

export default SubmissionModal;
