"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobCreationForm } from "./job-creation-form";
import { useAddJob } from "@/graphql/actions/jobs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

const Create = ({}) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
      <Button onClick={() => setOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
        <Plus className="h-4 w-4" />
        Post a {singularName}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[95vw] sm:max-w-6xl overflow-y-auto p-0 border-l shadow-2xl bg-background">
          <SheetHeader className="sr-only">
            <SheetTitle>Create {singularName}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full bg-background overflow-hidden relative">
            <JobCreationForm
              initialValues={{}}
              loading={loading}
              onFinish={onFinish}
              onCancel={onClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Create;
