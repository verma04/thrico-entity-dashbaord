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
import { Skeleton } from "@/components/ui/skeleton";

const AddMemberPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [addMember, { loading, error }] = useAddNewMember({
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
      phone: values.phone,
      gender: values.gender,
      language: values.language,
      location: values.location,
      membershipTierId: values.membershipTierId,
    };

    addMember({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  if (subLoading) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Add Member"
          breadcrumbs={[
            { label: "Community", href: "/" },
            { label: "Members", href: "/members" },
            { label: "Add Member" },
          ]}
          badgeText="Community"
          description="Add a new member to your community."
          icon={UserPlus}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-card">
                    <div className="bg-muted/30 border-b border-border p-6 pb-4">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="p-6 pt-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-card">
                    <div className="bg-muted/30 border-b border-border p-6 pb-4">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="p-6 pt-8 space-y-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-card p-6 flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Add Member"
        breadcrumbs={[
          { label: "Community", href: "/" },
          { label: "Members", href: "/members" },
          { label: "Add Member" },
        ]}
        badgeText="Community"
        description="Add a new member to your community."
        icon={UserPlus}
      />
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 pt-6">
        <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />
      </div>
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <MemberCreationForm
          loading={loading}
          serverError={error?.message?.replace("GraphQL error: ", "")}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(AddMemberPage, "NETWORK", "canCreate");
