"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  ScrollText,
  MessageCircleQuestion,
  Users,
  ChevronRight,
  Globe,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "settings", label: "Settings", icon: Settings, href: "/communities/settings" },
  { id: "terms", label: "Terms", icon: ScrollText, href: "/communities/settings/term_and_conditions" },
  { id: "faq", label: "FAQ", icon: MessageCircleQuestion, href: "/communities/settings/faq" },
];

function CommunitySettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = TABS.find(t => t.href === pathname) || TABS[0];

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      {/* breadcrumb-style mini nav */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
        <span className="hover:text-zinc-600 transition-colors cursor-pointer">Modules</span>
        <ChevronRight size={10} strokeWidth={3} className="text-zinc-300" />
        <span className="text-indigo-600">Community Ecosystem</span>
      </div>

      {/* Main Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-2">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50/50">
            <Users size={32} strokeWidth={2} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">
                Community Settings
              </h1>
              <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                ACTIVE
              </div>
            </div>
            <p className="text-[14px] font-semibold text-zinc-400 tracking-tight flex items-center gap-2">
              <Globe size={14} className="opacity-70" />
              Syncing global community configurations across 14 nodes.
            </p>
          </div>
        </div>

        {/* Tab Navigation Area */}
        <div className="flex bg-zinc-100/80 p-1.5 rounded-[20px] ring-1 ring-zinc-200/50 shadow-inner max-w-fit self-start md:self-auto">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "relative flex items-center gap-2.5 px-6 py-2.5 rounded-[16px] text-[13px] font-black transition-all group/tab",
                  isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white rounded-[16px] shadow-sm ring-1 ring-zinc-950/5"
                    transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                  />
                )}
                <tab.icon 
                  size={16} 
                  strokeWidth={2.5} 
                  className={cn(
                    "relative z-10 transition-transform group-hover/tab:scale-110",
                    isActive ? "text-indigo-600" : "text-zinc-400 group-hover/tab:text-zinc-500"
                  )} 
                />
                <span className="relative z-10 uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Content Grid */}
      <div className="flex-1 relative">
        {/* Subtle background flair */}
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-indigo-50/20 blur-[120px] rounded-full -z-10" />
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          {children}
        </div>
      </div>

      {/* Global Status Footer */}
      <div className="py-6 border-t border-zinc-100 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <Sparkles size={12} className="text-zinc-300" />
          Quantum Design System v2.0
        </div>
        <div className="text-[10px] font-bold text-zinc-200 italic">
          Last sync: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default CommunitySettingsLayout;
