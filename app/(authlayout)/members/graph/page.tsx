"use client";

import React from "react";
import { UsersGraphView } from "@/components/users/users-graph-view";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network } from "lucide-react";

function UsersGraphPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[50] bg-zinc-50 dark:bg-background flex flex-col">
      {/* ── Header ── */}
      <div className="h-14 bg-white dark:bg-neutral-900 border-b border-zinc-200 dark:border-neutral-800 flex items-center justify-between px-4 shadow-sm shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Members Network Graph
          </h1>
        </div>
        <div className="w-[84px]"></div> {/* Spacer for centering */}
      </div>

      {/* ── Graph ── */}
      <div className="flex-1 p-4 overflow-hidden">
        <UsersGraphView isFullScreenMode={true} />
      </div>
    </div>
  );
}

export default withModulePermission(UsersGraphPage, "NETWORK", "canRead");
