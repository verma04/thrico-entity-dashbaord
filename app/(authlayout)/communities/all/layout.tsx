"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle, StopCircle, List } from "lucide-react";
import Create from "../../../../components/communities/add/Create";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/communities/all", "") || "/";

  const onChange = (key: string) => {
    if (key === "/") router.push(`/communities/all`);
    else router.push(`/communities/all${key}`);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 p-4">
        <Tabs value={activeTab} onValueChange={onChange} className="flex-1">
          <TabsList>
            <TabsTrigger value="/" className="gap-2">
              <List className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="/approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="/pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="/disabled" className="gap-2">
              <XCircle className="h-4 w-4" />
              Disabled
            </TabsTrigger>
            <TabsTrigger value="/rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </TabsTrigger>
            <TabsTrigger value="/paused" className="gap-2">
              <StopCircle className="h-4 w-4" />
              Paused
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Create />
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}

export default RootLayout;
