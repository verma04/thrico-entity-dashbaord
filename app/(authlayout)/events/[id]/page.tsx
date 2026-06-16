"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventById, useUpdateEvent } from "@/graphql/actions/events";
import { EventsCreationForm } from "@/components/events/create/events-creation-form";
import moment from "moment";
import { useToast } from "@/components/ui/use-toast";
import { useModuleStore } from "@/store/useModuleStore";

function EventGeneralInfo() {
  const singularName = useModuleStore((state) => state.eventSingularName);
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [cover, setCover] = useState<any>(null);

  const { data, loading: fetchingEvent } = useEventById(eventId);
  const event = data?.getEventById;

  const [updateEvent, { loading: updating }] = useUpdateEvent({
    onCompleted: () => {
      toast({
        title: "Success",
        description: `${singularName} updated successfully`,
      });
    },
  });

  if (fetchingEvent) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading {singularName.toLowerCase()} details...</p>
        </div>
      </div>
    );
  }

  return (
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
      }}
      initialCoverUrl={
        event?.cover
          ? `https://cdn.thrico.network/${event.cover}`
          : null
      }
      loading={updating}
      onFinish={(values) => {
        const eventInput: any = {
          title: values.title,
          location: { name: values.location },
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
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventGeneralInfo, "EVENTS", "canRead"),
  "events"
);
