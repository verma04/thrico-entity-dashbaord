"use client";

import * as React from "react";
import { GraduationCap, Settings, List, LayoutDashboard } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { useEntitySettings } from "@/graphql/actions";

function MentorshipLayout({ children }: { children: React.ReactNode }) {
  const { data: settingsData } = useEntitySettings();
  const autoApprove = settingsData?.getEntitySettings?.autoApproveMentorship;

  const items = [
    {
      key: "all",
      label: "Mentorship Programs",
      icon: <List className="h-4 w-4" />,
      href: "/mentorship/all",
    },
    ...(!autoApprove
      ? [
          {
            key: "requests",
            label: "Mentorship Request",
            icon: <GraduationCap className="h-4 w-4" />,
            href: "/mentorship/requests",
          },
        ]
      : []),
    {
      key: "add-mentor",
      label: "Add Mentor",
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

export default MentorshipLayout;
