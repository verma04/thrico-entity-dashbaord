"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

import { CheckCircle, Clock, XCircle, Ban, List } from "lucide-react";

import { ListingStats } from "@/components/listings/listing-stats";
import { CreateListingDialog } from "@/components/listings/create-listing-dialog";

function RootLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All",
      icon: <List size={16} />,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle size={16} />,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock size={16} />,
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <Ban size={16} />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle size={16} />,
    },
  ];

  const router = useRouter();
  const onChange = (key: string) => {
    if (key === "all") router.push(`/listing/all`);
    else router.push(`/listing/all/${key}`);
  };

  const pathname = usePathname();
  const activeTab =
    pathname.replace("/listing/all/", "") === pathname
      ? "all"
      : pathname.replace("/listing/all/", "");

  return (
    <>
      <ListingStats />
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={onChange} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  {items.map((item) => (
                    <TabsTrigger
                      key={item.key}
                      value={item.key}
                      className="gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <CreateListingDialog />
              </div>
            </Tabs>
          </div>
          {children}
        </CardContent>
      </Card>
    </>
  );
}

export default RootLayout;
