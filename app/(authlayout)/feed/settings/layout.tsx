"use client";

import * as React from "react";
import { LayoutGrid, ListOrdered } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { usePathname } from "next/navigation";

function FeedSettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOrdering = pathname.includes("ordering");

  const items = [
    {
      key: "visibility",
      label: "Visibility",
      icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
      key: "ordering",
      label: "Ordering",
      icon: <ListOrdered className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <EcosystemWrapper className="ml-4" anonymized-1="feed-settings">
        <EcosystemHeader
          title={isOrdering ? "Feed Ordering" : "Feed Visibility"}
          description={
            isOrdering
              ? "Drag and drop to reorder the content sources in your feed."
              : "Choose which types of content should be shown in your feed."
          }
          icon={isOrdering ? ListOrdered : LayoutGrid}
          badgeText={isOrdering ? "Ordering" : "Content"}
          breadcrumbs={[
            { label: "Feed", href: "/feed" },
            { label: "Settings" },
            { label: isOrdering ? "Ordering" : "Visibility" },
          ]}
        />
      </EcosystemWrapper>
      <MenuItemsLayout
        active="feed/settings"
        items={items}
        hideDefaultTabs={true}
      >
        <EcosystemWrapper className="mt-4" anonymized-1="feed-settings">
          <EcosystemContainer className="bg-transparent border-none shadow-none ring-0 p-0 sm:p-0">
            {children}
          </EcosystemContainer>
        </EcosystemWrapper>
      </MenuItemsLayout>
    </>
  );
}

export default FeedSettingsLayout;
