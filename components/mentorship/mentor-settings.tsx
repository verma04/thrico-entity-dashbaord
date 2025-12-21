"use client";

import React from "react";
import { useMentorSettingsStore } from "@/store/useMentorSettingsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Separator } from "@/components/ui/separator";
import { Settings, CheckCircle, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MentorSettings: React.FC = () => {
  const {
    acceptMentorRequests,
    autoApproveMentors,
    termsAndConditions,
    submissionGuidelines,
    toggleMentorRequests,
    toggleAutoApprove,
    setTermsAndConditions,
    setSubmissionGuidelines,
  } = useMentorSettingsStore();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Mentor settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Mentor Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure how mentor requests are submitted and managed
        </p>
      </div>

      {/* Submission Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Request Settings</CardTitle>
          </div>
          <CardDescription>Control mentor request submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Accept Mentor Requests</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to submit mentor requests to the platform
              </p>
            </div>
            <Switch checked={acceptMentorRequests} onCheckedChange={toggleMentorRequests} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Approve Mentors</Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve user-submitted mentor requests
              </p>
            </div>
            <Switch checked={autoApproveMentors} onCheckedChange={toggleAutoApprove} />
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Terms & Conditions</CardTitle>
          </div>
          <CardDescription>
            Terms that users must agree to before submitting mentor requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={termsAndConditions}
            onChange={setTermsAndConditions}
            placeholder="Enter terms and conditions..."
            minHeight="300px"
          />
        </CardContent>
      </Card>

      {/* Submission Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Guidelines</CardTitle>
          <CardDescription>
            Guidelines to help users create quality mentor profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={submissionGuidelines}
            onChange={setSubmissionGuidelines}
            placeholder="Enter submission guidelines..."
            minHeight="300px"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
