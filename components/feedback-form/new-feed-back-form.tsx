"use client";

import { useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import { AddCustomForm } from "../../graphql/actions/customForm";
import { useFormStore } from "../../store/useFormStore";
import NewFormPage from "./create";

export default function NewForm() {
  const {
    formTitle,
    formDescription,
    questions,
    formSettings,
    endDate,
    previewType,
  } = useFormStore();
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const onCompleted = () => {
    setOpen(false);
  };

  const onFinish = () => {
    add({
      variables: {
        input: {
          title: formTitle,
          description: formDescription,
          endDate,
          previewType,
          appearance: formSettings,
          fields: questions,
        },
      },
    });
  };

  const [add, { loading }] = AddCustomForm({
    onCompleted,
  });

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Create New Form</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-full p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Create New Form</SheetTitle>
              <div className="flex items-center gap-2">
                {/* <Button variant="outline" asChild>
                  <Link href="/feedback">Cancel</Link>
                </Button> */}
                <Button
                  onClick={() => onFinish()}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create New Form"}
                </Button>
              </div>
            </div>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <NewFormPage add={add} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
