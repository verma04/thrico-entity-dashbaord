"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const tabItems = [
  {
    key: "tier",
    label: "Sponsorship Tiers",
  },
  {
    key: "special-sponsors",
    label: "Special Sponsors",
  },
];

export default function SponsorshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname?.split("/")[4] || "tier";
  const eventId = pathname?.split("/")[2];

  const onTabChange = (key: string) => {
    router.push(`/events/${eventId}/sponsors/${key}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sponsorship</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add {activeTab === "tier" ? "Tier" : "Special Sponsor"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          {tabItems.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  );
}
