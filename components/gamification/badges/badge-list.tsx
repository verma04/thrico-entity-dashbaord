"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Zap,
  Coins,
  MoreHorizontal,
  Copy,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { renderModuleIcon } from "@/components/subscription/utils";
import { Badge, useToggleBadge } from "@/graphql/actions";
import { toast } from "sonner";
import { BadgeIcon } from "./badge-icon";

interface BadgeListProps {
  badges: Badge[];
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
  onEdit: (badge: Badge) => void;
  refetchBadges: () => void;
  refetchStats: () => void;
  isLoading?: boolean;
}

export function BadgeList({
  badges,
  modules,
  onEdit,
  isLoading,
  refetchBadges,
  refetchStats,
}: BadgeListProps) {
  const [toggleBadge, { loading: toggling }] = useToggleBadge({
    onCompleted: () => {
      refetchBadges();
      refetchStats();
      toast.success("Badge status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggleActive = async (id: string) => {
    await toggleBadge({ variables: { id } });
  };

  const getModuleInfo = (moduleId?: string) => {
    if (!moduleId) return null;
    return modules.find(
      (m) =>
        m.id?.toLowerCase() === moduleId.toLowerCase() ||
        (m as any).uuid?.toLowerCase() === moduleId.toLowerCase() ||
        (m as any).slug?.toLowerCase() === moduleId.toLowerCase(),
    );
  };

  const columns = [
    {
      key: "badge",
      header: "Recognition Badge",
      cell: (badge: Badge) => (
        <AdminTableItem
          icon={
            <BadgeIcon
              icon={badge.icon}
              className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm shrink-0 flex items-center justify-center"
            />
          }
          title={badge.name}
          subtitle={badge.description}
        />
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (badge: Badge) => {
        const moduleInfo = getModuleInfo(badge.module);
        const source = badge.source || moduleInfo?.type || "MODULE";
        const isIntegration = source === "INTEGRATION";
        return (
          <AdminTableTag variant={isIntegration ? "purple" : "indigo"}>
            {isIntegration ? "Integration" : "Module"}
          </AdminTableTag>
        );
      },
    },
    {
      key: "origin",
      header: "Domain",
      cell: (badge: Badge) => {
        const moduleInfo = getModuleInfo(badge.module);
        return moduleInfo ? (
          <div className="flex items-center gap-1.5 group">
            <div className="h-5 w-5 rounded flex items-center justify-center bg-muted/60 border border-border/50 transition-colors">
              {renderModuleIcon(
                moduleInfo.icon,
                "h-3 w-3 text-muted-foreground",
              )}
            </div>
            <span className="text-[12px] font-semibold text-foreground truncate max-w-[120px]">
              {moduleInfo.name}
            </span>
          </div>
        ) : (
          <AdminTableTag variant="muted">Global</AdminTableTag>
        );
      },
    },
    {
      key: "criteria",
      header: "Award Criteria",
      cell: (badge: Badge) => {
        const isAction = badge.type === "ACTION";
        return (
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground/70">
              {isAction ? (
                <Zap className="h-3 w-3" />
              ) : (
                <Coins className="h-3 w-3" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-foreground uppercase tracking-tight">
                {isAction
                  ? (badge.condition?.action || badge.action || "").replace(
                      /_/g,
                      " ",
                    )
                  : "Threshold Points"}
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold font-mono">
                REQ:{" "}
                {isAction
                  ? badge.condition?.count || badge.targetValue
                  : `${(badge.condition?.pointsRequired || badge.targetValue)?.toLocaleString()} PTS`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (badge: Badge) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={badge.isActive}
            onCheckedChange={() => handleToggleActive(badge.id)}
            disabled={toggling}
            className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
          />
          <AdminStatusBadge status={badge.isActive ? "APPROVED" : "DISABLED"}>
            {badge.isActive ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-12 text-right",
      className: "text-right",
      cell: (badge: Badge) => (
        <div className="flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-foreground border-b border-border/50 truncate">
                {badge.name}
              </div>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => onEdit(badge)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Edit Badge</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => handleToggleActive(badge.id)}
              >
                <Power
                  className={cn(
                    "h-3.5 w-3.5 mr-2",
                    badge.isActive ? "text-amber-500" : "text-emerald-500",
                  )}
                />
                <span>{badge.isActive ? "Disable Badge" : "Activate Badge"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => {
                  navigator.clipboard.writeText(badge.id);
                  toast.success("Badge ID copied to clipboard");
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Copy Badge ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        size="sm"
      />
    );
}
