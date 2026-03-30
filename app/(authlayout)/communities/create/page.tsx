"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addCommunity } from "@/graphql/actions/group";
import { CommunityCreationForm } from "@/components/communities/add/community-creation-form";
import { useToast } from "@/components/ui/use-toast";

const CreateCommunityPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [cover, setCover] = useState<string>();

  const [add, { loading }] = addCommunity({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Community created successfully!",
      });
      router.push("/communities/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create community",
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    add({
      variables: {
        input: { ...values, cover },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <CommunityCreationForm
        initialValues={{
          requireAdminApprovalForPosts: false,
          allowMemberInvites: false,
          enableEvents: false,
          enableRatingsAndReviews: false,
        }}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
        cover={cover}
        setCover={setCover}
      />
    </div>
  );
};

export default CreateCommunityPage;
