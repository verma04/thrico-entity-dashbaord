"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addCommunity } from "@/graphql/actions/group";
import { CommunityCreationForm } from "@/components/communities/add/community-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Users } from "lucide-react";
import { EcosystemContainer } from "@/components/layout/ecosystem";

const CreateCommunityPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [cover, setCover] = useState<string>();

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const [add, { loading }] = addCommunity({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/communities/all");
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
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="New"
        description={`Add a new ${singularName.toLowerCase()} to your ecosystem.`}
        icon={Users}
        breadcrumbs={[
          { label: moduleName, href: "/communities/all" },
          { label: `Create ${singularName}` },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
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
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default CreateCommunityPage;
