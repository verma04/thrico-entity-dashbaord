"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { List, CheckCircle, Clock, XCircle } from "lucide-react";

import Stats from "@/components/jobs/stats";
import Create from "@/components/jobs/create/create-job";

function RootLayout({ children }: { children: React.ReactNode }) {
  const tabList = [
    { key: "all", label: "All", icon: <List className="w-4 h-4 mr-2" /> },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle className="w-4 h-4 mr-2" />,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock className="w-4 h-4 mr-2" />,
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <XCircle className="w-4 h-4 mr-2" />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle className="w-4 h-4 mr-2" />,
    },
  ];
  const router = useRouter();
  const onChange = (key: string) => {
    if (key === "all") router.push(`/jobs/all`);
    else router.push(`/jobs/all/${key}`);
  };
  const pathname = usePathname();
  const activeTab = pathname.replace("/jobs/all", "") || "all";

  return (
    <>
      <Stats />

      <div className="flex items-center justify-between mb-4">
        <Tabs value={activeTab} onValueChange={onChange} className="w-full">
          <TabsList className="w-full">
            {tabList.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="flex items-center"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-4">
          <Create />
        </div>
      </div>
      {children}
    </>
  );
}

export default RootLayout;
