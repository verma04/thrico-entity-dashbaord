"use client";

import * as React from "react";
import { GraduationCap, Settings, List, LayoutDashboard } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { useEntitySettings, useGetModuleCustomName } from "@/graphql/actions";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function MentorshipLayout({ children }: { children: React.ReactNode }) {
  const { data: settingsData } = useEntitySettings();
  const autoApprove = settingsData?.getEntitySettings?.autoApproveMentorship;

  const setMentorshipModuleName = useModuleStore((state) => state.setMentorshipModuleName);
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const { data: customNameData } = useGetModuleCustomName("mentorship");
  const fetchedName = customNameData?.getModuleCustomName;

  React.useEffect(() => {
    if (fetchedName) {
      setMentorshipModuleName(fetchedName);
    }
  }, [fetchedName, setMentorshipModuleName]);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
      icon: <List className="h-4 w-4" />,
      href: "/mentorship/all",
    },
    ...(!autoApprove
      ? [
          {
            key: "requests",
            label: `${singularName} Request`,
            icon: <GraduationCap className="h-4 w-4" />,
            href: "/mentorship/requests",
          },
        ]
      : []),
    {
      key: "add-mentor",
      label: `Add ${singularName}`,
      icon: <GraduationCap className="h-4 w-4" />,
      href: "/mentorship/add-mentor",
    },
    {
      key: "categories",
      label: "Categories",
      icon: <GraduationCap className="h-4 w-4" />,
      href: "/mentorship/categories",
    },
    {
      key: "skills",
      label: "Skills",
      icon: <GraduationCap className="h-4 w-4" />,
      href: "/mentorship/skills",
    },
  ];

  return (
    <MenuItemsLayout active="mentorship" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(MentorshipLayout, "mentorship");
