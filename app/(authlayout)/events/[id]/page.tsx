"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventById, useUpdateEvent } from "@/graphql/actions/events";
import { EventsCreationForm } from "@/components/events/create/events-creation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import moment from "moment";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

function EventGeneralInfo() {
  const singularName = useModuleStore((state) => state.eventSingularName);
  const moduleName = useModuleStore((state) => state.eventModuleName);
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

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={event?.title ? `Edit · ${event.title}` : `Edit ${singularName}`}
        badgeText="Events Studio"
        description={`Update ${singularName.toLowerCase()} schedule, venue coordinates, and registration timeline.`}
        icon={Calendar}
        breadcrumbs={[
          { label: moduleName, href: "/events/all" },
          { label: event?.title || `Edit ${singularName}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/events/all">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to {moduleName}
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {fetchingEvent ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !event ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Calendar className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                {singularName} Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                This event may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/events/all">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {moduleName}
              </Button>
            </Link>
          </div>
        ) : (
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
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventGeneralInfo, "EVENTS", "canRead"),
  "events",
);
