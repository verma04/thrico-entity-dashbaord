"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { List } from "lucide-react";
import NewForm from "@/components/feedback-form/new-feed-back-form";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from URL
  const activeTab =
    pathname === "/forms/polls" || pathname === "/forms/polls/"
      ? "all"
      : pathname.replace("/forms/polls/", "");

  const handleTabChange = (value: string) => {
    if (value === "all") {
      router.push("/forms/polls");
    } else {
      router.push(`/forms/polls/${value}`);
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between border-b pb-2">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All
            </TabsTrigger>

            {/*
            <TabsTrigger value="admin">By Admin</TabsTrigger>
            <TabsTrigger value="user">By User</TabsTrigger>
            */}
          </TabsList>

          {/* Extra content (Right side like antd tabBarExtraContent) */}
          <NewForm />
        </div>
      </Tabs>

      <div className="mt-4">{children}</div>
    </>
  );
}

export default RootLayout;
