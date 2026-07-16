"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MemberCreationForm } from "@/components/members/add/member-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";

import { useAddNewMember } from "@/graphql/actions/membership/membership-mutations";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddMemberPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [addMember, { loading }] = useAddNewMember({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Member added successfully to the community!",
      });
      router.push("/members"); // or the actual members list route
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    }
  });

  const onFinish = (values: any) => {
    // Map Formik values to the expected AddNewMemberInput structure
    const input = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      headline: values.headline,
      about: values.about,
      DOB: values.dob,
      avatar: values.avatar,
      industryIds: values.industryIds,
      jobFunctionIds: values.jobFunctionIds,
      skillIds: values.skillIds,
      skills: values.skills,
      interestIds: values.interestIds,
    };

    addMember({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const hasReachedLimit = subData?.checkMemberSubscription?.hasReachedLimit;
  const message = subData?.checkMemberSubscription?.message;

  if (subLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="flex h-full items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-amber-900">Member Limit Reached</h2>
          <p className="text-amber-700 font-medium">
            {message || "You have reached your subscription limit. Please upgrade your subscription to add more members."}
          </p>
          <div className="pt-4">
            <Button
              variant="outline"
              className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100 w-full rounded-xl"
              onClick={() => router.push("/settings/billing")}
            >
              Upgrade Subscription
            </Button>
          </div>
          <div className="pt-2">
            <Button
              variant="ghost"
              className="text-amber-700 hover:bg-amber-100 w-full rounded-xl"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-background">
      <MemberCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(AddMemberPage, "NETWORK", "canCreate");
