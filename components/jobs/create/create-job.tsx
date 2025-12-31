"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobCreationForm } from "./job-creation-form";
import { useAddJob } from "@/graphql/actions/jobs";
import { AnimatePresence, motion } from "framer-motion";

const Create = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>();

  const [add, { loading }] = useAddJob({
    onCompleted: (data) => {
      onClose();
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: any) => {
    add({
      variables: {
        input: values,
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create</Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-background"
          >
            <JobCreationForm
              initialValues={{}}
              loading={loading}
              onFinish={onFinish}
              onCancel={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Create;
