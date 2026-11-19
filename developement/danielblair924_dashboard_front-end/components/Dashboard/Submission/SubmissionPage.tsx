"use client";

import { getErrorMessage } from "@/lib/apiResponse";
import DynamicTable from "@/components/reusable/DynamicTable";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  SubmissionItem,
  SubmissionService,
} from "@/service/submission/submission.service";
import SubmissionModal from "./SubmissionModal";

function SubmissionPage() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const initialStatus = searchParams?.get("status")?.toLowerCase() || "pending";
  const [activeFilter, setActiveFilter] = useState(initialStatus);

  const filterOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rejection modal state for inline list action
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiStatus = activeFilter.toUpperCase() as
        | "PENDING"
        | "APPROVED"
        | "REJECTED";

      const res = await SubmissionService.getSubmissions({
        status: apiStatus,
        page: 1,
        limit: 50,
      });

      const items = res?.items || (Array.isArray(res) ? res : []);
      setData(items);
    } catch (err: any) {
      console.error("Failed to fetch submissions:", err);
      setError(getErrorMessage(err, "Failed to load submissions"));
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleApprove = async (id: string) => {
    try {
      await SubmissionService.moderateSubmission(id, { status: "APPROVED" });
      toast.success("Submission approved successfully!");
      // If on pending filter, remove item from list, else refresh
      if (activeFilter === "pending") {
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        fetchSubmissions();
      }
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to approve submission");
      toast.error(msg);
    }
  };

  const handleOpenReject = (id: string) => {
    setSelectedSubmissionId(id);
    setRejectModalOpen(true);
  };

  const handleRejectSuccess = () => {
    if (activeFilter === "pending" && selectedSubmissionId) {
      setData((prev) => prev.filter((item) => item.id !== selectedSubmissionId));
    } else {
      fetchSubmissions();
    }
    setSelectedSubmissionId(null);
  };

  const columns = [
    {
      label: "MEMBER",
      accessor: "member",
      width: "240px",
      formatter: (_: string, row: any) => (
        <Link
          href={`/dashboard/submissions/${row.id}`}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-700">
            <Image
              src={row.icon || "/profile.png"}
              alt={row.member || "Member"}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-white/95 group-hover:text-primaryColor transition">
            {row.member}
          </span>
        </Link>
      ),
    },
    {
      label: "EVENT / CHALLENGE",
      accessor: "event",
      width: "240px",
      formatter: (value: string) => (
        <span className="font-medium text-[#84cc16]">{value || "Open Run"}</span>
      ),
    },
    {
      label: "DISTANCE CLAIMED",
      accessor: "distance",
      width: "200px",
      formatter: (value: string, row: any) => (
        <span className="text-descriptionColor font-normal">
          {value || (row.distanceKm ? `${row.distanceKm.toFixed(1)} km` : "N/A")}
        </span>
      ),
    },
    {
      label: "DATE",
      accessor: "date",
      width: "180px",
      formatter: (value: string) => (
        <span className="text-descriptionColor font-normal">{value}</span>
      ),
    },
    {
      label: <div className="text-right w-full pr-2">ACTIONS</div>,
      accessor: "id",
      width: "180px",
      formatter: (id: string, row: any) => (
        <div className="flex items-center justify-end gap-2 pr-1">
          {row.rawStatus !== "APPROVED" && (
            <button
              type="button"
              onClick={() => handleApprove(id)}
              className="rounded-full bg-primaryColor/15 px-3.5 py-1 hover:shadow hover:shadow-primaryColor text-xs font-medium text-primaryColor transition cursor-pointer"
            >
              Approve
            </button>
          )}
          {row.rawStatus !== "REJECTED" && (
            <button
              type="button"
              onClick={() => handleOpenReject(id)}
              className="rounded-full px-3.5 py-1 text-xs shadow hover:shadow-redColor font-medium text-redColor transition bg-redColor/20 cursor-pointer"
            >
              Reject
            </button>
          )}
          {row.rawStatus === "APPROVED" && (
            <span className="text-xs text-primaryColor font-medium py-1 px-2 rounded bg-primaryColor/10">
              Approved
            </span>
          )}
          {row.rawStatus === "REJECTED" && (
            <span className="text-xs text-redColor font-medium py-1 px-2 rounded bg-redColor/10">
              Rejected
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 items-start md:flex-row justify-between md:items-center mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-white">Submissions</h2>
        <div className="flex gap-2.5">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={`py-2 px-3.5 rounded-full text-sm cursor-pointer transition ${
                activeFilter === option.value
                  ? "bg-primaryColor text-blackColor font-semibold"
                  : "bg-[#0D1402] text-descriptionColor hover:bg-[#1A250F] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative border border-borderColor rounded-2xl backdrop-blur-2xl z-10">
        <DynamicTable
          columns={columns}
          width="min-w-[900px]"
          data={data}
          noDataMessage={`No ${activeFilter} submissions found`}
          loading={loading}
          error={error || undefined}
        />
      </div>

      {rejectModalOpen && selectedSubmissionId && (
        <SubmissionModal
          open={rejectModalOpen}
          setOpen={setRejectModalOpen}
          submissionId={selectedSubmissionId}
          onSuccess={handleRejectSuccess}
        />
      )}
    </div>
  );
}

export default SubmissionPage;
