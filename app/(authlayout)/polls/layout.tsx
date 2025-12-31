"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, CheckCircle, User, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import NewPoll from "@/components/polls/new-poll";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "admin",
      label: "By admin",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      key: "user",
      label: "By user",
      icon: <User className="h-4 w-4" />,
    },
  ];

  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab
  const getActiveTab = () => {
    if (pathname.includes("/settings")) return "settings";
    if (pathname.includes("/admin")) return "admin";
    if (pathname.includes("/user")) return "user";
    return "all";
  };

  const activeTab = getActiveTab();

  const onChange = (value: string) => {
    switch (value) {
      case "all":
        router.push("/polls");
        break;
      case "settings":
        router.push("/polls/settings");
        break;
      default:
        router.push(`/polls/${value}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={onChange}>
          <TabsList>
            {items.map((item) => (
              <TabsTrigger key={item.key} value={item.key} className="gap-2">
                {item.icon}
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {!pathname.includes("/settings") && <NewPoll />}
      </div>
      {children}
    </div>
  );
}

export default PollsLayout;
