"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { StatsCard } from "@/components/members/dashboard/stats-card";
import { NavTabs } from "@/components/shared/nav-tabs";
import {
  CheckCircle,
  Clock,
  Flag,
  List,
  PauseCircle,
  StopCircle,
  XCircle,
} from "lucide-react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All",
      icon: <List className="h-4 w-4" />,
      href: "/members/all",
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle className="h-4 w-4" />,
      href: "/members/approved",
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
      href: "/members/pending",
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <PauseCircle className="h-4 w-4" />,
      href: "/members/disabled",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle className="h-4 w-4" />,
      href: "/members/rejected",
    },
    {
      key: "flagged",
      label: "Flagged",
      icon: <Flag className="h-4 w-4" />,
      href: "/members/flagged",
    },
    {
      key: "blocked",
      label: "Blocked",
      icon: <StopCircle className="h-4 w-4" />,
      href: "/members/blocked",
    },
  ];

  const pathname = usePathname();
  const activeTab = pathname.replace("/members/", "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <NavTabs items={items} activeKey={activeTab} />
      </div>
      <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {children}
      </div>
    </div>
  );
}

export default RootLayout;
