"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCog,
  CalendarDays,
  Briefcase,
  ShoppingBag,
  List,
} from "lucide-react";

import PostModal from "@/components/feed/add-feed";
import { useNumberOfFeeds } from "@/graphql/actions/feed";
import { NavTabs } from "@/components/shared/nav-tabs";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: feed } = useNumberOfFeeds();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/")[2] || "all";

  const items = [
    {
      key: "all",
      label: `All (${feed?.numberOfFeeds ?? 0})`,
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      key: "admin",
      label: "By Admin",
      icon: <UserCog className="h-4 w-4 mr-2" />,
    },
    {
      key: "communities",
      label: "Communities",
      icon: <List className="h-4 w-4 mr-2" />,
    },
    {
      key: "events",
      label: "Events",
      icon: <CalendarDays className="h-4 w-4 mr-2" />,
    },
    {
      key: "jobs",
      label: "Jobs",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
    },
    {
      key: "marketplace",
      label: "Marketplace",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
  ];

  const onChange = (key: string) => {
    router.push(`/feed/${key}`);
  };

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
