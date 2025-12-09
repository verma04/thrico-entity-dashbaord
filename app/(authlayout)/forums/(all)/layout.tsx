"use client";

import * as React from "react";
import { List, CheckCircle, Clock, PauseCircle, XCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "@/components/discussion-forum/post/forum-post";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/forums/", "") || "all";

  const handleTabChange = (key: string) => {
    if (key === "all") router.push(`/forums/all`);
    else router.push(`/forums/${key}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <List className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="disabled" className="gap-2">
              <PauseCircle className="h-4 w-4" />
              Disabled
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>
          <Post />
        </div>
        <div className="mt-6">{children}</div>
      </Tabs>
    </div>
  );
}

export default RootLayout;
