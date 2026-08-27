"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddListing } from "@/graphql/actions/listing";
import { ListingCreationForm } from "@/components/listings/listing-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Store } from "lucide-react";
import { EcosystemContainer } from "@/components/layout/ecosystem";

const CreateListingPage = () => {
  const singularName = useModuleStore((state) => state.listingSingularName);
  const router = useRouter();
  const { toast } = useToast();

  const [add, { loading }] = useAddListing({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/listing/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || `Failed to create ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    const memberEligibility = values.memberEligibility || "ALL";
    const membershipTierId =
      values.membershipTierId || values.eligibleTierIds || [];
    const eligibleTierIds =
      values.eligibleTierIds || values.membershipTierId || [];
    const eligibleUserIds = values.eligibleUserIds || [];
    const eligibleSegmentIds = values.eligibleSegmentIds || [];
    const eligibleCommunityIds =
      values.eligibleCommunityIds || values.communityIds || [];
    const communityIds =
      values.communityIds || values.eligibleCommunityIds || [];
    const communityId =
      values.communityId || (communityIds.length > 0 ? communityIds[0] : undefined);

    add({
      variables: {
        input: {
          title: values.title,
          description: values.description,
          category: values.category,
          condition: values.condition,
          sku: values.sku,
          tag: values.tag,
          interests: values.interests,
          categories: values.categories,
          price: parseInt(values.price, 10) || 0,
          media: (values.media || []).map((m: any) => m.file || m.originFileObj),
          location: {
            name: values.location,
            address: values.location,
            latitude: 0,
            longitude: 0,
          },
          communityId,
          communityIds: communityIds.length > 0 ? communityIds : undefined,
          memberEligibility,
          eligibility: {
            memberEligibility,
            membershipTierId,
            eligibleTierIds,
            eligibleUserIds,
            eligibleSegmentIds,
            eligibleCommunityIds,
            communityIds,
          },
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  const moduleName = useModuleStore((state) => state.listingModuleName);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="Marketplace"
        description={`Add a new ${singularName.toLowerCase()} to your community marketplace.`}
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/listing/all" },
          { label: `Create ${singularName}` },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <ListingCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(CreateListingPage, "LISTING", "canCreate");
