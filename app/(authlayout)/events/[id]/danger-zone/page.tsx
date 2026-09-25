"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventById, useDeleteEvent } from "@/graphql/actions/events";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  Ticket,
  Mic,
  Award,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";

function EventDangerZonePage() {
  const moduleName = useModuleStore((state) => state.eventModuleName) || "Events";
  const singularName = useModuleStore((state) => state.eventSingularName) || "Event";
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();

  const { data, loading } = useEventById(eventId || "");
  const event = data?.getEventById;

  const [delEvent, { loading: deleting }] = useDeleteEvent({
    onCompleted: () => {
      toast.success(`${singularName} deleted permanently`);
      router.push("/events/all");
    },
    onError: (err: any) => {
      toast.error(err.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  const handleDelete = () => {
    delEvent({
      variables: { eventId },
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs">Loading {singularName.toLowerCase()} safety parameters…</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto shadow-2xs">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          This {singularName.toLowerCase()} could not be loaded or was previously removed.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-8 text-xs font-semibold"
          onClick={() => router.push("/events/all")}
        >
          Back to {moduleName}
        </Button>
      </div>
    );
  }

  return (
    <ReusableDangerZone
      entityName={singularName}
      entityTitle={event.title || `${singularName} #${eventId}`}
      entityId={eventId}
      onDelete={handleDelete}
      loading={deleting}
      holdTime={2000}
      requireTypeMatch={true}
      warningDescription={`Permanently delete "${event.title}". This will revoke all ${event.attendeeCount || 0} attendee tickets, clear speaker schedules, cancel sponsorship contracts, and purge event analytics records.`}
      impactMetrics={[
        {
          label: "Attendee Registrations",
          value: event.attendeeCount || 0,
          icon: Users,
          description: "Tickets will be invalidated",
        },
        {
          label: "Speakers Scheduled",
          value: event.speakers?.length || 0,
          icon: Mic,
          description: "Agenda sessions removed",
        },
        {
          label: "Sponsor Partnerships",
          value: event.sponsors?.length || 0,
          icon: Award,
          description: "Booth tiers disconnected",
        },
        {
          label: "Event Schedule",
          value: event.startDate ? "Active" : "Draft",
          icon: Calendar,
          description: "All calendar entries erased",
        },
      ]}
    />
  );
}

export default withModulePermission(EventDangerZonePage, "EVENTS", "canDelete");
