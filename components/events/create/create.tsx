"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { EventsCreationForm } from "./events-creation-form";
import { useAddEvent } from "@/graphql/actions/events";

const Create = ({}) => {
  const router = useRouter();

  const [add, { loading }] = useAddEvent({
    onCompleted: (data) => {
      onClose();
      window.location.reload();
    },
  });

  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>();

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: any) => {
    // Transform form values to match the event input structure
    const eventInput = {
      title: values.title,
      location: values.location,
      description: values.description,
      startDate: values.startDate?.toISOString(),
      endDate: values.endDate?.toISOString(),
      startTime: values.startTime?.format("HH:mm"),
      type: values.type,
      lastDateOfRegistration: values.lastDateOfRegistration?.toISOString(),
      coverImage: cover,
    };

    console.log("Creating event with data:", eventInput);

    add({
      variables: {
        input: eventInput,
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-screen p-0 border-none flex flex-col"
        >
          <EventsCreationForm
            initialValues={{}}
            loading={loading}
            onFinish={onFinish}
            onCancel={onClose}
            cover={cover}
            setCover={setCover}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Create;
