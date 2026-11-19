"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DynamicTable from "@/components/reusable/DynamicTable";
import PaginationPage from "@/components/reusable/PaginationPage";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChallengeParticipant,
  ChallengeService,
} from "@/service/event/challenge.service";
import { membersData } from "@/public/demoData/DemoData";

export default function ChallengeParticipantsTable() {
  const params = useParams();
  const challengeId = params?.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!challengeId) return;

    setIsLoading(true);
    ChallengeService.getChallengeParticipants(challengeId, {
      page: currentPage,
      limit: itemsPerPage,
    })
      .then((res) => {
        const data: any = (res as any)?.participants ? res : (res as any)?.data;
        if (Array.isArray(data?.participants)) {
          setParticipants(data.participants);
          setTotalItems(data.pagination?.total || data.participants.length);
        } else {
          setParticipants([]);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        console.error("Failed to load challenge participants:", err);
        setParticipants([]);
        setTotalItems(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [challengeId, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const columns = [
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Rank
        </span>
      ),
      accessor: "rank",
      width: "80px",
      formatter: (val: number) => (
        <div className="flex items-center">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              val === 1
                ? "bg-yellow-400 text-black shadow-xs shadow-yellow-400/50"
                : val === 2
                ? "bg-zinc-300 text-black"
                : val === 3
                ? "bg-amber-600 text-white"
                : "text-descriptionColor"
            }`}
          >
            #{val}
          </span>
        </div>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Runner
        </span>
      ),
      accessor: "name",
      width: "240px",
      formatter: (_: string, row: ChallengeParticipant) => (
        <Link
          href={`/dashboard/members/${row.userId}`}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-black bg-primaryColor">
            {(row.name.slice(0, 2) || "RM").toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-white/90 group-hover:text-primaryColor transition block">
              {row.name}
            </span>
            {row.email && (
              <span className="text-[11px] text-descriptionColor block">
                {row.email}
              </span>
            )}
          </div>
        </Link>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Contributed Distance
        </span>
      ),
      accessor: "individualKm",
      width: "180px",
      formatter: (val: number) => (
        <span className="text-sm font-bold text-primaryColor">
          {val} km
        </span>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Location
        </span>
      ),
      accessor: "location",
      width: "160px",
      formatter: (val?: string) => (
        <span className="text-xs text-descriptionColor font-normal">
          {val || "Worldwide"}
        </span>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Joined Date
        </span>
      ),
      accessor: "joinedAt",
      width: "140px",
      formatter: (val: string) => (
        <span className="text-xs text-descriptionColor font-normal">
          {val ? new Date(val).toLocaleDateString() : "Active"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-zinc-800/40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <DynamicTable
        columns={columns}
        data={participants}
        border={false}
        noDataMessage="No participants registered yet."
      />
      {totalItems > itemsPerPage && (
        <div className="p-4 border-t border-borderColor">
          <PaginationPage
            currentPage={currentPage}
            totalPages={totalPages}
            dataLength={participants.length}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
}
