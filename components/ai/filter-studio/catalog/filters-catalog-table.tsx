"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Smartphone,
  Edit3,
  Eye,
  Camera,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARFilterRecord } from "../types/ar-manifest";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { STARTER_LAYERS } from "../preview/starter-templates";
import { TestDeviceModal } from "../modals/test-device-modal";
import { cn } from "@/lib/utils";

const MOCK_FILTERS: ARFilterRecord[] = [
  {
    id: "filter_festive_royal_001",
    tenantId: "tenant_demo_brand",
    name: "Festive Golden Aura & Crown",
    description: "Ornate Indian festive gold filigree crown with glowing stardust particles.",
    category: "face-mask",
    thumbnailUrl: STARTER_LAYERS["festive-crown"].assetUrl,
    status: "published",
    currentVersion: "1.0.0",
    versionsCount: 3,
    platforms: ["web", "ios", "android"],
    impressions: 48920,
    captures: 14230,
    shares: 6810,
    updatedAt: "2026-10-10T14:20:00Z",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "filter_cyber_visor_002",
    tenantId: "tenant_demo_brand",
    name: "Cyberpunk HUD Visor",
    description: "Neon cyan and purple heads-up display visor with scanning grid animations.",
    category: "accessory",
    thumbnailUrl: STARTER_LAYERS["cyber-visor"].assetUrl,
    status: "published",
    currentVersion: "1.1.2",
    versionsCount: 4,
    platforms: ["web", "ios", "android"],
    impressions: 32180,
    captures: 9850,
    shares: 4120,
    updatedAt: "2026-10-08T09:15:00Z",
    createdAt: "2026-10-02T11:30:00Z",
  },
  {
    id: "filter_mystic_butterfly_003",
    tenantId: "tenant_demo_brand",
    name: "Holographic Butterfly Tiara",
    description: "Iridescent pink-purple butterfly decals with subtle floating motion.",
    category: "face-overlay",
    thumbnailUrl: STARTER_LAYERS["mystic-butterflies"].assetUrl,
    status: "published",
    currentVersion: "1.0.0",
    versionsCount: 1,
    platforms: ["web", "ios"],
    impressions: 19400,
    captures: 6200,
    shares: 3100,
    updatedAt: "2026-10-09T16:45:00Z",
    createdAt: "2026-10-05T14:00:00Z",
  },
  {
    id: "filter_stardust_aura_004",
    tenantId: "tenant_demo_brand",
    name: "Golden Stardust Halo",
    description: "Full facial ambient particle field for Diwali promotional events.",
    category: "face-mask",
    thumbnailUrl: STARTER_LAYERS["sparkle-particles"].assetUrl,
    status: "draft",
    currentVersion: "0.9.0",
    versionsCount: 1,
    platforms: ["web", "ios", "android"],
    impressions: 0,
    captures: 0,
    shares: 0,
    updatedAt: "2026-10-11T08:00:00Z",
    createdAt: "2026-10-11T08:00:00Z",
  },
];

export function FiltersCatalogTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [testModalOpen, setTestModalOpen] = useState(false);
  const { loadTemplate } = useFilterStudioStore();

  const filtered = MOCK_FILTERS.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || f.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || f.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleEdit = (filter: ARFilterRecord) => {
    if (filter.id.includes("cyber")) loadTemplate("cyber-visor");
    else if (filter.id.includes("butterfly")) loadTemplate("mystic-butterflies");
    else loadTemplate("festive-crown");
    router.push("/ai/filter-studio");
  };

  return (
    <div className="p-6 space-y-6 select-none max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Filters & Effects Catalog
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage drafts, published AR filters, version histories, and SDK distribution.
          </p>
        </div>

        <Button
          onClick={() => router.push("/ai/filter-studio")}
          className="h-9 text-xs gap-2 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-medium cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Filter</span>
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by filter title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-background"
          />
        </div>

        {/* Category & Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            {[
              { value: "all", label: "All Categories" },
              { value: "face-mask", label: "Face Masks" },
              { value: "face-overlay", label: "Overlays" },
              { value: "accessory", label: "Accessories" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border",
                  selectedCategory === cat.value
                    ? "border-foreground bg-foreground text-background font-semibold"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border shrink-0" />

          <div className="flex items-center gap-1.5">
            {[
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={cn(
                  "px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border",
                  selectedStatus === st.value
                    ? "border-indigo-600 bg-indigo-600 text-white font-semibold"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all group"
          >
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-zinc-950 border border-border/60 flex items-center justify-center overflow-hidden shrink-0 p-1">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {item.name}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {item.id}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] capitalize font-mono shrink-0",
                    item.status === "published"
                      ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-amber-500/30 text-amber-600 bg-amber-50/40 dark:bg-amber-950/20"
                  )}
                >
                  {item.status} v{item.currentVersion}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Supported Platforms */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.platforms.map((plat) => (
                  <span
                    key={plat}
                    className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-semibold bg-muted text-muted-foreground border border-border/50"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>

            {/* Telemetry Stats */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-2.5 w-2.5" />
                  <span>Views</span>
                </p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {item.impressions.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Camera className="h-2.5 w-2.5" />
                  <span>Captures</span>
                </p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {item.captures.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Share2 className="h-2.5 w-2.5" />
                  <span>Shares</span>
                </p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {item.shares.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTestModalOpen(true)}
                className="h-8 text-xs gap-1.5 flex-1 cursor-pointer"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Test Live</span>
              </Button>

              <Button
                size="sm"
                onClick={() => handleEdit(item)}
                className="h-8 text-xs gap-1.5 flex-1 bg-foreground text-background hover:bg-foreground/90 font-medium cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit in Studio</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <TestDeviceModal
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
      />
    </div>
  );
}
