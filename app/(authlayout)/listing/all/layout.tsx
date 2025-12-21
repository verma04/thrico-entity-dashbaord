"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

import { CheckCircle, Clock, XCircle, Ban, List } from "lucide-react";
import { ListingStats } from "@/components/listings/listing-stats";
import { CreateListingDialog } from "@/components/listings/create-listing-dialog";


function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.includes("/approved")
    ? "approved"
    : pathname.includes("/pending")
    ? "pending"
    : pathname.includes("/disabled")
    ? "disabled"
    : pathname.includes("/rejected")
    ? "rejected"
    : "all";

  const handleTabChange = (value: string) => {
    if (value === "all") router.push(`/listing/all`);
    else router.push(`/listing/all/${value}`);
  };

  return (
    <>
      <ListingStats/>
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  <List className="w-4 h-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="disabled" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Disabled
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <Ban className="w-4 h-4" />
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          <CreateListingDialog/>
          </div>
          {children}
        </div>
      </Card>
    </>
  );
}

export default RootLayout;
