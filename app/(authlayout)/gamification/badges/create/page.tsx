"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateBadge } from "@/graphql/actions/gamification/gamification-mutation";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { BadgeForm } from "@/components/gamification/badges/badge-form";

export default function CreateBadgePage() {
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [createBadge, { loading: isCreating }] = useCreateBadge();

  const handleCreate = async (values: any) => {
    await createBadge({
      variables: {
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

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Badge Studio"
        badgeText="Gamification Studio"
        description="Design and deploy achievement nodes to incentivize community behaviors."
        icon={Award}
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Gamification</span>
          <ChevronRight className="h-3 w-3" />
          <span>Badges</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">
            Create Achievement
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <BadgeForm
        onSubmit={handleCreate}
        loading={isCreating}
        modules={modules}
        triggers={triggers}
      />
    </EcosystemWrapper>
  );
}
