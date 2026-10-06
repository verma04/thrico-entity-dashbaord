"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Database,
  Regex,
  ShieldCheck,
  Check,
  AlertCircle,
  FileCheck2,
  Type,
  Hash,
  Mail,
  Phone,
  ListFilter,
  AlignLeft,
  Calendar,
  Globe,
  CheckSquare,
  Sparkles,
  MoreHorizontal,
  Plus,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CustomFieldItem,
  CustomFieldType,
  ValidationMode,
  FIELD_TYPE_LABELS,
} from "./types";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<CustomFieldType, React.ReactNode> = {
  text: <Type className="w-3.5 h-3.5" />,
  number: <Hash className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  tel: <Phone className="w-3.5 h-3.5" />,
  select: <ListFilter className="w-3.5 h-3.5" />,
  textarea: <AlignLeft className="w-3.5 h-3.5" />,
  date: <Calendar className="w-3.5 h-3.5" />,
  url: <Globe className="w-3.5 h-3.5" />,
  checkbox: <CheckSquare className="w-3.5 h-3.5" />,
};

interface CustomFieldsTableProps {
  fields: CustomFieldItem[];
  viewMode?: "table" | "grid";
  onEditField: (field: CustomFieldItem) => void;
  onDuplicateField?: (field: CustomFieldItem) => void;
  onDeleteField: (id: string) => void;
  onToggleRequired: (id: string, required: boolean) => void;
  onMoveField: (index: number, direction: "up" | "down") => void;
  onOpenRosterManager: (fieldKey: string, fieldLabel: string) => void;
  onAddNewField: () => void;
  onOpenStarters: () => void;
}

