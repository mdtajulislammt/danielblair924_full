"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { MemberService } from "@/service/member/member.service";
import badge1 from "@/public/image/badge/badge1.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function BadgesPage() {
  const params = useParams();
  const userId = params?.id as string;

  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await MemberService.getMemberBadges(userId);
      const items = Array.isArray(res) ? res : res?.data || [];
      setBadges(items);
    } catch (err) {
      console.error("Failed to load member badges:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const columns = [
    {
      label: "BADGE",
      accessor: "badge",
      width: "120px",
      formatter: (_: any, row: any) => (
        <div className="relative h-10 w-10 overflow-hidden">
          <Image
            src={row.iconUrl || row.badge || badge1}
            alt={row.name || "Badge"}
            width={40}
            height={40}
            className="object-contain"
            unoptimized={typeof (row.iconUrl || row.badge) === "string" && ((row.iconUrl || row.badge).startsWith("http://") || (row.iconUrl || row.badge).startsWith("https://"))}
          />
        </div>
      ),
    },
    {
      label: "BADGE NAME",
      accessor: "name",
      width: "240px",
      formatter: (value: string) => (
        <span className="font-semibold text-primaryColor">{value}</span>
      ),
    },
    {
      label: "DESCRIPTION",
      accessor: "description",
      width: "300px",
      formatter: (value: string) => (
        <span className="text-descriptionColor text-xs">{value || "Milestone achieved"}</span>
      ),
    },
    {
      label: "EARNED ON",
      accessor: "earnedOn",
      width: "180px",
      formatter: (value: string, row: any) => {
        const dateVal = value || row.earnedAt;
        const d = new Date(dateVal);
        const formatted = !isNaN(d.getTime())
          ? d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : dateVal || "N/A";
        return <span className="text-zinc-400">{formatted}</span>;
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        <DynamicTable
          columns={columns}
          data={badges}
          noDataMessage="No badges unlocked yet for this runner"
          loading={loading}
          width="min-w-[800px]"
        />
      </div>
    </div>
  );
}
