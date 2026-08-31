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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, BarChart3, MessageSquare, UserCheck } from "lucide-react";
import moment from "moment";
import { Survey } from "@/graphql/surveys/survey-queries";
import { useRouter } from "next/navigation";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";

interface SurveySheetProps {
  survey: Survey | null;
  isOpen: boolean;
  onClose: () => void;
  details: {
    title: string;
    description: string;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    communityId?: string;
    communityIds?: string[];
    memberEligibility?: string;
    acceptAnonymousResponse?: boolean;
    membershipTierId?: string[];
    eligibleTierIds?: string[];
    eligibleUserIds?: string[];
    eligibleSegmentIds?: string[];
    eligibleCommunityIds?: string[];
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

            {/* Audience & Member Eligibility */}
            <div className="mt-4">
              <PolarisEligibilityCard
                step={2}
                title="Audience & Eligibility"
                description="Control which members or tiers can access and submit this survey."
                badge="Access"
                allowOutsidePlatform={true}
                allowCommunity={true}
                eligibility={details.memberEligibility || "ALL"}
                onEligibilityChange={(val) =>
                  onDetailsChange((prev: any) => ({
                    ...prev,
                    memberEligibility: val,
                    acceptAnonymousResponse:
                      val === "OUTSIDE_PLATFORM"
                        ? prev.acceptAnonymousResponse
                        : false,
                    membershipTierId:
                      val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM"
                        ? []
                        : prev.membershipTierId,
                    eligibleTierIds:
                      val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM"
                        ? []
                        : prev.eligibleTierIds,
                    eligibleUserIds:
                      val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM"
                        ? []
                        : prev.eligibleUserIds,
                    eligibleCommunityIds:
                      val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM"
                        ? []
                        : prev.eligibleCommunityIds,
                    communityIds:
                      val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM"
                        ? []
                        : prev.communityIds,
                  }))
                }
                tierIds={
                  details.membershipTierId || details.eligibleTierIds || []
                }
                onTierIdsChange={(tiers) =>
                  onDetailsChange((prev: any) => ({
                    ...prev,
                    membershipTierId: tiers,
                    eligibleTierIds: tiers,
                  }))
                }
                communityIds={
                  details.eligibleCommunityIds || details.communityIds || []
                }
                onCommunityIdsChange={(comms) =>
                  onDetailsChange((prev: any) => ({
                    ...prev,
                    eligibleCommunityIds: comms,
                    communityIds: comms,
                  }))
                }
                userIds={details.eligibleUserIds || []}
                onUserIdsChange={(users) =>
                  onDetailsChange((prev: any) => ({
                    ...prev,
                    eligibleUserIds: users,
                  }))
                }
              >
                {/* When Outside Platform is selected: Anonymity option */}
                {details.memberEligibility === "OUTSIDE_PLATFORM" && (
                  <div className="pt-3 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-2 animate-in fade-in-50 duration-200">
                    <div className="flex items-start space-x-3 p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50">
                      <Checkbox
                        id="sheet-acceptAnonymousResponse"
                        checked={Boolean(details.acceptAnonymousResponse)}
                        onCheckedChange={(checked) =>
                          onDetailsChange((prev: any) => ({
                            ...prev,
                            acceptAnonymousResponse: Boolean(checked),
                          }))
                        }
                        className="mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="sheet-acceptAnonymousResponse"
                          className="text-xs font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer flex items-center gap-1.5"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-[#005bd3] dark:text-blue-400" />
                          Accept Anonymous Responses
                        </Label>
                        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                          Allow respondents outside the platform to submit feedback anonymously without providing their name or email address.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </PolarisEligibilityCard>
            </div>

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
