"use client";

import BackButton from "@/components/reusable/BackButton";
import DynamicTable from "@/components/reusable/DynamicTable";
import PaginationPage from "@/components/reusable/PaginationPage";
import { Skeleton } from "@/components/ui/skeleton";
import { membersData } from "@/public/demoData/DemoData";
import { EventParticipant, EventService } from "@/service/event/event.service";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";

export default function EventMemberPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [eventTitle, setEventTitle] = useState<string>("Event Participants");
  const [eventCoverUrl, setEventCoverUrl] = useState<string | null>(null);
  const [eventDistance, setEventDistance] = useState<string | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    setIsLoading(true);
    // Fetch participants and event details
    Promise.allSettled([
      EventService.getEventParticipants(eventId, { page: currentPage, limit: itemsPerPage }),
      EventService.getEventById(eventId),
    ])
      .then(([partsRes, eventRes]) => {
        if (eventRes.status === "fulfilled" && eventRes.value) {
          const evt = eventRes.value?.data || (eventRes.value as any);
          if (evt) {
            setEventTitle(evt.title || evt.eventName || "Event Details");
            if (evt.coverImageUrl) setEventCoverUrl(evt.coverImageUrl);
            if (evt.distanceType) setEventDistance(evt.distanceType);
          }
        }

        if (partsRes.status === "fulfilled" && partsRes.value) {
          const data = partsRes.value?.data;
          const evtInfo = data?.event as any;
          if (evtInfo?.title && !eventTitle) {
            setEventTitle(`${evtInfo.title} - Participants`);
          }
          if (evtInfo?.coverImageUrl && !eventCoverUrl) {
            setEventCoverUrl(evtInfo.coverImageUrl);
          }
          if (Array.isArray(data?.participants) && data.participants.length > 0) {
            setParticipants(data.participants);
            setTotalItems(data.pagination?.total || data.participants.length);
            return;
          }
        }

        // Fallback demo participant data
        const adapted = membersData.slice(0, 5).map((m, idx) => ({
          id: String(m.id),
          submissionId: `sub-${idx + 1}`,
          name: m.name,
          initials: m.initials,
          email: `${m.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          avatarUrl: undefined,
          joinDate: m.joinDate,
          distanceKm: parseFloat(m.totalDistance.replace(/[^0-9.]/g, "")) || 10,
          submissionStatus: m.status === "Active" ? "APPROVED" : "PENDING",
          duration: 45,
          pace: "5:20 min/km",
        }));
        setParticipants(adapted);
        setTotalItems(adapted.length);
      })
      .catch((err) => {
        console.warn("Failed to load event details/participants:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [eventId, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const columns = [
    {
      label: (
        <span className="inline-flex text-white items-center gap-1 font-semibold">
          Member
        </span>
      ),
      accessor: "name",
      width: "260px",
      formatter: (_: string, row: EventParticipant) => (
        <Link
          href={`/dashboard/members/${row.id}`}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-black bg-primaryColor">
            {row.initials}
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
        <span className="inline-flex text-white items-center gap-1 font-semibold">
          Registered Date
        </span>
      ),
      accessor: "joinDate",
      width: "160px",
      formatter: (value: string) => (
        <span className="text-descriptionColor text-sm">{value}</span>
      ),
    },
    {
      label: (
        <span className="inline-flex text-white items-center w-full font-semibold">
          Submission Status
        </span>
      ),
      accessor: "submissionStatus",
      width: "150px",
      formatter: (value: string) => {
        const isApproved = value === "APPROVED" || value === "Active";
        const isPending = value === "PENDING";
        return (
          <div className="flex">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                isApproved
                  ? "bg-primaryColor/20 text-primaryColor border border-primaryColor/30"
                  : isPending
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {value}
            </span>
          </div>
        );
      },
    },
    {
      label: (
        <span className="inline-flex text-white items-center gap-1 font-semibold">
          Distance
        </span>
      ),
      accessor: "distanceKm",
      width: "150px",
      formatter: (value: number) => (
        <div className="flex items-center gap-1.5 text-white/90 font-medium">
          <span>{value} km</span>
        </div>
      ),
    },
    {
      label: (
        <span className="inline-flex text-white items-center gap-1 font-semibold">
          Pace
        </span>
      ),
      accessor: "pace",
      width: "140px",
      formatter: (value?: string) => (
        <span className="text-descriptionColor text-sm">{value || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 text-xs text-descriptionColor">
          <FiUsers className="h-4 w-4 text-primaryColor" />
          <span>{totalItems} Registered Participants</span>
        </div>
      </div>

      {/* Event Cover Banner */}
      {eventCoverUrl && (
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-borderColor bg-[#070a03] shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={eventCoverUrl}
            alt={eventTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a03] via-transparent to-black/40" />
          <div className="absolute bottom-4 left-4 z-10 space-y-1">
            {eventDistance && (
              <span className="px-3 py-1 bg-primaryColor text-black font-bold text-xs rounded-full shadow-md">
                {eventDistance}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
              {eventTitle}
            </h2>
          </div>
        </div>
      )}

      {!eventCoverUrl && (
        <div className="mb-2">
          <h3 className="text-xl font-bold text-white tracking-wide">{eventTitle}</h3>
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-2xl border border-borderColor backdrop-blur-md shadow-2xl shadow-black/80 bg-[#070a03]">
        <div className="relative z-10">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-zinc-800/40 rounded-lg" />
              ))}
            </div>
          ) : (
            <DynamicTable
              columns={columns}
              data={participants}
              border={false}
              noDataMessage="No participants have registered for this event yet."
            />
          )}

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
      </div>
    </div>
  );
}
