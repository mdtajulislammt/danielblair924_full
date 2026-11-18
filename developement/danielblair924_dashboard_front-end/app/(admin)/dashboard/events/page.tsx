"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiSearch, FiRefreshCw } from "react-icons/fi";
import { TiPlus } from "react-icons/ti";
import mainLogo from "@/public/image/mainLogo.png";
import event1 from "@/public/image/event/event1.png";
import event2 from "@/public/image/event/event2.png";
import event3 from "@/public/image/event/event3.png";
import event4 from "@/public/image/event/event4.png";
import event5 from "@/public/image/event/event5.png";
import event6 from "@/public/image/event/event6.png";
import { EventItem, EventService } from "@/service/event/event.service";
import { EVENTS_CHALLENGES_DATA } from "@/public/demoData/DemoData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const defaultImages = [event1, event2, event3, event4, event5, event6];

export default function EventsPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.getEvents();
      const items: EventItem[] = response?.data?.items || response?.items || response || [];
      setEvents(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error("Backend events fetch error:", err?.message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchSearch =
        searchQuery === "" ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.distanceType && evt.distanceType.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        selectedStatus === "ALL" ||
        evt.status?.toUpperCase() === selectedStatus.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [events, searchQuery, selectedStatus]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return dateStr;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 items-start md:flex-row justify-between md:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Events</h2>
          <p className="text-xs text-descriptionColor mt-0.5">
            Manage upcoming running events, distances, and registered participants
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-descriptionColor h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-borderColor bg-[#0a0f04]/80 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-primaryColor focus:outline-none transition-colors"
            />
          </div>

          {/* Create Event Button */}
          {isAdmin && (
            <Link
              href="/dashboard/events/new/edite"
              className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-primaryColor rounded-lg text-black font-bold text-sm hover:opacity-90 transition shadow-md shadow-primaryColor/20 shrink-0"
            >
              <TiPlus className="text-lg" /> Create Event
            </Link>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "ACTIVE", "PUBLISHED", "DRAFT", "COMPLETED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              selectedStatus === st
                ? "bg-primaryColor/20 text-primaryColor border border-primaryColor/40"
                : "bg-bgColor/60 text-descriptionColor border border-borderColor hover:text-white"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] p-4 space-y-4 h-64"
            >
              <Skeleton className="h-32 w-full rounded-xl bg-zinc-800/40" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-zinc-800/50" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800/40" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center space-y-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primaryColor/20 text-primaryColor text-xs font-bold hover:bg-primaryColor/30 cursor-pointer"
          >
            <FiRefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-borderColor bg-[#070a03]/80 p-12 text-center space-y-4">
          <p className="text-base font-semibold text-white">No events found</p>
          <p className="text-xs text-descriptionColor max-w-sm mx-auto">
            {searchQuery
              ? `No events match "${searchQuery}". Clear your search or create a new event.`
              : "No events are currently scheduled. Get started by creating your first running event!"}
          </p>
          {isAdmin && (
            <Link
              href="/dashboard/events/new/edite"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primaryColor text-black font-bold text-xs hover:opacity-90 transition"
            >
              <TiPlus className="text-base" /> Create First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((item, index) => {
            const rawCover = item.coverImageUrl;
            const displayImg =
              rawCover &&
              (rawCover.startsWith("http") ||
                rawCover.startsWith("/") ||
                rawCover.startsWith("blob:"))
                ? rawCover
                : defaultImages[index % defaultImages.length];

            const statusUpper = (item.status || "PUBLISHED").toUpperCase();

            return (
              <div
                key={item.id}
                className="group relative w-full overflow-hidden rounded-2xl border border-borderColor bg-[#070a03] min-h-[340px] flex flex-col justify-between"
              >
                {/* Background Image / Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={displayImg}
                    alt={item.title}
                    fill
                    unoptimized={typeof displayImg === "string"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a03] via-transparent to-black/60" />
                </div>

                {/* Top Overlay: Status Badge and Brand Logo */}
                <div className="absolute top-0 left-0 w-full p-4 z-10 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md shadow-md ${
                      statusUpper === "ACTIVE" || statusUpper === "PUBLISHED"
                        ? "bg-primaryColor text-black shadow-[#84cc16]/20"
                        : statusUpper === "COMPLETED"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-zinc-800/80 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {item.status || "Published"}
                  </span>

                  <div className="w-10 h-10 relative">
                    <Image
                      src={mainLogo}
                      alt="First Mile Club"
                      fill
                      className="object-contain drop-shadow"
                    />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="p-4 z-10 flex items-end justify-between gap-3 bg-[#070a03]/90">
                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/dashboard/events/${item.id}`}
                      className="text-base md:text-lg font-semibold tracking-wide text-white hover:text-primaryColor transition line-clamp-1 block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-descriptionColor">
                      {formatDate(item.eventDate)} · {item.distanceType || item.category || "General"}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1 text-xs text-descriptionColor">
                      <FiUser className="h-4 w-4 text-primaryColor" />
                      <span>
                        {item.registeredCount || 0} registered
                      </span>
                    </div>
                  </div>

                  {/* Action Link: Edit for Admin, View for Member */}
                  {isAdmin ? (
                    <Link
                      href={`/dashboard/events/${item.id}/edite`}
                      className="inline-flex items-center gap-1 rounded-lg border border-primaryColor bg-[#121c08]/80 px-3 py-1.5 text-xs font-bold text-primaryColor backdrop-blur-sm transition hover:bg-primaryColor hover:text-black cursor-pointer shrink-0"
                    >
                      <span>Edit</span>
                      <span>&rarr;</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/events/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-lime-700/60 bg-[#121c08]/80 px-3 py-1.5 text-xs font-bold text-stone-300 backdrop-blur-sm transition hover:bg-primaryColor hover:text-black cursor-pointer shrink-0"
                    >
                      <span>View</span>
                      <span>&rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
