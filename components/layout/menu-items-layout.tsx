"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Wrench, List, AlertTriangle } from "lucide-react";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const MenuItemsLayout = ({
  children,
  items,
  active,
}: {
  children: React.ReactNode;
  items: MenuItem[];
  active: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname.replace(`/${active}/`, "") === pathname
      ? "dashboard"
      : pathname.replace(`/${active}/`, "") || "dashboard";

  const menuitems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    ...items,
    {
      key: "reports",
      label: "Reports",
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <List className="h-4 w-4 mr-2" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Wrench className="h-4 w-4 mr-2" />,
    },
  ];

  const onChange = (key: string) => {
    if (key === "dashboard") router.push(`/${active}`);
    else router.push(`/${active}/${key}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={onChange} className="px-4 pt-6">
        <TabsList className="flex gap-0 mb-6">
          {menuitems.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card className="max-w-full mx-auto mt-8 shadow-none border-none bg-transparent">
        <CardContent className="pt-0">
          <div className="bg-card rounded-lg shadow p-6">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuItemsLayout;
