import { MemberRecord } from "@/components/Dashboard/memberPage/MembersTable";
import ch1 from "@/public/image/challenge/ch1.png";
import ch2 from "@/public/image/challenge/ch2.png";
import ch3 from "@/public/image/challenge/ch3.png";
import img1 from "@/public/image/dashboard/img1.png";
import img2 from "@/public/image/dashboard/img2.png";
import img3 from "@/public/image/dashboard/img3.png";
import img4 from "@/public/image/dashboard/img4.png";
import img5 from "@/public/image/dashboard/img5.png";
import event1 from "@/public/image/event/event1.png";
import event2 from "@/public/image/event/event2.png";
import event3 from "@/public/image/event/event3.png";
import event4 from "@/public/image/event/event4.png";
import event5 from "@/public/image/event/event5.png";
import event6 from "@/public/image/event/event6.png";
import { StaticImageData } from "next/image";
export const recentSubmissionsData = [
  {
    id: 1,
    activity: img1,
    member: "Rafi Ahmed",
    date: "Aug 21",
    status: "Pending",
  },
  {
    id: 2,
    activity: img2,
    member: "Nadia Islam",
    date: "Aug 21",
    status: "Approved",
  },
  {
    id: 3,
    activity: img3,
    member: "Tanvir Hossain",
    date: "Aug 20",
    status: "Pending",
  },
  {
    id: 4,
    activity: img4,
    member: "Sumaiya Khanam",
    date: "Aug 20",
    status: "Rejected",
  },
  {
    id: 5,
    activity: img5,
    member: "Omar Faruq",
    date: "Aug 19",
    status: "Approved",
  },
];

export const membersData: MemberRecord[] = [
  {
    id: 1,
    name: "Rafi Ahmed",
    avatarBg: "bg-[#2563eb]",
    initials: "RA",
    joinDate: "Jan 12, 2025",
    totalDistance: "284 km",
    events: 8,
    badges: 5,
    email: "rafi.ahmed@email.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Nadia Islam",
    avatarBg: "bg-[#7c3aed]",
    initials: "NI",
    joinDate: "Feb 3, 2025",
    totalDistance: "512 km",
    events: 14,
    email: "nadia.islam@email.com",
    badges: 9,
    status: "Active",
  },
  {
    id: 3,
    name: "Tanvir Hossain",
    avatarBg: "bg-[#db2777]",
    initials: "TH",
    joinDate: "Mar 18, 2025",
    totalDistance: "97 km",
    events: 3,
    email: "tanvir.hossain@email.com",
    badges: 2,
    status: "Active",
  },
  {
    id: 4,
    name: "Sumaiya Khanam",
    avatarBg: "bg-[#d97706]",
    initials: "SK",
    joinDate: "Apr 5, 2025",
    totalDistance: "341 km",
    email: "sumaiya.khanam@email.com",
    events: 10,
    badges: 6,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Omar Faruq",
    avatarBg: "bg-[#0d9488]",
    initials: "OF",
    joinDate: "Apr 21, 2025",
    totalDistance: "178 km",
    email: "omar.faruq@email.com",
    events: 6,
    badges: 4,
    status: "Active",
  },
  {
    id: 6,
    name: "Fahmida Akter",
    avatarBg: "bg-[#dc2626]",
    initials: "FA",
    joinDate: "May 7, 2025",
    totalDistance: "63 km",
    email: "fahmida.akter@email.com",
    events: 2,
    badges: 1,
    status: "Inactive",
  },
  {
    id: 7,
    name: "Tanvir Hossain",
    avatarBg: "bg-[#db2777]",
    initials: "TH",
    joinDate: "Mar 18, 2025",
    totalDistance: "97 km",
    email: "tanvir.hossain@email.com",
    events: 3,
    badges: 2,
    status: "Active",
  },
  {
    id: 8,
    name: "Tanvir Hossain",
    avatarBg: "bg-[#db2777]",
    initials: "TH",
    joinDate: "Mar 18, 2025",
    totalDistance: "97 km",
    events: 3,
    email: "tanvir.hossain@email.com",
    badges: 2,
    status: "Active",
  },
  {
    id: 9,
    name: "Tanvir Hossain",
    avatarBg: "bg-[#db2777]",
    initials: "TH",
    joinDate: "Mar 18, 2025",
    totalDistance: "97 km",
    email: "tanvir.hossain@email.com",
    events: 3,
    badges: 2,
    status: "Active",
  },
  {
    id: 10,
    name: "Tanvir Hossain",
    avatarBg: "bg-[#db2777]",
    initials: "TH",
    joinDate: "Mar 18, 2025",
    email: "tanvir.hossain@email.com",
    totalDistance: "97 km",
    events: 3,
    badges: 2,
    status: "Active",
  },
];

interface ActivityRecord {
  id: number;
  date: string;
  type: "Running" | "Walking" | "Cycling";
  distance: string;
  duration: string;
  pace: string;
}

export const ACTIVITY_DATA: ActivityRecord[] = [
  {
    id: 1,
    date: "Aug 21, 2025",
    type: "Running",
    distance: "12.4 km",
    duration: "1h 08m",
    pace: "5:30/km",
  },
  {
    id: 2,
    date: "Aug 18, 2025",
    type: "Walking",
    distance: "6.2 km",
    duration: "58m",
    pace: "9:22/km",
  },
  {
    id: 3,
    date: "Aug 14, 2025",
    type: "Cycling",
    distance: "28.0 km",
    duration: "1h 24m",
    pace: "3:00/km",
  },
  {
    id: 4,
    date: "Aug 10, 2025",
    type: "Running",
    distance: "10.1 km",
    duration: "55m",
    pace: "5:27/km",
  },
  {
    id: 5,
    date: "Aug 5, 2025",
    type: "Running",
    distance: "8.5 km",
    duration: "47m",
    pace: "5:32/km",
  },
];

