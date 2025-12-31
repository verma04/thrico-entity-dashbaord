"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Video, Network } from "lucide-react";

const tabItems = [
  {
    key: "physical",
    label: "Physical Venue",
    icon: MapPin,
  },
  {
    key: "virtual",
    label: "Virtual Link",
    icon: Video,
  },
  {
    key: "hybrid",
    label: "Hybrid Mapping",
    icon: Network,
  },
];

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname?.split("/")[4] || "physical";
  const eventId = pathname?.split("/")[2];

  const onTabChange = (key: string) => {
    router.push(`/events/${eventId}/venue/${key}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Venue</h2>

      <Tabs value={currentTab} onValueChange={onTabChange}>
        <TabsList>
          {tabItems.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  );
}
