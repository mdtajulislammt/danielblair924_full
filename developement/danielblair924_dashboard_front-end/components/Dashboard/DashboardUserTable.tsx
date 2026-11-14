"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { SubmissionService } from "@/service/submission/submission.service";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import PaginationPage from "../reusable/PaginationPage";
import RecentActivityCard from "./RecentActivityCard";
import { useAuth } from "@/hooks/useAuth";

function DashboardUserTable() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRecentSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SubmissionService.getSubmissions({
        page: currentPage,
        limit: itemsPerPage,
      });

      const items = res?.items || (Array.isArray(res) ? res : []);
      const pagination = res?.pagination;

      setSubmissions(items);
      if (pagination) {
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } else {
        setTotalItems(items.length);
        setTotalPages(Math.ceil(items.length / itemsPerPage) || 1);
      }
    } catch (err) {
      console.error("Failed to load dashboard recent submissions:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchRecentSubmissions();
  }, [fetchRecentSubmissions]);

  // Define table columns
  const columns = [
    {
      label: "MEMBER",
      accessor: "member",
      width: "220px",
      formatter: (_: string, row: any) => (
        <Link
          href={`/dashboard/submissions/${row.id}`}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-zinc-700">
            <Image
              src={row.icon || "/profile.png"}
              alt={row.member || "Member"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-white/90 group-hover:text-primaryColor transition">
            {row.member}
          </span>
        </Link>
      ),
    },
    {
      label: "EVENT",
      accessor: "event",
      width: "160px",
      formatter: (value: string) => (
        <span className="text-sm text-[#84cc16] font-medium truncate max-w-[150px] inline-block">
          {value || "Open Run"}
        </span>
      ),
    },
    {
      label: "DISTANCE",
      accessor: "distance",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm text-grayColor2">{value}</span>
      ),
    },
    {
      label: "STATUS",
      accessor: "rawStatus",
      width: "120px",
      formatter: (value: string) => {
        const statusBadgeMap: Record<string, string> = {
          PENDING: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
          APPROVED: "bg-primaryColor/15 text-primaryColor border border-primaryColor/30",
          REJECTED: "bg-redColor/15 text-redColor border border-redColor/30",
        };

        const badgeClass =
          statusBadgeMap[value] || "bg-zinc-800 text-zinc-400 border-zinc-700";

        return (
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {value || "PENDING"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#0A0D05] backdrop-blur-sm border border-borderColor rounded-lg p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-base font-bold text-whiteColor">
            Recent Submissions
          </h2>
          {isAdmin && (
            <Link
              href="/dashboard/submissions"
              className="text-sm group cursor-pointer flex items-center transition-all duration-300 gap-1.5 text-primaryColor"
            >
              View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <DynamicTable
          columns={columns}
          width="w-full"
          data={submissions}
          noDataMessage="No submissions found"
          loading={loading}
        />
        {totalItems > itemsPerPage && (
          <div className="px-4 border-t border-borderColor pt-3">
            <PaginationPage
              totalPages={totalPages}
              dataLength={submissions?.length || 0}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
      <div>
        <RecentActivityCard />
      </div>
    </div>
  );
}

export default DashboardUserTable;
