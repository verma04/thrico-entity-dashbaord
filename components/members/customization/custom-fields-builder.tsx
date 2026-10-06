"use client";

import React, { useState, useMemo } from "react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { CustomFieldItem, ValidationMode } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Sparkles,
  Layers,
  Database,
  LayoutGrid,
  List as ListIcon,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { CustomFieldDrawer } from "./custom-field-drawer";
import { RosterManagerModal } from "./roster-manager-modal";
import { CustomizationStartersDrawer } from "./customization-starters-drawer";
import { CustomFieldsTable } from "./custom-fields-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";

interface CustomFieldsBuilderProps {
  fields: CustomFieldItem[];
  onChange: (fields: CustomFieldItem[]) => void;
}

export function CustomFieldsBuilder({ fields, onChange }: CustomFieldsBuilderProps) {
  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldItem | null>(null);
  const [startersOpen, setStartersOpen] = useState(false);
  const [managingRosterField, setManagingRosterField] = useState<{
    key: string;
    label: string;
  } | null>(null);

  // Filters & View state
  const [search, setSearch] = useState("");
  const [validationFilter, setValidationFilter] = useState<string>("ALL");
  const [requiredFilter, setRequiredFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Open add drawer
  const handleOpenAddDrawer = () => {
    setEditingField(null);
    setDrawerOpen(true);
  };

  // Open edit drawer
  const handleOpenEditDrawer = (field: CustomFieldItem) => {
    setEditingField(field);
    setDrawerOpen(true);
  };

  // Save from drawer
  const handleSaveFieldFromDrawer = (field: CustomFieldItem) => {
    if (editingField) {
      // update existing
      const updated = fields.map((f) => (f.id === field.id ? field : f));
      onChange(updated);
      toast.success(`Updated "${field.label}"`);
    } else {
      // append new
      const nextOrder = fields.length;
      const newField = { ...field, order: nextOrder };
      onChange([...fields, newField]);
      toast.success(`Added "${field.label}"`);
    }
  };

  // Delete field
  const handleDeleteField = (id: string) => {
    const target = fields.find((f) => f.id === id);
    const filtered = fields.filter((f) => f.id !== id);
    onChange(filtered);
    toast.success(`Removed "${target?.label || "field"}"`);
  };

  // Duplicate field
  const handleDuplicateField = (field: CustomFieldItem) => {
    const nextOrder = fields.length;
    const duplicated: CustomFieldItem = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      key: `${field.key}_copy`,
      label: `${field.label} (Copy)`,
      order: nextOrder,
    };
    onChange([...fields, duplicated]);
    toast.success(`Duplicated "${field.label}"`);
  };

  // Toggle required
  const handleToggleRequired = (id: string, required: boolean) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, required } : f));
    onChange(updated);
  };

  // Move up/down
  const handleMoveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const next = [...fields];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);

    // re-index order
    const reordered = next.map((item, idx) => ({ ...item, order: idx }));
    onChange(reordered);
  };

  // Recipe selection from starters drawer
  const handleSelectRecipe = (recipeField: Omit<CustomFieldItem, "id" | "order">) => {
    const newField: CustomFieldItem = {
      ...recipeField,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order: fields.length,
    };
    onChange([...fields, newField]);
    toast.success(`Recipe "${recipeField.label}" added to registration fields.`);
  };

  // Filtered fields
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const labelMatch = (f.label || "").toLowerCase().includes(q);
        const keyMatch = (f.key || "").toLowerCase().includes(q);
        const typeMatch = (f.type || "").toLowerCase().includes(q);
        if (!labelMatch && !keyMatch && !typeMatch) return false;
      }
      if (validationFilter !== "ALL") {
        if (validationFilter === "STANDARD" && (f.validationMode || "NONE") !== "NONE")
          return false;
        if (validationFilter !== "STANDARD" && f.validationMode !== validationFilter)
          return false;
      }
      if (requiredFilter !== "ALL") {
        if (requiredFilter === "REQUIRED" && !f.required) return false;
        if (requiredFilter === "OPTIONAL" && f.required) return false;
      }
      return true;
    });
  }, [fields, search, validationFilter, requiredFilter]);

  return (
    <PolarisFormCard
      icon={Layers}
      title="Custom Registration Inputs & Gatekeeping Rules"
      description="Collect student roll numbers, employee identity codes, and verify inputs against approved CSV rosters or regex patterns."
      badge="Gatekeeper"
    >
      <div className="space-y-4">
        {/* Action & Filter Bar (UTM EcosystemActionBar style) */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            {/* Search */}
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by label, key, or type…"
              />
            </EcosystemActionBar.Item>

            {/* Validation Mode Filter */}
            <Select value={validationFilter} onValueChange={setValidationFilter}>
              <SelectTrigger className="h-[30px] w-[140px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                <SelectValue placeholder="Verification Mode" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                <SelectItem value="ALL">All Modes</SelectItem>
                <SelectItem value="CSV_ROSTER">CSV Whitelist</SelectItem>
                <SelectItem value="REGEX">Regex Pattern</SelectItem>
                <SelectItem value="BOTH">Dual Gatekeeper</SelectItem>
                <SelectItem value="STANDARD">Standard (None)</SelectItem>
              </SelectContent>
            </Select>

            {/* Requirement Filter */}
            <Select value={requiredFilter} onValueChange={setRequiredFilter}>
              <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                <SelectValue placeholder="Requirement" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                <SelectItem value="ALL">All Fields</SelectItem>
                <SelectItem value="REQUIRED">Required Only</SelectItem>
                <SelectItem value="OPTIONAL">Optional Only</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Group>

          {/* Right Action Group */}
          <EcosystemActionBar.Group>
            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#d2d5d9] dark:border-zinc-800 rounded-[4px] p-0.5 bg-[#f6f6f7] dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-[#303030] dark:text-zinc-100"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                }`}
                title="Table View"
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-[#303030] dark:text-zinc-100"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Presets Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStartersOpen(true)}
              className="h-[30px] rounded-[4px] text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Presets</span>
            </Button>

            {/* Add Custom Field Button */}
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAddDrawer}
              className="h-[30px] rounded-[4px] gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Field</span>
            </Button>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Custom Fields Table / Grid */}
        <CustomFieldsTable
          fields={filteredFields}
          viewMode={viewMode}
          onEditField={handleOpenEditDrawer}
          onDuplicateField={handleDuplicateField}
          onDeleteField={handleDeleteField}
          onToggleRequired={handleToggleRequired}
          onMoveField={handleMoveField}
          onOpenRosterManager={(fieldKey, fieldLabel) =>
            setManagingRosterField({ key: fieldKey, label: fieldLabel })
          }
          onAddNewField={handleOpenAddDrawer}
          onOpenStarters={() => setStartersOpen(true)}
        />
      </div>

      {/* Add / Edit Custom Field Drawer */}
      <CustomFieldDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        fieldToEdit={editingField}
        onSave={handleSaveFieldFromDrawer}
        onOpenRosterManager={(fieldKey, fieldLabel) =>
          setManagingRosterField({ key: fieldKey, label: fieldLabel })
        }
      />

      {/* Roster Manager Drawer */}
      {managingRosterField && (
        <RosterManagerModal
          isOpen={!!managingRosterField}
          onClose={() => setManagingRosterField(null)}
          fieldKey={managingRosterField.key}
          fieldLabel={managingRosterField.label}
        />
      )}

      {/* Starter Presets Drawer */}
      <CustomizationStartersDrawer
        open={startersOpen}
        onOpenChange={setStartersOpen}
        onSelectRecipe={handleSelectRecipe}
      />
    </PolarisFormCard>
  );
}
