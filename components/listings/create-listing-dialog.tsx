"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCreationForm } from "./listing-creation-form";
import { useAddListing } from "@/graphql/actions/listing";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";
import { useModuleStore } from "@/store/useModuleStore";

export function CreateListingDialog() {
  const singularName = useModuleStore((state) => state.listingSingularName);
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
    // Determine the media input:
    // If it's an array of objects with a 'file' property (our internal PhotoUploadFile), map to the file.
    // Otherwise, assume it's already in the correct format or handle accordingly.
    const mediaFiles = Array.isArray(values.media)
      ? values.media.map((m: any) => (m.file ? m.file : m))
      : [];

    add({
      variables: {
        input: {
          ...values,
          media: mediaFiles,
        },
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create {singularName}
      </Button>

      <FixedInsetMotionContainer
        open={open}
        onClose={onClose}
        zIndex="z-50"
      >
        <ListingCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onClose}
        />
      </FixedInsetMotionContainer>
    </>
  );
}
