"use client";

import type * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Globe,
  Menu,
  Settings,
  PanelBottom,
} from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

interface Tab {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const PagesItemsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/app-layout/", "") || "layouts";

  const menuItems: Tab[] = [
    {
      key: "pages",
      label: "Pages",
      icon: <FileText className="h-4 w-4" />,
      path: "/app-layout/pages",
    },
    {
      key: "navigation",
      label: "Navigation",
      icon: <Menu className="h-4 w-4" />,
      path: "/app-layout/navigation",
    },
    {
      key: "footer",
      label: "Footer",
      icon: <PanelBottom className="h-4 w-4" />,
      path: "/app-layout/footer",
    },
    {
      key: "seo",
      label: "SEO",
      icon: <Globe className="h-4 w-4" />,
      path: "/app-layout/seo",
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/app-layout/settings",
    },

    {
      key: "layouts",
      label: "Layouts",
      icon: <LayoutGrid className="h-4 w-4" />,
      path: "/app-layout/layout",
    },
  ];

  const handleTabChange = (key: string) => {
    const tab = menuItems.find((item) => item.key === key);
    if (tab) router.push(tab.path);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex gap-0">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
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

export default PagesItemsLayout;
