"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddEvent } from "@/graphql/actions/events";
import { EventsCreationForm } from "@/components/events/create/events-creation-form";
import { useToast } from "@/components/ui/use-toast";

const CreateEventPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [cover, setCover] = useState<string>();

  const [add, { loading }] = useAddEvent({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      router.push("/events/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
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
    <div className="h-full overflow-hidden">
      <EventsCreationForm
        initialValues={{}}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
        cover={cover}
        setCover={setCover}
      />
    </div>
  );
};

export default CreateEventPage;
