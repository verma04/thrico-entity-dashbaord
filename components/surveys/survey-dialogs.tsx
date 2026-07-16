"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Survey } from "@/graphql/surveys/survey-queries";

interface SurveyDialogsProps {
  surveyToDelete: string | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  sharingSurvey: Survey | null;
  onCancelShare: () => void;
  onConfirmShare: () => void;
  isSharing: boolean;
  shareDescription: string;
  onShareDescriptionChange: (value: string) => void;
}

export function SurveyDialogs({
  surveyToDelete,
  onCancelDelete,
  onConfirmDelete,
  isDeleting,
  sharingSurvey,
  onCancelShare,
  onConfirmShare,
  isSharing,
  shareDescription,
  onShareDescriptionChange,
}: SurveyDialogsProps) {
  return (
    <>
      <AlertDialog
        open={!!surveyToDelete}
        onOpenChange={(val) => !val && onCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              survey and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white gap-2"
              onClick={(e) => {
                e.preventDefault();
                onConfirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!sharingSurvey}
        onOpenChange={(val) => !val && onCancelShare()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Survey to Feed</DialogTitle>
            <DialogDescription>
              Add a description to your post. This will share the survey to your
              feed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {sharingSurvey && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    {sharingSurvey.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {sharingSurvey.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {sharingSurvey.status}
                      </Badge>
                    </div>
                    {sharingSurvey.startDate && (
                      <div className="flex items-center gap-1">
                        <span>
                          Starts{" "}
                          {format(new Date(sharingSurvey.startDate), "PPP")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="space-y-2">
              <Label htmlFor="share-desc">Message</Label>
              <Textarea
                id="share-desc"
                placeholder="Say something about this survey..."
                value={shareDescription}
                onChange={(e) => onShareDescriptionChange(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancelShare}>
              Cancel
            </Button>
            <Button onClick={onConfirmShare} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sharing...
                </>
              ) : (
                "Share"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
