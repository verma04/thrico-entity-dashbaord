"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Award, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetBadges,
  useGetEntityGamificationModules,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useUpdateBadge } from "@/graphql/actions/gamification/gamification-mutation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { BadgeForm } from "@/components/gamification/badges/badge-form";

export default function EditBadgePage() {
  const params = useParams();
  const router = useRouter();
  const badgeId = params?.id as string;

  const { data: badgeData, loading: fetchLoading } = useGetBadges();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [updateBadge, { loading: isUpdating }] = useUpdateBadge();

  const badge = useMemo(() => {
    return badgeData?.getBadges?.find((b) => b.id === badgeId);
  }, [badgeData, badgeId]);

  const handleUpdate = async (values: any) => {
    await updateBadge({
      variables: {
        id: badgeId,
        input: {
          name: values.name,
          description: values.description,
          icon: values.icon,
          type: values.type,
          module: values.type === "ACTION" ? values.module : "SYSTEM",
          action: values.type === "ACTION" ? values.action : "POINTS_THRESHOLD",
          targetValue: Number(values.targetValue),
          isActive: values.isActive,
        },
      },
    });
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];

  if (fetchLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Badge Not Found</h2>
        <Button onClick={() => router.push("/gamification/badges")}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Edit Badge"
        badgeText="Gamification Studio"
        description="Modify the identity or award criteria for this achievement node."
        icon={Award}
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Gamification</span>
          <ChevronRight className="h-3 w-3" />
          <span>Badges</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Edit Achievement</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <BadgeForm
        initialValues={badge}
        onSubmit={handleUpdate}
        loading={isUpdating}
        isEdit={true}
        modules={modules}
        triggers={triggers}
      />
    </EcosystemWrapper>
  );
}