export function CustomFieldsTable({
  fields,
  viewMode = "table",
  onEditField,
  onDuplicateField,
  onDeleteField,
  onToggleRequired,
  onMoveField,
  onOpenRosterManager,
  onAddNewField,
  onOpenStarters,
}: CustomFieldsTableProps) {
  const [fieldToDelete, setFieldToDelete] = useState<CustomFieldItem | null>(null);

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/80 rounded-2xl p-8 text-center bg-card shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 mb-3.5">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No Custom Registration Fields</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Collect custom member data such as Student Roll Numbers, Employee IDs, or Department choices during registration.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenStarters}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Browse Recipes
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onAddNewField}
            className="text-xs h-8 gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Field
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === "table" ? (
        <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">Order</th>
                  <th className="py-3 px-4">Field Identity</th>
                  <th className="py-3 px-4">Verification & Gatekeeping</th>
                  <th className="py-3 px-4">Security Rules</th>
                  <th className="py-3 px-4 text-center">Mandatory</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {fields.map((field, index) => {
                  const mode = field.validationMode || "NONE";
                  const hasRoster = mode === "CSV_ROSTER" || mode === "BOTH";

                  return (
                    <tr
                      key={field.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Reorder Buttons */}
                      <td className="py-3 px-2 text-center align-middle">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => onMoveField(index, "up")}
                            className="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === fields.length - 1}
                            onClick={() => onMoveField(index, "down")}
                            className="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Field Identity */}
                      <td className="py-3 px-4 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-xs">
                              {field.label}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 font-normal border-border flex items-center gap-1"
                            >
                              <span className="text-muted-foreground">{TYPE_ICONS[field.type]}</span>
                              <span>{FIELD_TYPE_LABELS[field.type]?.label || field.type}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              {field.key}
                            </span>
                            {field.type === "select" && field.options && (
                              <span>· {field.options.length} options</span>
                            )}
                            {field.placeholder && (
                              <span className="truncate max-w-[150px]">
                                · &ldquo;{field.placeholder}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Verification & Gatekeeping Mode */}
                      <td className="py-3 px-4 align-middle">
                        <div className="space-y-1">
                          {mode === "CSV_ROSTER" && (
                            <div className="flex items-center gap-1.5">
                              <Badge className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800 flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                CSV Whitelist
                              </Badge>
                              <button
                                type="button"
                                onClick={() => onOpenRosterManager(field.key, field.label)}
                                className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                Manage
                              </button>
                            </div>
                          )}

                          {mode === "REGEX" && (
                            <div className="space-y-0.5">
                              <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1">
                                <Regex className="w-3 h-3" />
                                Regex Pattern
                              </Badge>
                              {field.validationRegex && (
                                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[180px]">
                                  {field.validationRegex}
                                </p>
                              )}
                            </div>
                          )}

                          {mode === "BOTH" && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  Dual Gatekeeper
                                </Badge>
                                <button
                                  type="button"
                                  onClick={() => onOpenRosterManager(field.key, field.label)}
                                  className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                >
                                  Manage Roster
                                </button>
                              </div>
                              {field.validationRegex && (
                                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[180px]">
                                  {field.validationRegex}
                                </p>
                              )}
                            </div>
                          )}

                          {mode === "NONE" && (
                            <span className="text-[11px] text-muted-foreground italic">
                              Standard Input
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Security Rules */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {field.blockIfNotExists && (
                            <Badge
                              variant="outline"
                              className="text-[9px] text-purple-700 dark:text-purple-300 border-purple-300 bg-purple-50 dark:bg-purple-950/40"
                              title="Blocks signups if ID not found in uploaded CSV whitelist"
                            >
                              Gatekeeper
                            </Badge>
                          )}
                          {field.preventDuplicate && (
                            <Badge
                              variant="outline"
                              className="text-[9px] text-blue-700 dark:text-blue-300 border-blue-300 bg-blue-50 dark:bg-blue-950/40"
                              title="Prevents duplicate registrations with the same ID"
                            >
                              1:1 Claim
                            </Badge>
                          )}
                          {!field.blockIfNotExists && !field.preventDuplicate && (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>

                      {/* Mandatory Switch */}
                      <td className="py-3 px-4 text-center align-middle">
                        <div className="inline-flex items-center gap-1.5">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => onToggleRequired(field.id, checked)}
                            className="data-[state=checked]:bg-indigo-600 scale-75"
                          />
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {field.required ? "Req" : "Opt"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasRoster && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenRosterManager(field.key, field.label)}
                              className="h-7 px-2.5 text-[11px] gap-1.5 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 cursor-pointer font-medium"
                              title="Manage CSV Roster"
                            >
                              <Database className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span>Roster</span>
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onEditField(field)}
                            className="h-7 px-2.5 text-[11px] gap-1 border-border/80 text-foreground hover:bg-muted cursor-pointer font-medium"
                            title="Edit Field"
                          >
                            <Edit2 className="w-3 h-3 text-indigo-500" />
                            <span>Edit</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                                title="More Actions"
                              >
                                <span>Actions</span>
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => onEditField(field)}
                                className="cursor-pointer text-xs"
                              >
                                <Edit2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                Edit Field
                              </DropdownMenuItem>
                              {hasRoster && (
                                <DropdownMenuItem
                                  onClick={() => onOpenRosterManager(field.key, field.label)}
                                  className="cursor-pointer text-xs"
                                >
                                  <Database className="w-3.5 h-3.5 mr-2 text-purple-500" />
                                  Manage CSV Roster
                                </DropdownMenuItem>
                              )}
                              {onDuplicateField && (
                                <DropdownMenuItem
                                  onClick={() => onDuplicateField(field)}
                                  className="cursor-pointer text-xs"
                                >
                                  <Copy className="w-3.5 h-3.5 mr-2 text-blue-500" />
                                  Duplicate Field
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={index === 0}
                                onClick={() => onMoveField(index, "up")}
                                className="cursor-pointer text-xs"
                              >
                                <ArrowUp className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                                Move Up
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={index === fields.length - 1}
                                onClick={() => onMoveField(index, "down")}
                                className="cursor-pointer text-xs"
                              >
                                <ArrowDown className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                                Move Down
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setFieldToDelete(field)}
                                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Delete Field
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {fields.map((field, index) => {
            const mode = field.validationMode || "NONE";
            const hasRoster = mode === "CSV_ROSTER" || mode === "BOTH";

            return (
              <Card
                key={field.id}
                className="border-border/70 bg-card hover:border-border transition-all shadow-2xs group flex flex-col justify-between"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-foreground truncate">
                          {field.label}
                        </span>
                        {field.required && (
                          <Badge variant="destructive" className="text-[8px] px-1 py-0 uppercase">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {field.key}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 font-normal shrink-0 flex items-center gap-1"
                    >
                      <span className="text-muted-foreground">{TYPE_ICONS[field.type]}</span>
                      <span>{FIELD_TYPE_LABELS[field.type]?.label || field.type}</span>
                    </Badge>
                  </div>

                  {/* Mode Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mode === "CSV_ROSTER" && (
                      <Badge className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200">
                        CSV Whitelist
                      </Badge>
                    )}
                    {mode === "REGEX" && (
                      <Badge className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
                        Regex Pattern
                      </Badge>
                    )}
                    {mode === "BOTH" && (
                      <Badge className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">
                        Dual Gatekeeper
                      </Badge>
                    )}
                    {field.blockIfNotExists && (
                      <Badge
                        variant="outline"
                        className="text-[8px] text-purple-700 border-purple-300 bg-purple-50"
                      >
                        Gatekeeper
                      </Badge>
                    )}
                    {field.preventDuplicate && (
                      <Badge
                        variant="outline"
                        className="text-[8px] text-blue-700 border-blue-300 bg-blue-50"
                      >
                        1:1 Claim
                      </Badge>
                    )}
                  </div>

                  {/* Sample input simulation */}
                  <div className="rounded-md border border-border/60 bg-muted/20 p-2 text-[10px] font-mono text-muted-foreground truncate">
                    {field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  </div>
                </CardContent>

                {/* Card Footer Actions */}
                <div className="p-3 pt-0 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMoveField(index, "up")}
                      className="h-6 w-6 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer flex items-center justify-center"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fields.length - 1}
                      onClick={() => onMoveField(index, "down")}
                      className="h-6 w-6 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer flex items-center justify-center"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasRoster && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenRosterManager(field.key, field.label)}
                        className="h-7 text-[10px] px-2 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        Roster
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditField(field)}
                      className="h-7 text-[11px] px-2.5 gap-1 font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-indigo-500" />
                      <span>Edit</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                          title="Actions"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onEditField(field)}
                          className="cursor-pointer text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                          Edit Field
                        </DropdownMenuItem>
                        {hasRoster && (
                          <DropdownMenuItem
                            onClick={() => onOpenRosterManager(field.key, field.label)}
                            className="cursor-pointer text-xs"
                          >
                            <Database className="w-3.5 h-3.5 mr-2 text-purple-500" />
                            Manage CSV Roster
                          </DropdownMenuItem>
                        )}
                        {onDuplicateField && (
                          <DropdownMenuItem
                            onClick={() => onDuplicateField(field)}
                            className="cursor-pointer text-xs"
                          >
                            <Copy className="w-3.5 h-3.5 mr-2 text-blue-500" />
                            Duplicate Field
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setFieldToDelete(field)}
                          className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Delete Field
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Field Confirmation Dialog */}
      <AlertDialog
        open={!!fieldToDelete}
        onOpenChange={(open) => !open && setFieldToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong className="text-foreground">{fieldToDelete?.label}</strong> (
              <code className="font-mono text-xs">{fieldToDelete?.key}</code>)? Members will no
              longer be asked for this input during onboarding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (fieldToDelete) onDeleteField(fieldToDelete.id);
                setFieldToDelete(null);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Delete Field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
