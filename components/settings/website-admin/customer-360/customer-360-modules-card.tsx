"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  CheckCheck,
  XCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Customer360ApiKeyModule } from "@/graphql/actions/customer-360-api-key";
import { MODULE_ICONS, MODULE_CATEGORY_LABELS } from "./types";

interface Customer360ModulesCardProps {
  modules: Customer360ApiKeyModule[];
  loading: boolean;
  onToggleModule: (moduleName: string, enabled: boolean) => void;
  onBatchToggleAll: (enabled: boolean) => void;
  isToggling?: boolean;
}

export function Customer360ModulesCard({
  modules,
  loading,
  onToggleModule,
  onBatchToggleAll,
  isToggling,
}: Customer360ModulesCardProps) {
  const [search, setSearch] = useState("");

  const filteredModules = useMemo(() => {
    if (!search.trim()) return modules;
    const query = search.toLowerCase().trim();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.module.toLowerCase().includes(query) ||
        (m.description && m.description.toLowerCase().includes(query))
    );
  }, [modules, search]);

  const enabledCount = modules.filter((m) => m.enabled).length;

  return (
    <PolarisFormCard
      icon={ShieldCheck}
      title="Module Permissions & Scopes"
      description="Configure granular module boundaries. Endpoints for disabled modules will reject client queries."
      badge={`${enabledCount}/${modules.length} Enabled`}
      badgeVariant={enabledCount === modules.length ? "emerald" : "outline"}
    >
      <div className="space-y-4 pt-1">
        {/* Controls: Search & Batch buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search module permissions…"
              className="h-8 pl-8 text-xs bg-muted/30 border-[#e1e3e5] dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchToggleAll(true)}
              disabled={isToggling || enabledCount === modules.length}
              className="h-7 gap-1 text-[11px] font-medium px-2.5"
            >
              <CheckCheck className="h-3 w-3 text-emerald-600" />
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchToggleAll(false)}
              disabled={isToggling || enabledCount === 0}
              className="h-7 gap-1 text-[11px] font-medium px-2.5 text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-3 w-3 text-red-500" />
              Disable All
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredModules.map((item) => {
            const Icon = MODULE_ICONS[item.module] || Layers;
            const category = MODULE_CATEGORY_LABELS[item.module] || "Feature Module";

            return (
              <div
                key={item.module}
                className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-colors ${
                  item.enabled
                    ? "bg-white dark:bg-zinc-900 border-[#e1e3e5] dark:border-zinc-800 shadow-2xs"
                    : "bg-[#fcfdfe] dark:bg-zinc-900/40 border-dashed border-[#e4e6e8] dark:border-zinc-800/80 opacity-75"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${
                      item.enabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-foreground leading-tight">
                        {item.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1 py-0 h-4 font-normal text-muted-foreground bg-muted/60"
                      >
                        {category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                      {item.description || `Access and query ${item.name} records and events.`}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) => onToggleModule(item.module, checked)}
                    className="data-[state=checked]:bg-emerald-600 scale-90"
                    title={`${item.enabled ? "Disable" : "Enable"} ${item.name}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No module permissions matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </PolarisFormCard>
  );
}
