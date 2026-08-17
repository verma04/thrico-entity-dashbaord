"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetBadges,
  useGetEntityGamificationModules,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useUpdateBadge } from "@/graphql/actions/gamification/gamification-mutation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import { useModuleStore } from "@/store/useModuleStore";
import { BadgeForm } from "@/components/gamification/badges/badge-form";

export default function EditBadgePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
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
    const res = await updateBadge({
      variables: {
        id: badgeId,
        input: {
          source: values.type === "ACTION" ? values.source : undefined,
          name: values.name,
          description: values.description,
          icon: values.icon,
          type: values.type,
          module: values.module || "SYSTEM",
          action: values.action || "POINTS_THRESHOLD",
          targetValue: Number(values.targetValue),
          allowPushNotification: values.allowPushNotification,
          allowEmailNotification: values.allowEmailNotification,
          pushNotificationTitle: values.allowPushNotification ? values.pushNotificationTitle : undefined,
          pushNotificationBody: values.allowPushNotification ? values.pushNotificationBody : undefined,
          emailNotificationSubject: values.allowEmailNotification ? values.emailNotificationSubject : undefined,
          emailNotificationBody: values.allowEmailNotification ? values.emailNotificationBody : undefined,
          isActive: values.isActive,
        },
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
        <Button onClick={() => router.push("/gamification/points-and-badges/badges")}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Edit Badge"
        badgeText={`${gamificationModuleName} Studio`}
        description="Modify the identity or award criteria for this achievement node."
        icon={Award}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Badges", href: "/gamification/points-and-badges/badges" },
          { label: "Edit Badge" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <BadgeForm
          initialValues={badge}
          onSubmit={handleUpdate}
          loading={isUpdating}
          isEdit={true}
          modules={modules}
          integrations={integrations}
          triggers={triggers}
          moduleTriggers={moduleTriggers}
          integrationTriggers={integrationTriggers}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
