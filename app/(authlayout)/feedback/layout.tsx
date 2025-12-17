"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NewFormPage from "@/components/feedback-form/new-feed-back-form";



function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/feedback/", "") || "all";

  const onChange = (key: string) => {
    if (key === "all") router.push(`/feedback/`);
    else router.push(`/feedback/${key}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={onChange} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <List className="h-4 w-4" />
                All
              </TabsTrigger>
              {/* Uncomment when needed */}
              {/* <TabsTrigger value="admin" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                By admin
              </TabsTrigger>
              <TabsTrigger value="user" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                By user
              </TabsTrigger> */}
            </TabsList>
            <NewFormPage add={() => {}} />
          </div>
        </Tabs>
      </div>
      {children}
    </div>
  );
}

export default RootLayout;
