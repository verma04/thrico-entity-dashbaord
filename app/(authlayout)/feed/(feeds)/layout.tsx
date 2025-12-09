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
    <Card className="mt-8">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <Tabs value={activeTab} onValueChange={onChange} className="w-full">
          <TabsList className="flex gap-2">
            {items.map((item) => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                {item.icon}
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-4">
          <PostModal />
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

export default RootLayout;
