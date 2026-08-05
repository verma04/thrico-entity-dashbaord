"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MemberCreationForm } from "@/components/members/add/member-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";

import { useAddNewMember } from "@/graphql/actions/membership/membership-mutations";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { AlertTriangle, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { InlineAlert } from "@/components/ui/inline-alert";

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
    },
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
      <EcosystemWrapper>
        <EcosystemHeader
          title="Add Member"
          badgeText="Community"
          description="Add a new member to your community."
          icon={UserPlus}
        />
        <EcosystemContainer className="p-6">
          <InlineAlert
            variant="alert"
            title="Member Limit Reached"
            message={
              message ||
              "You have reached your subscription limit. Please upgrade your subscription to add more members."
            }
          />
          <div className="mt-6 flex gap-3">
            <Button
              variant="default"
              onClick={() => router.push("/settings/billing")}
            >
              Upgrade Subscription
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Add Member"
        badgeText="Community"
        description="Add a new member to your community."
        icon={UserPlus}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <MemberCreationForm
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(AddMemberPage, "NETWORK", "canCreate");
