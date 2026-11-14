"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import PaginationPage from "@/components/reusable/PaginationPage";
import { MemberService } from "@/service/member/member.service";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ActivityPage() {
  const params = useParams();
  const userId = params?.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await MemberService.getMemberSubmissions(userId, {
        page: currentPage,
        limit: itemsPerPage,
      });

      const items = res?.items || (Array.isArray(res) ? res : []);
      const pagination = res?.pagination;

      setActivities(items);
      if (pagination) {
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } else {
        setTotalItems(items.length);
        setTotalPages(Math.ceil(items.length / itemsPerPage) || 1);
      }
    } catch (err) {
      console.error("Failed to load member activities:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const columns = [
    {
      label: "DATE",
      accessor: "date",
      width: "160px",
      formatter: (value: string) => (
        <span className="text-descriptionColor font-normal">{value}</span>
      ),
    },
    {
      label: "ACTIVITY",
      accessor: "activity",
      width: "220px",
      formatter: (value: string) => (
        <span className="font-medium text-white/90">{value}</span>
      ),
    },
    {
      label: "DISTANCE",
      accessor: "distance",
      width: "160px",
      formatter: (value: string) => (
        <span className="font-semibold text-primaryColor">{value}</span>
      ),
    },
    {
      label: "DURATION",
      accessor: "duration",
      width: "160px",
      formatter: (value: string) => (
        <span className="text-descriptionColor">{value || "N/A"}</span>
      ),
    },
    {
      label: "STATUS",
      accessor: "type",
      width: "140px",
      formatter: (value: string) => {
        const isApproved = value === "Approved";
        const isRejected = value === "Rejected";
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isApproved
                ? "bg-primaryColor/15 text-primaryColor"
                : isRejected
                ? "bg-redColor/15 text-redColor"
                : "bg-yellow-500/15 text-yellow-400"
            }`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        <DynamicTable
          columns={columns}
          data={activities}
          noDataMessage="No activities recorded for this runner"
          loading={loading}
          width="min-w-[800px]"
        />
        {totalItems > itemsPerPage && (
          <div className="px-4 border-t border-borderColor py-3">
            <PaginationPage
              totalPages={totalPages}
              dataLength={activities?.length || 0}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
