"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BarChart2, X, Send } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder for poll creation logic (replace with actual implementation)
const addPoll = async (values: any) => {
  // API call or mutation here
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const pollSchema = Yup.object({
  question: Yup.string().required().max(150),
  options: Yup.array()
    .of(Yup.string().required().max(50))
    .min(2, "At least 2 options")
    .max(6, "Max 6 options"),
  isAnonymous: Yup.boolean(),
});

export default function PollPost() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    await addPoll(values);
    setOpen(false);
    resetForm();
    // router.refresh(); // Uncomment if you want to refresh data
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <BarChart2 className="h-4 w-4" />
          Create Poll
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <Formik
          initialValues={{
            question: "",
            options: ["", ""],
            isAnonymous: false,
          }}
          validationSchema={pollSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Create a Poll</SheetTitle>
                <SheetDescription>
                  Ask a question and let the community vote
                </SheetDescription>
              </SheetHeader>

              {/* Body */}
              <div className="flex-1 space-y-6 py-6">
                {/* Question */}
                <div className="space-y-2">
                  <Label>Question *</Label>
                  <Field
                    name="question"
                    as={Input}
                    placeholder="Poll question"
                  />
                  <ErrorMessage
                    name="question"
                    component="p"
                    className="text-sm text-red-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {values.question.length}/150
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <Label>Options *</Label>
                  {values.options.map((option: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Field
                        name={`options[${idx}]`}
                        as={Input}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1"
                      />
                      {values.options.length > 2 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setFieldValue(
                              "options",
                              values.options.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <ErrorMessage
                    name="options"
                    component="p"
                    className="text-sm text-red-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={values.options.length >= 6}
                    onClick={() =>
                      setFieldValue("options", [...values.options, ""])
                    }
                  >
                    + Add Option
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {values.options.length}/6 options
                  </p>
                </div>

                {/* Anonymous */}
                <Card>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <Label>Anonymous Poll</Label>
                    </div>
                    <input
                      type="checkbox"
                      checked={values.isAnonymous}
                      onChange={(e) =>
                        setFieldValue("isAnonymous", e.target.checked)
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <SheetFooter className="border-t pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>

                <Button type="submit">
                  Publish
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </SheetFooter>
            </Form>
          )}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}
