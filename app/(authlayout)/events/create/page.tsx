"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddEvent } from "@/graphql/actions/events";
import { EventsCreationForm } from "@/components/events/create/events-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Calendar } from "lucide-react";

const CreateEventPage = () => {
  const singularName = useModuleStore((state) => state.eventSingularName);
  const router = useRouter();
  const { toast } = useToast();
  const [cover, setCover] = useState<string>();

  const [add, { loading }] = useAddEvent({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/events/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || `Failed to create ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    const eventInput = {
      title: values.title,
      location: values.location,
      description: values.description,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      startTime: values.startTime || undefined,
      type: values.type,
      lastDateOfRegistration: values.lastDateOfRegistration || undefined,
      coverImage: cover,
    };

    add({
      variables: {
        input: eventInput,
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="New"
        description={`Add a new ${singularName.toLowerCase()} to your community.`}
        icon={Calendar}
        breadcrumbs={[
          { label: "Events", href: "/events/all" },
          { label: "Create" },
        ]}
      />
      <div className="flex-1 overflow-auto bg-background/50 p-6">
        <EventsCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
          cover={cover}
          setCover={setCover}
        />
      </div>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateEventPage, "EVENTS", "canCreate"),
  "events",
);
