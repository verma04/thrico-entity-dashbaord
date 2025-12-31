"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCreationForm } from "./listing-creation-form";
import { useAddListing } from "@/graphql/actions/listing";
import { AnimatePresence, motion } from "framer-motion";

export function CreateListingDialog() {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const [add, { loading }] = useAddListing({
    onCompleted: (data) => {
      onClose();
    },
  });

  const onFinish = (values: any) => {
    add({
      variables: {
        input: values,
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Listing
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-background"
          >
            <ListingCreationForm
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
}
