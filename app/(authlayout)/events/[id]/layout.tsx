"use client";
import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
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
import { useEventById } from "@/graphql/actions/events";
import { Loader2 } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

const tabItems = [
  { key: "general-info", label: "General Info" },
  // { key: "ticketing", label: "Ticketing" },
  // { key: "registration", label: "Registration" },
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
  { key: "reported-items", label: "Reported Items" },
  { key: "audit-log", label: "Audit Log" },
];

function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string>("general-info");
  const router = useRouter();
  const pathname = usePathname();
  const eventId = pathname?.split("/")[2];
  const basePath = `/events/${eventId}`;
  const currentTab = pathname === basePath || pathname === `${basePath}/`
    ? "general-info"
    : pathname?.replace(`${basePath}/`, "") || active;

  const { data, loading } = useEventById(eventId || "");

  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

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
          <div className="flex items-center gap-4">
            {data?.getEventById?.cover && (
              <img 
                src={`https://cdn.thrico.network/${data.getEventById.cover}`} 
                alt={data.getEventById.title || "Event Cover"} 
                className="w-12 h-12 rounded-md object-cover border border-border"
              />
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">
                  {loading ? `Loading ${singularName}...` : data?.getEventById?.title || `${singularName} Management`}
                </h1>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                {!loading && data?.getEventById?.status && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground rounded-full">
                    {data?.getEventById?.status}
                  </span>
                )}
              </div>
              {!loading && data?.getEventById && (
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  {data.getEventById.startDate && (
                    <span>
                      {new Date(data.getEventById.startDate).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {data.getEventById.startTime ? ` • ${data.getEventById.startTime}` : ''}
                    </span>
                  )}
                  {data.getEventById.startDate && data.getEventById.location?.name && <span>|</span>}
                  {data.getEventById.location?.name && (
                    <span className="truncate max-w-[300px]">
                      {data.getEventById.location.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
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
                    <BreadcrumbLink href="/events">{moduleName}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{singularName} Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Tabs
                value={currentTab}
                onValueChange={(key) => {
                  const eventId = pathname?.split("/")[2];
                  if (key === "general-info") {
                    router.push(`/events/${eventId}`);
                  } else {
                    router.push(`/events/${eventId}/${key}`);
                  }
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

export default withModulePermission(EventsLayout, "EVENTS", "canRead");
