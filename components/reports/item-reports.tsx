"use client";

import React from "react";
import { useGetAllReports, ReportModule } from "@/graphql/actions";
import ReportsList from "@/components/reports/reports-list";
import { Loader2, ShieldAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModulePermission } from "@/hooks/use-module-permission";

interface ItemReportsProps {
  targetId: string;
  moduleName: ReportModule;
  permissionModule: string;
}

export default function ItemReports({ targetId, moduleName, permissionModule }: ItemReportsProps) {
  const canEdit = useModulePermission(permissionModule, "canEdit");
  
  const { data, loading, refetch } = useGetAllReports({
    variables: {
      targetId,
      module: moduleName,
      limit: 100,
      page: 1,
    },
    skip: !targetId,
    fetchPolicy: "cache-and-network",
  });

  const reports = data?.getAllReports?.reports || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
            Reported Items
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View and manage user reports submitted against this item.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-xl h-10 shadow-sm">
          <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="bg-card rounded-2xl border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden">
        <div className="p-1">
          <ReportsList data={reports} loading={loading} canEdit={canEdit} />
        </div>
      </div>
    </div>
  );
}
