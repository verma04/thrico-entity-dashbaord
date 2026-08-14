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
    <div className=" inset-0 z-[50] bg-zinc-50 dark:bg-background flex flex-col">
      {/* ── Graph ── */}
      <div className="flex-1 p-4 overflow-hidden">
        <UsersGraphView isFullScreenMode={true} />
      </div>
    </div>
  );
}

export default withModulePermission(UsersGraphPage, "NETWORK", "canRead");
