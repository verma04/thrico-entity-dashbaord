"use client";

import { CtaButton } from "@/components/ui/cta-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventsCreationForm } from "./events-creation-form";
import { useAddEvent } from "@/graphql/actions/events";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";

const Create = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>();

  const [add, { loading }] = useAddEvent({
    onCompleted: (data) => {
      onClose();
      window.location.reload();
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: any) => {
    const eventInput = {
      title: values.title,
      location: typeof values.location === "string" ? { name: values.location } : values.location,
      description: values.description,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      startTime: values.startTime || undefined,
      type: values.type,
      lastDateOfRegistration: values.lastDateOfRegistration || undefined,
      coverImage: cover,
      isActive: values.isActive,
      memberEligibility: values.memberEligibility,
      eligibility: values.eligibility,
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
      <CtaButton onClick={() => setOpen(true)}>Create</CtaButton>

      <FixedInsetMotionContainer
        open={open}
        onClose={onClose}
        zIndex="z-50"
      >
        <EventsCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onClose}
          cover={cover}
          setCover={setCover}
        />
      </FixedInsetMotionContainer>
    </>
  );
};

export default Create;
