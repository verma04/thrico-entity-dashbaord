"use client";

import React from "react";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateRank } from "@/graphql/actions/gamification/gamification-mutation";
import { useGetRanks } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { RankForm } from "@/components/gamification/ranks/rank-form";
import { useModuleStore } from "@/store/useModuleStore";

export default function CreateRankPage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const router = useRouter();
  const { data: ranksData } = useGetRanks();
  const [createRank, { loading: isCreating }] = useCreateRank();

  const ranks = ranksData?.getRanks || [];
  const nextOrder = ranks.length + 1;

  const handleCreate = async (values: any) => {
    const res = await createRank({
      variables: {
        input: {
          name: values.name,
          icon: values.icon,
          color: values.color,
          minPoints: Number(values.minPoints),
          maxPoints: Number(values.maxPoints),
          order: Number(values.order || nextOrder),
          allowPushNotification: values.allowPushNotification,
          allowEmailNotification: values.allowEmailNotification,
          pushNotificationTitle: values.allowPushNotification
            ? values.pushNotificationTitle
            : undefined,
          pushNotificationBody: values.allowPushNotification
            ? values.pushNotificationBody
            : undefined,
          emailNotificationSubject: values.allowEmailNotification
            ? values.emailNotificationSubject
            : undefined,
          emailNotificationBody: values.allowEmailNotification
            ? values.emailNotificationBody
            : undefined,
        },
      },
    });

    if (res?.errors && res.errors.length > 0) {
      throw new Error(res.errors[0].message);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Rank Studio"
        badgeText={`${gamificationModuleName} Studio`}
        description="Design and configure new rank tiers to incentivize member status and progression."
        icon={Crown}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Ranks", href: "/gamification/points-and-badges/ranks" },
          { label: "Add Rank" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <RankForm
          onSubmit={handleCreate}
          loading={isCreating}
          nextOrder={nextOrder}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
