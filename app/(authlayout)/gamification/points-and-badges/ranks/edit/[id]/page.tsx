"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRanks } from "@/graphql/actions/gamification/gamification-quiries";
import { useUpdateRank } from "@/graphql/actions/gamification/gamification-mutation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { RankForm } from "@/components/gamification/ranks/rank-form";
import { useModuleStore } from "@/store/useModuleStore";

export default function EditRankPage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const params = useParams();
  const router = useRouter();
  const rankId = params?.id as string;

  const { data: ranksData, loading: fetchLoading } = useGetRanks();
  const [updateRank, { loading: isUpdating }] = useUpdateRank();

  const rank = useMemo(() => {
    return ranksData?.getRanks?.find((r) => r.id === rankId);
  }, [ranksData, rankId]);

  const handleUpdate = async (values: any) => {
    const res = await updateRank({
      variables: {
        id: rankId,
        input: {
          name: values.name,
          icon: values.icon,
          color: values.color,
          minPoints: Number(values.minPoints),
          maxPoints: Number(values.maxPoints),
          order: Number(values.order),
          isActive: values.isActive,
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
        title="Edit Rank Tier"
        badgeText={`${gamificationModuleName} Studio`}
        description="Update identity, point boundaries, and alert notifications for this rank tier."
        icon={Crown}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Ranks", href: "/gamification/points-and-badges/ranks" },
          { label: "Edit Rank" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {fetchLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !rank ? (
          <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-bold">Rank Tier Not Found</h2>
            <Button
              onClick={() =>
                router.push("/gamification/points-and-badges/ranks")
              }
            >
              Back to List
            </Button>
          </div>
        ) : (
          <RankForm
            showHeader={false}
            initialValues={rank}
            onSubmit={handleUpdate}
            loading={isUpdating}
            isEdit={true}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
