"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";
import { JobCreationForm } from "./job-creation-form";
import { useAddJob } from "@/graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

const Create = ({}) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [add, { loading }] = useAddJob({
    onCompleted: () => {
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
      <CtaButton onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Post {singularName}
      </CtaButton>

      <FixedInsetMotionContainer
        open={open}
        onClose={onClose}
        zIndex="z-50"
      >
        <JobCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onClose}
        />
      </FixedInsetMotionContainer>
    </>
  );
};

export default Create;
