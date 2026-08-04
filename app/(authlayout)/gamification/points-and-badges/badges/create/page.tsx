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

import { useModuleStore } from "@/store/useModuleStore";
import { BadgeForm } from "@/components/gamification/badges/badge-form";

export default function CreateBadgePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [createBadge, { loading: isCreating }] = useCreateBadge();

  const handleCreate = async (values: any) => {
    const input: any = {
      name: values.name,
      description: values.description,
      icon: values.icon,
      type: values.type,
      module: values.type === "ACTION" ? values.module : undefined,
      action: values.type === "ACTION" ? values.action : undefined,
    };

    if (values.type === "ACTION") {
      input.count = Number(values.targetValue);
    } else {
      input.points = Number(values.targetValue);
    }

    await createBadge({
      variables: {
        input,
      },
    });
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Badge Studio"
        badgeText={`${gamificationModuleName} Studio`}
        description="Design and deploy achievement nodes to incentivize community behaviors."
        icon={Award}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Badges", href: "/gamification/points-and-badges/badges" },
          { label: "Add Badge" },
        ]}
      />

      <EcosystemContainer className="p-0 bg-transparent border-none shadow-none ring-0">
        <BadgeForm
          onSubmit={handleCreate}
          loading={isCreating}
          modules={modules}
          triggers={triggers}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
