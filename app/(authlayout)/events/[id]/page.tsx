"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventById, useUpdateEvent } from "@/graphql/actions/events";
import { EventsCreationForm } from "@/components/events/create/events-creation-form";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import moment from "moment";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

function EventGeneralInfo() {
  const singularName =
    useModuleStore((state) => state.eventSingularName) || "Event";
  const moduleName =
    useModuleStore((state) => state.eventModuleName) || "Events";
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();

  const [cover, setCover] = useState<any>(null);

  const { data, loading: fetchingEvent } = useEventById(eventId);
  const event = data?.getEventById;

  const [updateEvent, { loading: updating }] = useUpdateEvent({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
    },
    onError: (err: any) => {
      toast.error(
        err.message || `Failed to update ${singularName.toLowerCase()}`,
      );
    },
  });

  if (fetchingEvent) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/80 rounded-xl bg-card space-y-4 shadow-2xs">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
          <Calendar className="h-7 w-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-foreground">
            {singularName} Not Found
          </h3>
          <p className="text-xs text-muted-foreground">
            This event may have been deleted or the link is invalid.
          </p>
        </div>
        <Link href="/events/all">
          <Button
            variant="outline"
            className="gap-2 text-xs font-semibold h-8 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {moduleName}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Event Telemetry Scorecards ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Schedule
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
              Timeline
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {event.startDate
                ? moment(event.startDate).format("MMM D, YYYY")
                : "Not set"}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {event.startTime
              ? `Starts at ${event.startTime}`
              : "Time not specified"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Format &amp; Venue
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/50 rounded">
              Type
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {event.type === "IN_PERSON"
                ? "In-Person"
                : event.type === "VIRTUAL"
                  ? "Virtual"
                  : "Hybrid"}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {event.location?.name || event.location?.address || "Online Link"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Roster
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
              Attendees
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {(event.attendeeCount ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              registered
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {event.lastDateOfRegistration
              ? `Deadline ${moment(event.lastDateOfRegistration).format("MMM D")}`
              : "Open registration"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Publication
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/50 rounded">
              Status
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {event.status || (event.isActive ? "Active" : "Draft")}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {event.isActive
              ? "Visible on community portal"
              : "Hidden from public"}
          </p>
        </div>
      </div>

      {/* ── Event Edit Form ─────────────────────────────────────────────── */}
      <EventsCreationForm
        headerTitle={`Edit ${singularName}`}
        buttonText="Save Changes"
        initialValues={{
          title: event?.title || "",
          description: event?.description || "",
          location: event?.location?.address || event?.location?.name || "",
          type: event?.type?.toLowerCase() || "in_person",
          startDate: event?.startDate
            ? moment(event.startDate).format("YYYY-MM-DD")
            : "",
          endDate: event?.endDate
            ? moment(event.endDate).format("YYYY-MM-DD")
            : "",
          startTime: event?.startTime || "",
          lastDateOfRegistration: event?.lastDateOfRegistration
            ? moment(event.lastDateOfRegistration).format("YYYY-MM-DD")
            : "",
          isActive: event?.isActive ?? false,
          memberEligibility:
            event?.memberEligibility ||
            event?.eligibility?.memberEligibility ||
            event?.eligibilityRule?.memberEligibility ||
            "ALL",
          membershipTierId:
            event?.eligibility?.membershipTierId ||
            event?.eligibilityRule?.membershipTierId ||
            [],
          eligibleTierIds:
            event?.eligibility?.eligibleTierIds ||
            event?.eligibilityRule?.eligibleTierIds ||
            [],
          eligibleUserIds:
            event?.eligibility?.eligibleUserIds ||
            event?.eligibilityRule?.eligibleUserIds ||
            [],
          eligibleSegmentIds:
            event?.eligibility?.eligibleSegmentIds ||
            event?.eligibilityRule?.eligibleSegmentIds ||
            [],
        }}
        initialCoverUrl={
          event?.cover ? `https://cdn.thrico.network/${event.cover}` : null
        }
        loading={updating}
        onFinish={(values) => {
          const eventInput: any = {
            title: values.title,
            location:
              typeof values.location === "string"
                ? { name: values.location }
                : values.location,
            description: values.description,
            startDate: values.startDate
              ? new Date(values.startDate).toISOString()
              : undefined,
            endDate: values.endDate
              ? new Date(values.endDate).toISOString()
              : undefined,
            startTime: values.startTime || undefined,
            type: values.type?.toUpperCase(),
            lastDateOfRegistration: values.lastDateOfRegistration
              ? new Date(values.lastDateOfRegistration).toISOString()
              : undefined,
            isActive: values.isActive,
            memberEligibility: values.memberEligibility,
            eligibility: values.eligibility,
          };

          if (cover) {
            eventInput.coverImage = cover;
          }

          updateEvent({
            variables: {
              eventId,
              input: eventInput,
            },
          });
        }}
        onCancel={() => router.back()}
        cover={cover}
        setCover={setCover}
      />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventGeneralInfo, "EVENTS", "canRead"),
  "events",
);
