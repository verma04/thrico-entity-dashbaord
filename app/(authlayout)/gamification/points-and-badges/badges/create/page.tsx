"use client";

import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

import { useCreateBadge } from "@/graphql/actions/gamification/gamification-mutation";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";

import { useModuleStore } from "@/store/useModuleStore";
import { BadgeForm } from "@/components/gamification/badges/badge-form";

export default function CreateBadgePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const router = useRouter();
  const { data: moduleData, loading: modulesLoading } =
    useGetEntityGamificationModules();
  const [createBadge, { loading: isCreating }] = useCreateBadge();

  const handleCreate = async (values: any) => {
    const tierIds = Array.isArray(values.membershipTierId)
      ? values.membershipTierId
      : values.membershipTierId
        ? [values.membershipTierId]
        : values.eligibleTierIds || [];

    const input: any = {
      source: values.type === "ACTION" ? values.source : undefined,
      name: values.name,
      description: values.description,
      icon: values.icon,
      type: values.type,
      module: values.type === "ACTION" ? values.module : undefined,
      action: values.type === "ACTION" ? values.action : undefined,
      memberEligibility: values.memberEligibility || "ALL",
      membershipTierId: tierIds,
      eligibleTierIds: tierIds,
      eligibleUserIds: values.eligibleUserIds || [],
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
    };

    if (values.type === "ACTION") {
      input.count = Number(values.targetValue);
    } else {
      input.points = Number(values.targetValue);
    }

    const res = await createBadge({
      variables: {
        input,
      },
    });

    if (res?.errors && res.errors.length > 0) {
      throw new Error(res.errors[0].message);
    }
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations =
    moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers =
    moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers =
    moduleData?.getEntityGamificationModules?.integrationTriggers || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Badge Studio"
        badgeText={`${gamificationModuleName} Studio`}
        description="Design and deploy badges to incentivise community members."
        icon={Award}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Badges", href: "/gamification/points-and-badges/badges" },
          { label: "Add Badge" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {modulesLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : (
          <BadgeForm
            showHeader={false}
            onSubmit={handleCreate}
            loading={isCreating}
            modules={modules}
            integrations={integrations}
            triggers={triggers}
            moduleTriggers={moduleTriggers}
            integrationTriggers={integrationTriggers}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
