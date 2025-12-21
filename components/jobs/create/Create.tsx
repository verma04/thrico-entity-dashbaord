"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { JobCreationForm } from "./job-creation-form";
import { useAddJob } from "../../../graphql/actions/jobs";

const Create = () => {
  const router = useRouter();
  const form = useForm();

  const [add, { loading }] = useAddJob({
    onCompleted: (data) => {
      onClose();
    },
  });

  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>();

  const onClose = () => {
    setOpen(false);
    form.reset();
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Create Job</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[100vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Job</SheetTitle>
            <SheetDescription>
              Create a new job posting for your company
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <JobCreationForm
              initialValues={{}}
              form={form}
              loading={loading}
              onFinish={onFinish}
              cover={cover}
              setCover={setCover}
            />
          </div>

          <SheetFooter className="flex gap-2">
            <Button onClick={() => form.handleSubmit(onFinish)()} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Create;
