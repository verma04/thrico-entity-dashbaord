"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Settings,
  AlertTriangle,
  Activity,
  MessageSquare,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDiscussionForumDetailsByID } from "@/graphql/actions/discussion-form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

const tabItems = [
  { key: "manage", label: "Overview", icon: MessageSquare },
  { key: "comments", label: "Comments", icon: MessageCircle },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function ForumManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/forums/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "") || "manage";

  const { data, loading } = getDiscussionForumDetailsByID({
    variables: {
      input: {
        discussionForumId: id,
      },
    },
    skip: !id,
  });

  const forum = data?.getDiscussionForumDetailsByID;

  const statusColor =
    forum?.status === "APPROVED"
      ? "bg-emerald-500"
      : forum?.status === "DISABLED" || forum?.status === "REJECTED"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-background overflow-y-auto"
      >
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
          <div className="max-w-7xl mx-auto px-6">
            {/* Top bar */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                      statusColor,
                    )}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-lg font-semibold tracking-tight">
                      {loading
                        ? `Loading ${singularName}...`
                        : forum?.title || `${singularName} Details`}
                    </h1>
                    {loading && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                    {!loading && forum?.status && (
                      <Badge
                        variant={
                          forum.status === "APPROVED" ? "default" : "secondary"
                        }
                        className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md"
                      >
                        {forum.status}
                      </Badge>
                    )}
                  </div>
                  {!loading && (
                    <p className="text-xs text-muted-foreground">
                      {forum?.author?.firstName} {forum?.author?.lastName} ·{" "}
                      {forum?.category?.name || "General"}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-muted/80 transition-colors"
                onClick={() => router.push("/forums/all")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-1 -mb-px">
              {tabItems.map((tab) => {
                const isActive = currentTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (tab.key === "manage") {
                        router.push(`/forums/${id}/manage`);
                      } else {
                        router.push(`/forums/${id}/${tab.key}`);
                      }
                    }}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/80",
                      tab.key === "danger-zone" &&
                        isActive &&
                        "text-destructive",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        tab.key === "danger-zone" &&
                          isActive &&
                          "text-destructive",
                      )}
                    />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="forum-tab-indicator"
                        className={cn(
                          "absolute bottom-0 left-0 right-0 h-[2px]",
                          tab.key === "danger-zone"
                            ? "bg-destructive"
                            : "bg-primary",
                        )}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/forums/all"
                  className="text-xs font-medium"
                >
                  {moduleName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-medium">
                  {forum?.title || `${singularName} Details`}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default withModulePermission(ForumManagementLayout, "FORUMS", "canRead");
