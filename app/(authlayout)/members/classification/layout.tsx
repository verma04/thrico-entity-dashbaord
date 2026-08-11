"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import {
  Building2,
  Briefcase,
  Award,
  Heart,
  GraduationCap,
  Building,
  Type,
  MapPin,
  Loader2,
} from "lucide-react";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { useClassificationStore } from "@/store/classification-store";
import {
  useGetClassificationTabOrder,
  useUpdateClassificationTabOrder,
} from "@/graphql/actions/classification/classification-actions";

export default function ClassificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on route
  const activeTab = pathname.includes("/members/classification/industries")
    ? "industries"
    : pathname.includes("/members/classification/functions")
      ? "functions"
      : pathname.includes("/members/classification/skills")
        ? "skills"
        : pathname.includes("/members/classification/interests")
          ? "interests"
          : pathname.includes("/members/classification/experience")
            ? "experience"
            : pathname.includes("/members/classification/education")
              ? "education"
              : pathname.includes("/members/classification/headline")
                ? "headline"
                : pathname.includes("/members/classification/location")
                  ? "location"
                  : "location";

  const defaultItems = useMemo(() => [
    {
      key: "location",
      label: "Locations",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      key: "experience",
      label: "Companies",
      icon: <Building className="h-4 w-4" />,
    },
    {
      key: "education",
      label: "Colleges",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      key: "industries",
      label: "Industries",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      key: "functions",
      label: "Job Functions",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      key: "interests",
      label: "Interests",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      key: "skills",
      label: "Skills",
      icon: <Award className="h-4 w-4" />,
    },
    {
      key: "headline",
      label: "Headlines",
      icon: <Type className="h-4 w-4" />,
    },
  ], []);

  const { tabOrder, setTabOrder } = useClassificationStore();
  const { data: orderData } = useGetClassificationTabOrder();
  const [updateTabOrder] = useUpdateClassificationTabOrder();

  useEffect(() => {
    if (orderData?.getClassificationTabOrder?.tabs?.length > 0) {
      const serverTabs = orderData.getClassificationTabOrder.tabs;
      if (JSON.stringify(serverTabs) !== JSON.stringify(tabOrder)) {
        setTabOrder(serverTabs);
      }
    }
  }, [orderData, tabOrder, setTabOrder]);

  const items = useMemo(() => {
    if (tabOrder.length === 0) return defaultItems;
    
    return [...defaultItems].sort((a, b) => {
      const indexA = tabOrder.indexOf(a.key);
      const indexB = tabOrder.indexOf(b.key);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [defaultItems, tabOrder]);

  const handleReorder = (newOrder: string[]) => {
    setTabOrder(newOrder);
    updateTabOrder({ variables: { input: { tabs: newOrder } } });
  };

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const message = subData?.checkMemberSubscription?.message;

  if (subLoading) {
    return (
      <EcosystemWrapper anonymized-1="member-classifications">
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EcosystemWrapper>
    );
  }

  const activeTabLabel =
    items.find((t) => t.key === activeTab)?.label || "Classifications";

  return (
    <EcosystemWrapper anonymized-1="member-classifications">
      <div className="flex flex-col gap-6">
        <EcosystemHeader
          title="Member Classifications"
          badgeText="Directory Settings"
          description="View member attribute groups and classifications"
          icon={Building2}
          breadcrumbs={[
            { label: "Members", href: "/members/all" },
            {
              label: "Classification",
              href: "/members/classification/location",
            },
            { label: activeTabLabel },
          ]}
        />

        <MenuItemsLayout
          items={items}
          active="members/classification"
          hideDefaultTabs
          showAdminTabs={false}
          className="mt-0 bg-transparent dark:bg-transparent border-t-0"
          enableReorder={true}
          onReorder={handleReorder}
        >
          {children}
        </MenuItemsLayout>
      </div>
    </EcosystemWrapper>
  );
}
