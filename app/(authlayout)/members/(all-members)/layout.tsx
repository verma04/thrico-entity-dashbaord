"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  List,
  CheckCircle,
  Clock,
  XCircle,
  Flag,
  PauseCircle,
  StopCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { StatsCard } from "@/components/members/dashboard/stats-card";

function RootLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <PauseCircle className="h-4 w-4" />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle className="h-4 w-4" />,
    },
    {
      key: "flagged",
      label: "Flagged",
      icon: <Flag className="h-4 w-4" />,
    },
    {
      key: "blocked",
      label: "Blocked",
      icon: <StopCircle className="h-4 w-4" />,
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/members/", "");

  const handleTabChange = (value: string) => {
    if (value === "all") {
      router.push(`/members/all`);
    } else {
      router.push(`/members/${value}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* <StatsCard /> */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start">
          {items.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="gap-2">
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}

export default RootLayout;