export interface SubmissionDetailRecord {
  id: number;
  member: string;
  icon: string | StaticImageData;
  submittedAt: string;
  event: string;
  distance: string;
  date: string;
  duration: string;
  stravaImage?: string;
  gpsImage?: string;
  postedOnTikTok: boolean;
  taggedClub: boolean;
  usedHashtag: boolean;
}

export const SUBMISSION_DETAILS_DATA: SubmissionDetailRecord[] = [
  {
    id: 1,
    member: "Rafi Ahmed",
    icon: img1,
    submittedAt: "August 21, 2025 · 9:42 AM",
    event: "Run For Life 2026",
    distance: "12.4 km",
    date: "August 21, 2025",
    duration: "1h 08m",
    postedOnTikTok: true,
    taggedClub: true,
    usedHashtag: true,
  },
  {
    id: 2,
    member: "Tanvir Hossain",
    icon: img2,
    submittedAt: "August 20, 2025 · 10:15 AM",
    event: "5K Community Run",
    distance: "5.0 km",
    date: "August 20, 2025",
    duration: "28m 14s",
    postedOnTikTok: true,
    taggedClub: true,
    usedHashtag: true,
  },
  {
    id: 3,
    member: "Shakib Rahman",
    icon: img3,
    submittedAt: "August 18, 2025 · 6:30 PM",
    event: "Run For Life 2026",
    distance: "10.1 km",
    date: "August 18, 2025",
    duration: "55m 40s",
    postedOnTikTok: true,
    taggedClub: false,
    usedHashtag: true,
  },
];

export interface EventChallengeCardItem {
  id: number;
  title: string;
  date?: string;
  category?: string;
  registeredCount?: number | string;
  status: "Published" | "Draft" | "Active" | "Ended" | "draft" | string;
  image: string | StaticImageData;
  logoText?: string;
  editUrl?: string;
  scope?: "Community-wide" | "Individual" | string;
  subtitle?: string;
  currentProgress?: number;
  targetProgress?: number;
  progressUnit?: string;
  progressText?: string;
}

export type ChallengeCardItem = EventChallengeCardItem;

export const EVENTS_CHALLENGES_DATA: EventChallengeCardItem[] = [
  {
    id: 1,
    title: "Run For Life 2026",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "142",
    status: "Published",
    image: event1,
    logoText: "FMC",
    editUrl: "/admin/events/1/edit",
  },
  {
    id: 2,
    title: "5K Community Run",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "5K Community Run",
    status: "Published",
    image: event2,
    logoText: "FMC",
    editUrl: "/admin/events/2/edit",
  },
  {
    id: 3,
    title: "Run For Life 2026",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "142",
    status: "Published",
    image: event3,
    logoText: "FMC",
    editUrl: "/admin/events/3/edit",
  },
  {
    id: 4,
    title: "Run For Life 2026",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "142",
    status: "Published",
    image: event4,
    logoText: "FMC",
    editUrl: "/admin/events/4/edit",
  },
  {
    id: 5,
    title: "Run For Life 2026",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "142",
    status: "Published",
    image: event5,
    logoText: "FMC",
    editUrl: "/admin/events/5/edit",
  },
  {
    id: 6,
    title: "Run For Life 2026",
    date: "Sep 10, 2026",
    category: "10K",
    registeredCount: "142",
    status: "Published",
    image: event6,
    logoText: "FMC",
    editUrl: "/admin/events/6/edit",
  },
];
export const CHALLENGES_DATA: EventChallengeCardItem[] = [
  {
    id: 1,
    title: "Run Around the World",
    scope: "Community-wide",
    category: "Community-wide",
    status: "Active",
    image: ch1,
    currentProgress: 342,
    targetProgress: 500,
    progressUnit: "km",
    progressText: "342/500 km",
    date: "Sep 10, 2026",
    registeredCount: "142",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/1",
  },
  {
    id: 2,
    title: "August Sprint Challenge",
    scope: "Individual",
    category: "Individual",
    status: "Active",
    image: ch2,
    subtitle: "Individual challenge",
    date: "Aug 15, 2026",
    registeredCount: "98",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/2",
  },
  {
    id: 3,
    title: "100-Day Streak",
    scope: "Community-wide",
    category: "Community-wide",
    status: "Ended",
    image: ch3,
    subtitle: "Individual challenge",
    date: "Jul 01, 2026",
    registeredCount: "215",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/3",
  },
  {
    id: 4,
    title: "Winter Miles 2025",
    scope: "Community-wide",
    category: "Community-wide",
    status: "draft",
    image: ch1,
    currentProgress: 0,
    targetProgress: 500,
    progressUnit: "km",
    progressText: "0/500 km",
    date: "Dec 01, 2025",
    registeredCount: "0",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/4",
  },
  {
    id: 5,
    title: "Winter Miles 2025",
    scope: "Community-wide",
    category: "Community-wide",
    status: "draft",
    image: ch1,
    currentProgress: 0,
    targetProgress: 500,
    progressUnit: "km",
    progressText: "0/500 km",
    date: "Dec 01, 2025",
    registeredCount: "0",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/5",
  },
  {
    id: 6,
    title: "Winter Miles 2025",
    scope: "Community-wide",
    category: "Community-wide",
    status: "draft",
    image: ch1,
    currentProgress: 0,
    targetProgress: 500,
    progressUnit: "km",
    progressText: "0/500 km",
    date: "Dec 01, 2025",
    registeredCount: "0",
    logoText: "FMC",
    editUrl: "/dashboard/challenges/6",
  },
];
