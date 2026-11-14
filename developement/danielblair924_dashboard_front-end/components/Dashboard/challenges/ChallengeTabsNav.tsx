"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function ChallengeTabsNav({ id: propId }: { id?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const id = propId || (params?.id as string);

  const menue = [
    { name: "Overview", href: `/dashboard/challenges/${id}` },
    {
      name: "Destinations",
      href: `/dashboard/challenges/${id}/requirements`,
    },
    {
      name: "Participants",
      href: `/dashboard/challenges/${id}/participants`,
    },
  ];

  return (
    <div className="border-b border-borderColor flex gap-6 px-4">
      {menue.map((item, index) => {
        const isActive =
          item.href === `/dashboard/challenges/${id}`
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={index}
            href={item.href}
            className={`py-3 px-2 text-base font-bold transition -mb-px border-b-2 ${
              isActive
                ? "text-primaryColor border-primaryColor"
                : "text-white border-transparent hover:text-primaryColor"
            }`}>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
