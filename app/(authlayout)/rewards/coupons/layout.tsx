"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, LayoutGrid, Package } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";

export default function CouponsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      key: "gallery",
      label: "Gallery",
      icon: LayoutGrid,
      href: "/rewards/coupons",
    },
    {
      key: "vouchers",
      label: "Vouchers",
      icon: Ticket,
      href: "/rewards/coupons/vouchers",
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Rewards & Vouchers"
        description="Monitor reward distribution lifecycle, manage voucher credentials and inventory stock levels from a unified interface."
        badgeText="Economic Hub"
        icon={Ticket}
      />

      <EcosystemActionBar
        shadow="none"
        className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-2xl">
            <div className="flex h-12 items-center gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive =
                  pathname === tab.href ||
                  (tab.key === "gallery" && pathname === "/rewards/coupons");

                // Special check for exact match on gallery to avoid active state on sub-paths
                const isExactActive =
                  (tab.key === "gallery" && pathname === "/rewards/coupons") ||
                  (tab.key !== "gallery" && pathname.startsWith(tab.href));

                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={cn(
                      "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 outline-none whitespace-nowrap",
                      isExactActive
                        ? "text-indigo-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    )}
                  >
                    {isExactActive && (
                      <motion.span
                        layoutId="coupons-tab-pill"
                        className="absolute inset-0 rounded-lg bg-indigo-50/50 border border-indigo-100/50 shadow-sm"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}

                    <Icon
                      className={cn(
                        "relative z-10 h-3.5 w-3.5 transition-colors duration-200",
                        isExactActive
                          ? "text-indigo-600"
                          : "text-muted-foreground group-hover/tab:text-foreground",
                      )}
                    />

                    <span
                      className={cn(
                        "relative z-10 leading-none tracking-tight transition-all",
                        isExactActive ? "font-bold" : "font-medium",
                      )}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <div className="flex-1">{children}</div>
    </EcosystemWrapper>
  );
}
