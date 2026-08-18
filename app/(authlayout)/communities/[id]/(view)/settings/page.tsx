"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommunityById, updateCommunity } from "@/graphql/actions/group";
import { CommunityCreationForm } from "@/components/communities/add/community-creation-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CommunitySettings() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [cover, setCover] = useState<any>(null);

  const { data, loading: fetchingCommunity } = getCommunityById({
    variables: {
      input: {
        communityId: id,
      },
    },
  });

  const community = data?.getCommunityById;

  const [updateInfo, { loading: updating }] = updateCommunity({
    onCompleted: () => {
      toast.success("Community settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update community");
    },
  });

  if (fetchingCommunity) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs">Loading community details...</p>
        </div>
      </div>
    );
  }

  return (
    <CommunityCreationForm
      initialValues={{
        title: community?.title || "",
        tagline: community?.tagline || "",
        description: community?.description || "",
        privacy: community?.privacy || "PUBLIC",
        communityType: community?.communityType || "VIRTUAL",
        joiningTerms: community?.joiningTerms || "ANYONE_CAN_JOIN",
        requireAdminApprovalForPosts:
          community?.requireAdminApprovalForPosts ?? false,
        allowMemberInvites: community?.allowMemberInvites ?? false,
        enableEvents: community?.enableEvents ?? false,
        enableRatingsAndReviews: community?.enableRatingsAndReviews ?? false,
      }}
      initialCoverUrl={
        community?.cover
          ? `https://cdn.thrico.network/${community.cover}`
          : null
      }
      loading={updating}
      onFinish={(values: any) => {
        const communityInput: any = {
          title: values.title,
          tagline: values.tagline,
          description: values.description,
          privacy: values.privacy,
          communityType: values.communityType,
          joiningTerms: values.joiningTerms,
          requireAdminApprovalForPosts: values.requireAdminApprovalForPosts,
          allowMemberInvites: values.allowMemberInvites,
          enableEvents: values.enableEvents,
          enableRatingsAndReviews: values.enableRatingsAndReviews,
        };

        if (cover) {
          communityInput.cover = cover;
        }

        updateInfo({
          variables: {
            input: {
              id,
              ...communityInput,
            },
          },
        });
      }}
      onCancel={() => router.back()}
      cover={cover}
      setCover={setCover}
    />
  );
}
