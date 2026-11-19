"use client";

import { getErrorMessage } from "@/lib/apiResponse";

import DynamicTable from "@/components/reusable/DynamicTable";
import PaginationPage from "@/components/reusable/PaginationPage";
import { MemberService } from "@/service/member/member.service";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoMdArrowDropup } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

export type MemberRecord = {
  id: number | string;
  name?: string;
  avatarBg?: string;
  email?: string;
  initials?: string;
  joinDate?: string;
  totalDistance?: string;
  totalDistanceKm?: number;
  events?: number;
  badges?: number;
  status?: string;
  fname?: string;
  lname?: string;
  city?: string;
  country?: string;
  username?: string;
  createdAt?: string;
};

const avatarColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

export default function MembersTable() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const initialStatus = searchParams?.get("status") || "all";

  const [activeFilter, setActiveFilter] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await MemberService.getMembers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        status: activeFilter !== "all" ? activeFilter.toUpperCase() : undefined,
      });

      const list = res?.items || (Array.isArray(res) ? res : []);
      const pagination = res?.pagination;

      setMembers(list);
      if (pagination) {
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } else {
        setTotalItems(list.length);
        setTotalPages(Math.ceil(list.length / itemsPerPage) || 1);
      }
    } catch (err: any) {
      console.error("Failed to fetch members:", err);
      setError(
        getErrorMessage(err, "Failed to load members")
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, activeFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const columns = [
    {
      label: (
        <span className="inline-flex text-white items-center gap-1">
          NAME <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "name",
      width: "240px",
      formatter: (_: string, row: any) => {
        const name =
          row.fname || row.lname
            ? `${row.fname || ""} ${row.lname || ""}`.trim()
            : row.username || row.email?.split("@")[0] || "Runner";

        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "R";

        const colorIndex =
          (row.id?.charCodeAt(0) || 0) % avatarColors.length;
        const avatarBg = avatarColors[colorIndex];

        return (
          <Link
            href={`/dashboard/members/${row.id}`}
            className="flex items-center gap-3 group"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarBg}`}
            >
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white/90 group-hover:text-primaryColor transition">
                {name}
              </span>
              <span className="text-[11px] text-descriptionColor">{row.email}</span>
            </div>
          </Link>
        );
      },
    },
    {
      label: (
        <span className="inline-flex text-white items-center gap-1">
          JOIN DATE <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "joinDate",
      width: "160px",
      formatter: (_: string, row: any) => {
        const dateVal = row.joinDate || row.createdAt;
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
    {
      label: (
        <span className="inline-flex text-white items-center gap-1">
          TOTAL DISTANCE <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "totalDistanceKm",
      width: "180px",
      formatter: (value: number) => (
        <div className="flex items-center gap-1.5 text-white/90">
          <HiOutlineBars3 className="text-base text-[#84cc16]" />
          <span>{Number(value || 0).toFixed(1)} km</span>
        </div>
      ),
    },
    {
      label: (
        <span className="inline-flex text-white items-center gap-1">
          LOCATION <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "city",
      width: "140px",
      formatter: (_: string, row: any) => {
        const loc = [row.city, row.country].filter(Boolean).join(", ");
        return <span className="text-descriptionColor">{loc || "Global"}</span>;
      },
    },
    {
      label: (
        <span className="inline-flex text-white items-center gap-1 justify-end w-full">
          STATUS <IoMdArrowDropup className="text-lg" />
        </span>
      ),
      accessor: "status",
      width: "140px",
      formatter: (value: string) => {
        const isActive = value === "ACTIVE";
        return (
          <div className="flex justify-end">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${
                isActive
                  ? "bg-primaryColor/20 text-primaryColor"
                  : "bg-whiteColor/20 text-whiteColor/60"
              }`}
            >
              {isActive ? "Active" : value || "Inactive"}
            </span>
          </div>
        );
      },
    },
  ];

  const filterOptions = [
    { label: "All Members", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-white">Members</h2>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-descriptionColor text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search runners..."
              className="w-full bg-[#0D1402] border border-borderColor rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-descriptionColor/70 focus:outline-none focus:border-primaryColor transition"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setActiveFilter(option.value);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3.5 rounded-full text-xs font-medium cursor-pointer transition ${
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
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl border border-borderColor bg-[#0D1402] shadow-2xl shadow-black/80">
        <div className="relative z-10">
          <DynamicTable
            columns={columns}
            data={members}
            noDataMessage="No members found"
            loading={loading}
            error={error || undefined}
            width="min-w-[1000px]"
          />
        </div>
        {totalItems > itemsPerPage && (
          <div className="px-4 border-t border-borderColor pb-4">
            <PaginationPage
              totalPages={totalPages}
              dataLength={members?.length || 0}
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
