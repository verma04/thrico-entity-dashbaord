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
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabItems = [
  { key: "general-info", label: "General Info" },
  { key: "ticketing", label: "Ticketing" },
  { key: "registration", label: "Registration" },
  { key: "agenda", label: "Agenda" },
  { key: "speakers", label: "Speakers" },
  { key: "sponsors/tier", label: "Sponsorship" },
  { key: "hosts", label: "Hosts" },
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-background overflow-y-auto"
      >
        <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
          <h1 className="text-xl font-bold">Event Management</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/events/all")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 max-w-7xl mx-auto min-h-screen">
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
      </motion.div>
    </AnimatePresence>
  );
}
