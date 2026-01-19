"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const GamificationMenuLayout = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: MenuItem[];
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the active tab
  const activeTab =
    pathname === "/gamification" || pathname === "/gamification/"
      ? "dashboard"
      : pathname.replace("/gamification/", "") || "dashboard";

  // Show all menu items on all pages
  const menuItems = items;

  const onChange = (key: string) => {
    if (key === "dashboard") {
      router.push("/gamification");
    } else {
      router.push(`/gamification/${key}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={onChange} className="w-full">
            <div className="flex gap-0">
              {menuItems.map((item) => (
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

export default GamificationMenuLayout;
