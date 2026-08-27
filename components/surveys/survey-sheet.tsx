"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, BarChart3, MessageSquare } from "lucide-react";
import moment from "moment";
import { Survey } from "@/graphql/surveys/survey-queries";
import { useRouter } from "next/navigation";

interface SurveySheetProps {
  survey: Survey | null;
  isOpen: boolean;
  onClose: () => void;
  details: {
    title: string;
    description: string;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
  };
  onDetailsChange: (details: any) => void;
  onUpdate: () => void;
  isUpdating: boolean;
  isDateRangeInvalid: boolean;
  canUpdate: boolean;
}

export function SurveySheet({
  survey,
  isOpen,
  onClose,
  details,
  onDetailsChange,
  onUpdate,
  isUpdating,
  isDateRangeInvalid,
  canUpdate,
}: SurveySheetProps) {
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] overflow-y-auto p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-2xl">Edit Survey Details</SheetTitle>
          <SheetDescription>
            Update the basic information for your survey.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-140px)]">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">
                    Survey Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={details.title}
                    onChange={(e) =>
                      onDetailsChange((prev: any) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc">Description</Label>
                  <Textarea
                    id="edit-desc"
                    rows={3}
                    value={details.description}
                    onChange={(e) =>
                      onDetailsChange((prev: any) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={
                        details.startDate
                          ? details.startDate.format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) =>
                        onDetailsChange((prev: any) => ({
                          ...prev,
                          startDate: e.target.value
                            ? moment(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">
                      End Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={
                        details.endDate
                          ? details.endDate.format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) =>
                        onDetailsChange((prev: any) => ({
                          ...prev,
                          endDate: e.target.value
                            ? moment(e.target.value)
                            : null,
                        }))
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

            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="secondary"
                className="w-full justify-start gap-2 h-12"
                onClick={() => {
                  router.push(`/surveys/${survey?.formId}`);
                  onClose();
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit Form Questions (Full Editor)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
                onClick={() => {
                  router.push(`/surveys/${survey?.id}/results`);
                  onClose();
                }}
              >
                <BarChart3 className="h-4 w-4" />
                View Survey Results & Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-12"
                onClick={() => {
                  router.push(`/surveys/${survey?.id}/responses`);
                  onClose();
                }}
              >
                <MessageSquare className="h-4 w-4" />
                View Individual Responses
              </Button>
            </div>
          </div>

          <Separator />

          <SheetFooter className="px-6 py-4 bg-muted/30">
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onUpdate} disabled={!canUpdate || isUpdating}>
                {isUpdating ? "Updating..." : "Update Details"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
