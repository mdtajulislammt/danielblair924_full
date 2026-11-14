import badge1 from "@/public/image/badge/badge1.png";
import badge2 from "@/public/image/badge/badge2.png";
import badge3 from "@/public/image/badge/badge3.png";
import badge4 from "@/public/image/badge/badge4.png";
import badge5 from "@/public/image/badge/badge5.png";
import badge6 from "@/public/image/badge/badge6.png";
import badge7 from "@/public/image/badge/badge7.png";
import badge8 from "@/public/image/badge/badge8.png";
import { StaticImageData } from "next/image";

export interface BadgeItem {
  id: string;
  icon: string | StaticImageData;
  title: string;
  description: string;
  isActive: boolean;
  tag: {
    label: string;
    type: "event" | "ratw" | string;
  };
  earnedCount: number;
}

export const BADGES_DATA: BadgeItem[] = [
  {
    id: "first-5k",
    icon: badge1,
    title: "First 5K",
    description: "Awarded for completing your first 5K run.",
    isActive: true,
    tag: { label: "Event", type: "event" },
    earnedCount: 284,
  },
  {
    id: "10k-finisher",
    icon: badge2,
    title: "10K Finisher",
    description: "Awarded for completing a 10K run.",
    isActive: true,
    tag: { label: "Event", type: "event" },
    earnedCount: 156,
  },
  {
    id: "half-marathon",
    icon: badge6,
    title: "Half Marathon",
    description: "Awarded for completing a half marathon.",
    isActive: true,
    tag: { label: "Event", type: "event" },
    earnedCount: 42,
  },
  {
    id: "ratw-participant",
    icon: badge4,
    title: "RATW Participant",
    description: "Awarded for participating in RATW.",
    isActive: true,
    tag: { label: "RATW", type: "ratw" },
    earnedCount: 512,
  },
  {
    id: "ratw-champion",
    icon: badge7,
    title: "RATW Champion",
    description: "Awarded for winning RATW.",
    isActive: true,
    tag: { label: "RATW", type: "ratw" },
    earnedCount: 18,
  },
  {
    id: "consistent-runner",
    icon: badge3,
    title: "Consistent Runner",
    description: "Awarded for running consistently over a month.",
    isActive: true,
    tag: { label: "Event", type: "event" },
    earnedCount: 97,
  },
  {
    id: "speed-demon",
    icon: badge5,
    title: "Speed Demon",
    description: "Awarded for achieving a fast pace.",
    isActive: true,
    tag: { label: "Event", type: "event" },
    earnedCount: 63,
  },
  {
    id: "iron-athlete",
    icon: badge8,
    title: "Iron Athlete",
    description: "Awarded for exceptional endurance.",
    isActive: true,
    tag: { label: "RATW", type: "ratw" },
    earnedCount: 29,
  },
];
