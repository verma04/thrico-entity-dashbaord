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
        description: error.message || `Failed to create ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    add({
      variables: {
        input: {
          ...values,
          price: parseInt(values.price, 10),
          media: values.media.map((m: any) => m.file || m.originFileObj),
          location: {
            name: values.location,
            address: values.location,
            latitude: 0,
            longitude: 0,
          },
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="New"
        description={`Add a new ${singularName.toLowerCase()} to the marketplace.`}
        icon={Store}
        breadcrumbs={[
          { label: "Marketplace", href: "/listing/all" },
          { label: "Create" }
        ]}
      />
      <div className="flex-1 overflow-auto bg-background/50 p-6">
        <ListingCreationForm
          initialValues={{}}
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </div>
    </EcosystemWrapper>
  );
};

export default withModulePermission(CreateListingPage, "LISTING", "canCreate");
