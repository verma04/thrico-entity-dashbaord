"use client";

import React from "react";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Pencil, Award, Zap, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { renderModuleIcon } from "@/components/subscription/utils";
import { Badge, useToggleBadge } from "@/graphql/actions";
import { toast } from "sonner";

interface BadgeListProps {
  badges: Badge[];
  modules: { id: string; name: string; icon: string }[];
  onEdit: (badge: Badge) => void;
  refetchBadges: () => void;
  isLoading?: boolean;
}

export function BadgeList({
  badges,
  modules,
  onEdit,
  isLoading,
  refetchBadges,
}: BadgeListProps) {
  const [toggleBadge, { loading: toggling }] = useToggleBadge({
    onCompleted: () => {
       refetchBadges();
       toast.success("Badge status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggleActive = async (id: string) => {
    await toggleBadge({ variables: { id } });
  };

  const getModuleInfo = (moduleId?: string) => {
    if (!moduleId) return null;
    return modules.find((m) => m.id === moduleId);
  };

  const columns = [
    {
      key: "badge",
      header: "Recognition Badge",
      cell: (badge: Badge) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-xl shrink-0 shadow-sm">
            {badge.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate max-w-[180px]">
              {badge.name}
            </span>
            <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[220px]">
              {badge.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "origin",
      header: "Domain",
      cell: (badge: Badge) => {
        const moduleInfo = getModuleInfo(badge.module);
        return moduleInfo ? (
          <div className="flex items-center gap-2 group">
             <div className="h-6 w-6 rounded flex items-center justify-center bg-muted/60 border border-border/50 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
               {renderModuleIcon(moduleInfo.icon, "h-3 w-3 text-muted-foreground group-hover:text-indigo-600")}
             </div>
             <span className="text-[11px] font-bold text-foreground">
               {moduleInfo.name}
             </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-black text-blue-700 uppercase tracking-widest">
            Global
          </div>
        );
      },
    },
    {
      key: "criteria",
      header: "Award Criteria",
      cell: (badge: Badge) => {
        const isAction = badge.type === "ACTION";
        return (
          <div className="flex items-center gap-2">
             <div className={isAction ? "text-amber-500" : "text-emerald-500"}>
                {isAction ? <Zap className="h-3.5 w-3.5" /> : <Coins className="h-3.5 w-3.5" />}
             </div>
             <div className="flex flex-col">
               <span className="text-[11px] font-black text-foreground uppercase tracking-tight">
                 {isAction ? 
                   (badge.condition?.action || badge.action || "").replace(/_/g, " ") : 
                   "Threshold Points"
                 }
               </span>
               <span className="text-[9px] text-muted-foreground font-bold font-mono">
                 REQUIREMENT: {isAction ? 
                   (badge.condition?.count || badge.targetValue) : 
                   `${(badge.condition?.pointsRequired || badge.targetValue)?.toLocaleString()} PTS`
                 }
               </span>
             </div>
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      cell: (badge: Badge) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={badge.isActive}
            onCheckedChange={() => handleToggleActive(badge.id)}
            disabled={toggling}
            className="scale-90 data-[state=checked]:bg-emerald-500"
          />
          <AdminStatusBadge status={badge.isActive ? "APPROVED" : "PENDING"}>
             {badge.isActive ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (badge: Badge) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all rounded-lg"
            onClick={() => onEdit(badge)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
       columns={columns}
       data={badges || []}
       loading={isLoading}
       keyExtractor={(badge) => badge.id}
       emptyTitle="No badges defined"
       emptyDescription="Badges motivate community participation. Create your first credential to reward member loyalty."
    />
  );
}
