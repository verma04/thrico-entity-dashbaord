"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
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
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    ...items,
    {
      key: "reports",
      label: "Reports",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Wrench className="h-4 w-4" />,
    },
  ];

  const onChange = (key: string) => {
    if (key === "dashboard") router.push(`/${active}`);
    else router.push(`/${active}/${key}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={onChange} className="w-full">
            <div className="flex gap-0">
              {menuitems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onChange(item.key)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </Tabs>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};

export default MenuItemsLayout;
