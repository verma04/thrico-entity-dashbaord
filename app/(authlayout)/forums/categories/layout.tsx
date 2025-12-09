"use client";

import * as React from "react";
import { List, CheckCircle, StopCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Add from "../../../../components/discussion-forum/categories/forum-category-add";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/forums/categories/", "") || "all";

  const handleTabChange = (key: string) => {
    if (key === "all") router.push(`/forums/categories`);
    else router.push(`/forums/categories/${key}`);
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
            <TabsTrigger value="active" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="in-active" className="gap-2">
              <StopCircle className="h-4 w-4" />
              Inactive
            </TabsTrigger>
          </TabsList>
          <Add />
        </div>
        <div className="mt-6">{children}</div>
      </Tabs>
    </div>
  );
}

export default RootLayout;
