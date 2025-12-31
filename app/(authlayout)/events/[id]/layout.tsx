"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";

const tabItems = [
  { key: "general-info", label: "General Info" },
  { key: "hosts", label: "Hosts" },
  { key: "agenda", label: "Agenda" },
  { key: "speakers", label: "Speakers" },
  { key: "sponsors/tier", label: "Sponsorship" },
  { key: "venue/physical", label: "Venue" },
  { key: "attendees", label: "Attendees" },
  { key: "team", label: "Team" },
  { key: "media", label: "Media" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
];

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string>("general-info");
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname?.split("/")[3] || active;

  return (
    <div className="min-h-screen bg-background">
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="p-6">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/events">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Event Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Tabs
            value={currentTab}
            onValueChange={(key) => {
              const eventId = pathname?.split("/")[2];
              router.push(`/events/${eventId}/${key}`);
            }}
            className="w-full"
          >
            <TabsList className="w-full justify-start flex-wrap h-auto">
              {tabItems.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="pt-6">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
