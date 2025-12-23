"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MessageSquare, List, BarChart3, Settings } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Feedback & Polls</h1>
          </div>
          <p className="text-muted-foreground">
            Create interactive forms, polls, and surveys to gather feedback.
          </p>
        </div>
        <NewForm />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6 flex-wrap h-auto w-full justify-start gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 bg-muted/50"
          >
            <List className="h-4 w-4" />
            All Forms
          </TabsTrigger>
          {/* Future Tabs Placeholders - matching Mentorship style */}
          <TabsTrigger
            value="analytics"
            disabled
            className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 bg-muted/50 opacity-50 cursor-not-allowed"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            disabled
            className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 bg-muted/50 opacity-50 cursor-not-allowed"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-0 min-h-[400px]">{children}</div>
      </Tabs>
    </div>
  );
}

export default RootLayout;
