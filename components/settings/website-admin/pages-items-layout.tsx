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
  ChevronRight
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Tab {
  key: string;
  label: string;
  icon: any;
  path: string;
  description?: string;
}

const menuItems: Tab[] = [
  {
    key: "pages",
    label: "Pages",
    icon: FileText,
    path: "/app-layout/pages",
    description: "Manage your website hierarchy and strategic routing nodes.",
  },
  {
    key: "navigation",
    label: "Navigation",
    icon: Menu,
    path: "/app-layout/navigation",
    description: "Personalize your site's architectural navigation mapping.",
  },
  {
    key: "footer",
    label: "Footer",
    icon: PanelBottom,
    path: "/app-layout/footer",
    description: "Configure global site footer telemetry and links.",
  },
  {
    key: "seo",
    label: "SEO",
    icon: Globe,
    path: "/app-layout/seo",
    description: "Optimize global search engine orchestration visibility.",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    path: "/app-layout/settings",
    description: "Configure global site-wide definitions and protocols.",
  },
  {
    key: "layouts",
    label: "Layouts",
    icon: LayoutGrid,
    path: "/app-layout/layout",
    description: "Customize and deploy architectural layouts across nodes.",
  },
];

const PagesItemsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/app-layout/", "") || "layouts";

  const handleTabChange = (key: string) => {
    const tab = menuItems.find((item) => item.key === key);
    if (tab) router.push(tab.path);
  };

  const activeItem = menuItems.find((item) => item.key === activeTab) || menuItems[5];

  return (
    <EcosystemWrapper>
      {/* Breadcrumb metadata */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400/80 mb-[-12px] opacity-80 animate-in fade-in slide-in-from-left-2 duration-700">
        <span className="hover:text-zinc-600 cursor-default">System</span>
        <ChevronRight size={10} strokeWidth={4} />
        <span className="text-indigo-600">Website Orchestration</span>
      </div>

      <EcosystemHeader
        title={activeItem.label}
        badgeText="Architectural Node"
        description={activeItem.description || "Manage your digital experience hierarchy."}
        icon={activeItem.icon}
      />

      <EcosystemActionBar>
        <div className="flex items-center gap-1.5 p-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={cn(
                  "relative group px-5 py-2.5 rounded-[18px] text-[13px] font-black transition-all duration-300 flex items-center gap-3 active:scale-95 outline-none",
                  isActive 
                    ? "text-zinc-900 shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-white/40"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="action-tab-pill"
                    className="absolute inset-0 bg-white rounded-[18px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)] ring-1 ring-zinc-950/5"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.6 }}
                  />
                )}
                
                <Icon className={cn(
                  "relative z-10 h-4 w-4 transition-all duration-300",
                  isActive ? "text-indigo-600 scale-110" : "text-zinc-400 group-hover:text-zinc-600"
                )} />
                <span className={cn(
                  "relative z-10 leading-none uppercase tracking-widest",
                  isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <Sparkles size={10} className="relative z-10 text-indigo-400 animate-pulse ml-[-6px]" fill="currentColor" />
                )}
              </button>
            );
          })}
        </div>
      </EcosystemActionBar>

      <div className="relative pt-2">
        {/* Subtle layer background hint */}
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-zinc-100 to-transparent" />
        
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-both">
          {children}
        </div>
      </div>
    </EcosystemWrapper>
  );
};

export default PagesItemsLayout;
