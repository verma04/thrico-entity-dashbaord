"use client";

import * as React from "react";
import { GraduationCap, Settings, List, LayoutDashboard } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function MentorshipLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Mentorship Programs",
      icon: <List className="h-4 w-4" />,
      href: "/mentorship/all",
    },
    {
      key: "requests",
      label: "User Requests",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      key: "skills",
      label: "Skills",
      icon: <GraduationCap className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="mentorship" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default MentorshipLayout;
