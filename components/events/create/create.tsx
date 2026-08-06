"use client";

import { CtaButton } from "@/components/ui/cta-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventsCreationForm } from "./events-creation-form";
import { useAddEvent } from "@/graphql/actions/events";
import { AnimatePresence, motion } from "framer-motion";

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
      location: values.location,
      description: values.description,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      startTime: values.startTime || undefined,
      type: values.type,
      lastDateOfRegistration: values.lastDateOfRegistration || undefined,
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
      <CtaButton onClick={() => setOpen(true)}>Create</CtaButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-background"
          >
            <EventsCreationForm
              initialValues={{}}
              loading={loading}
              onFinish={onFinish}
              onCancel={onClose}
              cover={cover}
              setCover={setCover}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Create;
