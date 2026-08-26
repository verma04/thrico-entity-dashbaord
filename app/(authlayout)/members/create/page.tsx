"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MemberCreationForm } from "@/components/members/add/member-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";

import { useAddNewMember } from "@/graphql/actions/membership/membership-mutations";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { UserPlus } from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";

const AddMemberPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [addMember, { loading, error }] = useAddNewMember({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Member added successfully to the community!",
      });
      router.push("/members");
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
      phone: values.phone,
      gender: values.gender,
      language: values.language,
      location: values.location,
      membershipTierId: values.membershipTierId,
    };

    addMember({ variables: { input } });
  };

  const onCancel = () => {
    router.push("/members");
  };

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  if (subLoading) {
    return (
      <EcosystemWrapper className="animate-in fade-in duration-500">
        <EcosystemHeader
          title="Add Member"
          breadcrumbs={[
            { label: "Community", href: "/" },
            { label: "Members", href: "/members" },
            { label: "Add Member" },
          ]}
          badgeText="Community"
          description="Add a new member to your community directory."
          icon={UserPlus}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
          <PolarisFormSkeleton
            showHeader={false}
            mainCards={[
              { fieldRows: 2, fullWidthRows: 2 },
              { fieldRows: 0, fullWidthRows: 3 },
              { fieldRows: 0, fullWidthRows: 1 },
            ]}
            sidebarSummaryRows={5}
            showSidebarInfo={true}
            showSidebarTip={true}
          />
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="animate-in fade-in duration-500">
      <EcosystemHeader
        title="Add Member"
        breadcrumbs={[
          { label: "Community", href: "/" },
          { label: "Members", href: "/members" },
          { label: "Add Member" },
        ]}
        badgeText="Community"
        description="Add a new member to your community directory."
        icon={UserPlus}
      />
      <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
        <MemberCreationForm
          showHeader={false}
          loading={loading}
          serverError={error?.message?.replace("GraphQL error: ", "")}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(AddMemberPage, "MEMBERS_ALL", "canCreate");
