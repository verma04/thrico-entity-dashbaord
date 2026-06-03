"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddListing } from "@/graphql/actions/listing";
import { ListingCreationForm } from "@/components/listings/listing-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const CreateListingPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [add, { loading }] = useAddListing({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Listing created successfully!",
      });
      router.push("/listing/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
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
    <div className="h-full overflow-hidden">
      <ListingCreationForm
        initialValues={{}}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(CreateListingPage, "LISTING", "canCreate");
