"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CtaButton as Button } from "@/components/ui/cta-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

import { useAddSurvey } from "@/graphql/surveys/survey-mutations";
import { useFormStore } from "../../store/useFormStore";

export default function NewForm() {
  const {
    formTitle,
    setFormTitle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetForm,
    questions,
    formSettings,
    previewType,
  } = useFormStore();
  const [open, setOpen] = useState(false);

  const onCompleted = () => {
    setOpen(false);
    resetForm();
  };

  const [add, { loading }] = useAddSurvey({
    onCompleted,
  });

  const isDateRangeInvalid =
    startDate && endDate ? !endDate.isAfter(startDate) : false;

  const canSubmit =
    formTitle && startDate && endDate && !isDateRangeInvalid && !loading;

  const onFinish = () => {
    if (!canSubmit) return;
    add({
      variables: {
        input: {
          title: formTitle,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
    });
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (val) resetForm();
        }}
      >
        <SheetTrigger asChild>
          <Button className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create New Form
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[600px] overflow-y-auto p-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl">Create New Survey</SheetTitle>
            <SheetDescription>
              Enter the basic details for your survey. You can add questions and
              customize themes after creating it.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Set the title and dates for your survey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Survey Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Annual Feedback 2024"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                        onChange={(e) =>
                          setStartDate(
                            e.target.value ? moment(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate ? endDate.format("YYYY-MM-DD") : ""}
                        onChange={(e) =>
                          setEndDate(
                            e.target.value ? moment(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                  </div>
                  {isDateRangeInvalid && (
                    <p className="text-sm text-destructive">
                      End date must be after the start date.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            <SheetFooter className="px-6 py-4 bg-muted/30">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="mr-auto"
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => resetForm()}
                    disabled={!formTitle && !startDate && !endDate}
                  >
                    Reset
                  </Button>
                  <Button onClick={onFinish} disabled={!canSubmit}>
                    {loading ? "Creating..." : "Create Survey"}
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
