"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, CheckCircle, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import NewPoll from "@/components/polls/new-poll";

function RootLayout({ children }: { children: React.ReactNode }) {
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
  const activeTab = pathname.replace("/polls/", "") || "all";

  const onChange = (value: string) => {
    if (value === "all") router.push(`/polls/`);
    else router.push(`/polls/${value}`);
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
        <NewPoll />
      </div>
      {children}
    </div>
  );
}

export default RootLayout;
