"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Clock,
  Mic,
  Award,
  UserCheck,
  MapPin,
  Users,
  ShieldCheck,
  Image as ImageIcon,
  BarChart3,
  Settings,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useEventById } from "@/graphql/actions/events";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "general-info", label: "General Info", icon: Calendar, path: "" },
  { key: "agenda", label: "Agenda", icon: Clock, path: "agenda" },
  { key: "speakers", label: "Speakers", icon: Mic, path: "speakers" },
  { key: "sponsors", label: "Sponsorship", icon: Award, path: "sponsors/tier" },
  { key: "hosts", label: "Hosts", icon: UserCheck, path: "hosts" },
  { key: "venue", label: "Venue", icon: MapPin, path: "venue/physical" },
  { key: "attendees", label: "Attendees", icon: Users, path: "attendees" },
  { key: "team", label: "Team", icon: ShieldCheck, path: "team" },
  { key: "media", label: "Media", icon: ImageIcon, path: "media" },
  { key: "analytics", label: "Analytics", icon: BarChart3, path: "analytics" },
  { key: "settings", label: "Settings", icon: Settings, path: "settings" },
  {
    key: "reported-items",
    label: "Reported Items",
    icon: ShieldAlert,
    path: "reported-items",
  },
  { key: "audit-log", label: "Audit Log", icon: Activity, path: "audit-log" },
];

function EventsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const eventId = pathname?.split("/")[2];
  const section = pathname
    ?.replace(`/events/${eventId}`, "")
    .split("/")
    .filter(Boolean)[0];
  const currentTab = !section ? "general-info" : section;

  const { data, loading } = useEventById(eventId || "");

  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const event = data?.getEventById;

  const statusColor =
    event?.status === "PUBLISHED" || event?.status === "LIVE"
      ? "bg-emerald-500"
      : event?.status === "DRAFT"
        ? "bg-amber-500"
        : event?.status === "CANCELLED"
          ? "bg-red-500"
          : "bg-primary";

  return (
    <ManageItemLayout
      title={event?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      coverImage={event?.cover}
      defaultIcon={Calendar}
      status={event?.status}
      statusVariant={
        event?.status === "PUBLISHED" || event?.status === "LIVE"
          ? "default"
          : "secondary"
      }
      statusColor={statusColor}
      subtitle={
        !loading && event ? (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {event.startDate && (
              <span>
                {new Date(event.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {event.startTime ? ` • ${event.startTime}` : ""}
              </span>
            )}
            {event.startDate && event.location?.name && <span>·</span>}
            {event.location?.name && (
              <span className="truncate max-w-[300px]">
                {event.location.name}
              </span>
            )}
          </p>
        ) : null
      }
      closeHref="/events/all"
      basePath={`/events/${eventId}`}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/events/all" },
        { label: event?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(EventsLayout, "EVENTS", "canRead");

