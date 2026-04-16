"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Globe,
  Menu,
  Settings,
  PanelBottom,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

interface Tab {
  key: string;
  label: string;
  icon: any;
  href: string;
  description?: string;
}

const menuItems: Tab[] = [
  {
    key: "pages",
    label: "Pages",
    icon: <FileText />,
    href: "/app-layout/pages",
    description: "Manage your website hierarchy and strategic routing nodes.",
  },
  {
    key: "navigation",
    label: "Navigation",
    icon: <Menu />,
    href: "/app-layout/navigation",
    description: "Personalize your site's architectural navigation mapping.",
  },
  {
    key: "footer",
    label: "Footer",
    icon: <PanelBottom />,
    href: "/app-layout/footer",
    description: "Configure global site footer telemetry and links.",
  },
  {
    key: "seo",
    label: "SEO",
    icon: <Globe />,
    href: "/app-layout/seo",
    description: "Optimize global search engine orchestration visibility.",
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings />,
    href: "/app-layout/settings",
    description: "Configure global site-wide definitions and protocols.",
  },
  {
    key: "layouts",
    label: "Layouts",
    icon: <LayoutGrid />,
    href: "/app-layout/layout",
    description: "Customize and deploy architectural layouts across nodes.",
  },
];

const PagesItemsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isTakeoverPage = pathname.includes("/app-layout/layout");

  return (
    <EcosystemWrapper>
      {/* Breadcrumb metadata */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400/80 mb-[-12px] opacity-80 animate-in fade-in slide-in-from-left-2 duration-700">
        <span className="hover:text-zinc-600 cursor-default">System</span>
        <ChevronRight size={10} strokeWidth={4} />
        <span className="text-indigo-600">Website Orchestration</span>
      </div>

      <MenuItemsLayout
        fixed={isTakeoverPage}
        fullHeight={isTakeoverPage}
        showAdminTabs={isTakeoverPage}
        active={"app-layout"}
        items={menuItems}
      >
        <div className="relative pt-2">
          {/* Subtle layer background hint */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-zinc-100 to-transparent" />

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-both">
            {children}
          </div>
        </div>
      </MenuItemsLayout>
    </EcosystemWrapper>
  );
};

export default PagesItemsLayout;
