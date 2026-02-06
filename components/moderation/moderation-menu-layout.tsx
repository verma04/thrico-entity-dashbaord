"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const ModerationMenuLayout = ({
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
    pathname === "/settings/moderation" || pathname === "/settings/moderation/"
      ? "dashboard"
      : pathname.replace("/settings/moderation/", "") || "dashboard";

  const onChange = (key: string) => {
    if (key === "dashboard") {
      router.push("/settings/moderation");
    } else {
      router.push(`/settings/moderation/${key}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-2">
          <Tabs value={activeTab} onValueChange={onChange} className="w-full">
            <TabsList className="bg-transparent h-auto p-0 gap-2">
              {items.map((item) => (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className={`flex items-center gap-2 border-b-2 rounded-none px-4 py-3 text-sm font-medium transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary border-transparent text-muted-foreground hover:text-foreground`}
                >
                  {item.icon}
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};

export default ModerationMenuLayout;
