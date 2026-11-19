"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Country } from "country-state-city";
import DynamicTable from "@/components/reusable/DynamicTable";
import { Skeleton } from "@/components/ui/skeleton";
import badge1 from "@/public/image/badge/badge1.png";
import badge2 from "@/public/image/badge/badge2.png";
import badge6 from "@/public/image/badge/badge6.png";
import badge7 from "@/public/image/badge/badge7.png";
import {
  ChallengeService,
  MilestoneDestination,
} from "@/service/event/challenge.service";

const staticBadgeIcons: Record<string, any> = {
  BD: badge1,
  IN: badge2,
  NP: badge6,
  CN: badge7,
  IT: badge1,
  FR: badge2,
  JP: badge7,
};

export interface DestinationRequirement {
  id: number;
  destination: string;
  countryCode: string;
  distanceRequired: string;
  badge: any;
  badgeAlt: string;
  status: "Unlocked" | "Current" | "Locked";
  unlockDate: string;
}

export const DESTINATIONS_REQUIREMENTS_DATA: DestinationRequirement[] = [
  {
    id: 1,
    destination: "Bangladesh",
    countryCode: "BD",
    distanceRequired: "0 km",
    badge: badge1,
    badgeAlt: "Bangladesh Star Medal",
    status: "Unlocked",
    unlockDate: "Aug 1, 2025",
  },
  {
    id: 2,
    destination: "India",
    countryCode: "IN",
    distanceRequired: "500 km",
    badge: badge2,
    badgeAlt: "India Silver Medal",
    status: "Unlocked",
    unlockDate: "Aug 10, 2025",
  },
  {
    id: 3,
    destination: "Nepal",
    countryCode: "NP",
    distanceRequired: "1,000 km",
    badge: badge6,
    badgeAlt: "Nepal Gold Medal",
    status: "Locked",
    unlockDate: "Not yet reached",
  },
  {
    id: 4,
    destination: "China",
    countryCode: "CN",
    distanceRequired: "2,500 km",
    badge: badge7,
    badgeAlt: "China Trophy",
    status: "Locked",
    unlockDate: "Not yet reached",
  },
];

export default function ChallengeDestinationsTable() {
  const params = useParams();
  const challengeId = params?.id as string;

  const [data, setData] = useState<DestinationRequirement[]>(DESTINATIONS_REQUIREMENTS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    ChallengeService.getDestinations(challengeId)
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as any)?.data?.destinations ?? (res as any)?.destinations ?? [];
        if (Array.isArray(list) && list.length > 0) {
          const adapted: DestinationRequirement[] = list.map((item: MilestoneDestination) => ({
            id: item.id,
            destination: item.destination,
            countryCode: item.countryCode,
            distanceRequired: item.distanceRequired,
            badge: staticBadgeIcons[item.countryCode] || badge1,
            badgeAlt: item.badgeName || `${item.destination} Medal`,
            status: item.status,
            unlockDate: item.unlockDate || "Pending milestone",
          }));
          setData(adapted);
        } else {
          setData(DESTINATIONS_REQUIREMENTS_DATA);
        }
      })
      .catch((err) => {
        console.warn("Failed to load destinations:", err);
        setData(DESTINATIONS_REQUIREMENTS_DATA);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [challengeId]);

  const columns = [
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Destination
        </span>
      ),
      accessor: "destination",
      width: "25%",
      formatter: (_: string, row: DestinationRequirement) => {
        const country =
          Country.getCountryByCode(row.countryCode) ||
          Country.getAllCountries().find(
            (c) => c.name.toLowerCase() === row.destination.toLowerCase()
          );
        const isoCode = (
          country?.isoCode ||
          row.countryCode ||
          ""
        ).toLowerCase();
        const flagImgUrl = isoCode
          ? `https://flagcdn.com/w40/${isoCode}.png`
          : "";

        return (
          <div className="flex items-center gap-2.5 py-2">
            <span className="text-sm font-bold text-white tracking-wide">
              {row.destination}
            </span>
            {flagImgUrl ? (
              <Image
                src={flagImgUrl}
                alt={`${row.destination} flag`}
                width={20}
                height={15}
                className="h-3.5 w-5 object-cover rounded-[2px] shadow-xs select-none inline-block"
              />
            ) : (
              <span className="text-base leading-none select-none">
                {country?.flag}
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Distance Required
        </span>
      ),
      accessor: "distanceRequired",
      width: "22%",
      formatter: (value: string) => (
        <span className="text-sm text-descriptionColor font-medium py-2 inline-block">
          {value}
        </span>
      ),
    },
    {
      label: (
        <div className="text-center w-full">
          <span className="font-semibold uppercase tracking-wider text-xs text-white">
            Badge
          </span>
        </div>
      ),
      accessor: "badge",
      width: "15%",
      formatter: (value: any, row: DestinationRequirement) => (
        <div className="flex items-center justify-center py-2">
          <Image
            src={value}
            alt={row.badgeAlt}
            width={28}
            height={28}
            className="h-7 w-7 object-contain drop-shadow"
          />
        </div>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Status
        </span>
      ),
      accessor: "status",
      width: "18%",
      formatter: (value: string) => (
        <div className="py-2">
          {value === "Unlocked" ? (
            <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold bg-primaryColor/15 text-primaryColor border border-primaryColor/30">
              Unlocked
            </span>
          ) : value === "Current" ? (
            <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              Current Target
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold bg-zinc-800 text-descriptionColor border border-zinc-700">
              Locked
            </span>
          )}
        </div>
      ),
    },
    {
      label: (
        <span className="font-semibold uppercase tracking-wider text-xs text-white">
          Unlock Date
        </span>
      ),
      accessor: "unlockDate",
      width: "20%",
      formatter: (value: string) => (
        <div className="py-2">
          <span className="text-descriptionColor font-normal text-sm">
            {value}
          </span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-zinc-800/40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <DynamicTable
        columns={columns}
        data={data}
        border={false}
        noDataMessage="No destinations found for this challenge."
      />
    </div>
  );
}
