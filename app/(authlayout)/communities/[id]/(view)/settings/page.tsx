"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommunityById, updateCommunity } from "@/graphql/actions/group";
import { CommunityCreationForm } from "@/components/communities/add/community-creation-form";
import { toast } from "sonner";
import { Loader2, Settings, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useModuleStore } from "@/store/useModuleStore";

export default function CommunitySettings() {
  const singularName = useModuleStore((state) => state.communitySingularName);
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
    skip: !id,
  });

  const community = data?.getCommunityById;

  const [updateInfo, { loading: updating }] = updateCommunity({
    onCompleted: () => {
      toast.success(`${singularName} settings updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to update ${singularName.toLowerCase()}`);
    },
  });

  if (fetchingCommunity) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs">Loading {singularName.toLowerCase()} settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Header Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {singularName} Configuration &amp; Policies
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              Live Config
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modify identity details, access privacy levels, admission criteria, and feature toggles.
          </p>
        </div>
      </div>

      {/* ── Community Creation / Edit Form ──────────────────────────────── */}
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
    </div>
  );
}
