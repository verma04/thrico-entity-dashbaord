"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle, List } from "lucide-react";

import AllEvents from "../../../../components/events/all-events";
import { useAllEvents } from "../../../../graphql/actions/events";
import Create from "@/components/events/create/create";

type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

function RootLayout({ children }: { children: React.ReactNode }) {
  const {
    data: eventsData,
    loading,
    error,
  } = useAllEvents({
    variables: {
      input: {},
    },
  });

  const items: TabItem[] = [
    {
      key: "all",
      label: "All",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <XCircle className="h-4 w-4" />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle className="h-4 w-4" />,
    },
  ];

  const router = useRouter();
  const onChange = (key: string) => {};
  const pathname = usePathname();
  const activeTab = pathname.replace("/events/all", "") || "all";

  return (
    <>
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={onChange}>
              <TabsList>
                {items.map((item) => (
                  <TabsTrigger
                    key={item.key}
                    value={item.key}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Create />
          </div>
          <AllEvents data={eventsData?.getAllEvents} loading={loading} />
        </CardContent>
      </Card>
    </>
  );
}

export default RootLayout;
