"use client";

import React, { useState } from "react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { CustomFieldItem, CustomFieldType, FIELD_TYPE_LABELS } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
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
  Layers,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CustomFieldsBuilderProps {
  fields: CustomFieldItem[];
  onChange: (fields: CustomFieldItem[]) => void;
}

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

// Preset templates for quick 1-click addition
const PRESETS: Array<{
  label: string;
  key: string;
  type: CustomFieldType;
  placeholder: string;
  required: boolean;
  options?: string[];
}> = [
  {
    label: "Company / Organization",
    key: "company_name",
    type: "text",
    placeholder: "e.g. Acme Corp",
    required: false,
  },
  {
    label: "Job Title / Role",
    key: "job_title",
    type: "text",
    placeholder: "e.g. Product Lead",
    required: false,
  },
  {
    label: "LinkedIn Profile",
    key: "linkedin_url",
    type: "url",
    placeholder: "https://linkedin.com/in/username",
    required: false,
  },
  {
    label: "Experience Level",
    key: "experience_level",
    type: "select",
    placeholder: "Select your level",
    required: false,
    options: ["Student", "Entry Level", "Mid-Level", "Senior", "Lead / Executive"],
  },
  {
    label: "Short Bio",
    key: "bio",
    type: "textarea",
    placeholder: "Tell the community a little about yourself...",
    required: false,
  },
  {
    label: "Student / Employee ID",
    key: "id_number",
    type: "text",
    placeholder: "e.g. STU-2026-99",
    required: true,
  },
];

function generateFieldId(key: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `fld_${key}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `fld_${key}_${Date.now().toString(36)}`;
}

export function CustomFieldsBuilder({ fields, onChange }: CustomFieldsBuilderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // Form state for creating/editing
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldType, setFieldType] = useState<CustomFieldType>("text");
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldHelperText, setFieldHelperText] = useState("");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [newOptionInput, setNewOptionInput] = useState("");

  const handleOpenAddModal = () => {
    setEditingFieldId(null);
    setFieldLabel("");
    setFieldKey("");
    setFieldType("text");
    setFieldPlaceholder("");
    setFieldHelperText("");
    setFieldRequired(false);
    setFieldOptions([]);
    setNewOptionInput("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (field: CustomFieldItem) => {
    setEditingFieldId(field.id);
    setFieldLabel(field.label);
    setFieldKey(field.key);
    setFieldType(field.type);
    setFieldPlaceholder(field.placeholder || "");
    setFieldHelperText(field.helperText || "");
    setFieldRequired(field.required);
    setFieldOptions(field.options ? [...field.options] : []);
    setNewOptionInput("");
    setModalOpen(true);
  };

  const handleLabelChange = (val: string) => {
    setFieldLabel(val);
    if (!editingFieldId) {
      // auto-slugify if new
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      setFieldKey(slug);
    }
  };

  const handleAddOption = () => {
    const trimmed = newOptionInput.trim();
    if (!trimmed) return;
    if (fieldOptions.includes(trimmed)) {
      toast.error("Option already exists.");
      return;
    }
    setFieldOptions([...fieldOptions, trimmed]);
    setNewOptionInput("");
  };

  const handleRemoveOption = (index: number) => {
    setFieldOptions(fieldOptions.filter((_, i) => i !== index));
  };

  const handleSaveModal = () => {
    if (!fieldLabel.trim()) {
      toast.error("Please enter a field label.");
      return;
    }
    const cleanKey = (fieldKey.trim() || fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_"))
      .replace(/^_+|_+$/g, "");

    // Check duplicate key
    const duplicate = fields.find(
      (f) => f.key.toLowerCase() === cleanKey.toLowerCase() && f.id !== editingFieldId
    );
    if (duplicate) {
      toast.error(`A field with key "${cleanKey}" already exists.`);
      return;
    }

    if (fieldType === "select" && fieldOptions.length === 0) {
      toast.error("Please add at least one option for the dropdown.");
      return;
    }

    if (editingFieldId) {
      const updated = fields.map((f) =>
        f.id === editingFieldId
          ? {
              ...f,
              label: fieldLabel.trim(),
              key: cleanKey,
              type: fieldType,
              placeholder: fieldPlaceholder.trim(),
              helperText: fieldHelperText.trim(),
              required: fieldRequired,
              options: fieldType === "select" ? fieldOptions : undefined,
            }
          : f
      );
      onChange(updated);
      toast.success("Field updated successfully.");
    } else {
      const newField: CustomFieldItem = {
        id: generateFieldId(cleanKey),
        label: fieldLabel.trim(),
        key: cleanKey,
        type: fieldType,
        placeholder: fieldPlaceholder.trim(),
        helperText: fieldHelperText.trim(),
        required: fieldRequired,
        options: fieldType === "select" ? fieldOptions : undefined,
        order: fields.length + 1,
      };
      onChange([...fields, newField]);
      toast.success("New custom field added.");
    }

    setModalOpen(false);
  };

  const handleToggleRequired = (id: string, required: boolean) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, required } : f));
    onChange(updated);
  };

  const handleDeleteField = (id: string) => {
    const updated = fields.filter((f) => f.id !== id);
    onChange(updated);
    toast.success("Field removed.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const copy = [...fields];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChange(reordered);
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    // Check if key already exists
    if (fields.some((f) => f.key.toLowerCase() === preset.key.toLowerCase())) {
      toast.error(`"${preset.label}" is already added.`);
      return;
    }

    const newField: CustomFieldItem = {
      id: generateFieldId(preset.key),
      label: preset.label,
      key: preset.key,
      type: preset.type,
      placeholder: preset.placeholder,
      required: preset.required,
      options: preset.options,
      order: fields.length + 1,
    };
    onChange([...fields, newField]);
    toast.success(`Added ${preset.label} to registration fields.`);
  };

  return (
    <PolarisFormCard
      title="Custom Registration Fields"
      description="Collect custom profile attributes during member onboarding. Toggle required to make completion mandatory."
      badge={`${fields.length} Configured`}
      action={
        <Button
          type="button"
          onClick={handleOpenAddModal}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 px-3 gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Custom Field
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Quick Presets Bar */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
            Quick Add Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => {
              const alreadyAdded = fields.some(
                (f) => f.key.toLowerCase() === preset.key.toLowerCase()
              );
              return (
                <button
                  key={preset.key}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => handleApplyPreset(preset)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all",
                    alreadyAdded
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:hover:border-blue-700 shadow-2xs"
                  )}
                >
                  <Plus className="w-3 h-3 text-zinc-400" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fields List */}
        {fields.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              No Custom Inputs Defined
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Add custom fields like company, LinkedIn, student ID, or designation to collect extra member attributes on signup.
            </p>
            <Button
              type="button"
              onClick={handleOpenAddModal}
              variant="outline"
              size="sm"
              className="mt-4 text-xs h-8 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              Create First Custom Field
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs"
              >
                {/* Left side: Reorder + Icon + Label & Key */}
                <div className="flex items-center gap-3">
                  {/* Reorder Arrows */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 p-0.5 rounded"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 p-0.5 rounded"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Type Icon Badge */}
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                    {TYPE_ICONS[field.type] || <Type className="w-3.5 h-3.5" />}
                  </div>

                  {/* Label & Key */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {field.label}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {FIELD_TYPE_LABELS[field.type]?.label || field.type}
                      </Badge>
                      {field.options && field.options.length > 0 && (
                        <span className="text-[10px] text-zinc-400">
                          ({field.options.length} options)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                      <span>key: {field.key}</span>
                      {field.placeholder && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] text-zinc-500 font-sans">
                            &quot;{field.placeholder}&quot;
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Required switch + Edit / Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  {/* Required Switch with Label */}
                  <div className="flex items-center gap-2 pr-2 border-r border-zinc-200 dark:border-zinc-800">
                    <span
                      className={cn(
                        "text-[11px] font-semibold transition-colors",
                        field.required
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-400"
                      )}
                    >
                      {field.required ? "Required *" : "Optional"}
                    </span>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => handleToggleRequired(field.id, checked)}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(field)}
                      className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      title="Edit Field"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteField(field.id)}
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Field Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {editingFieldId ? "Edit Custom Field" : "Create New Custom Field"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Field Label */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Field Label *</Label>
              <Input
                placeholder="e.g. Current Company, Student ID, GitHub"
                value={fieldLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            {/* Field Key (slug) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Field Key (JSON identifier)</Label>
                <span className="text-[10px] text-zinc-400">Must be unique</span>
              </div>
              <Input
                placeholder="e.g. company_name"
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
                className="text-xs font-mono h-9"
              />
            </div>

            {/* Field Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Input Type</Label>
              <Select
                value={fieldType}
                onValueChange={(val: CustomFieldType) => setFieldType(val)}
              >
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  {Object.entries(FIELD_TYPE_LABELS).map(([key, item]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      <div className="flex items-center gap-2">
                        {TYPE_ICONS[key as CustomFieldType]}
                        <span>{item.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* If Type === 'select', allow adding options */}
            {fieldType === "select" && (
              <div className="space-y-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <Label className="text-xs font-semibold">Dropdown Options</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter an option..."
                    value={newOptionInput}
                    onChange={(e) => setNewOptionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                    className="text-xs h-8 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddOption}
                    size="sm"
                    className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {fieldOptions.map((opt, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs font-normal pl-2 pr-1 py-0.5 bg-white dark:bg-zinc-800 border flex items-center gap-1"
                    >
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(i)}
                        className="text-zinc-400 hover:text-red-500 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {fieldOptions.length === 0 && (
                    <span className="text-[11px] text-zinc-400 italic">
                      No options added yet. Type an option and press Enter.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder */}
            {fieldType !== "checkbox" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Placeholder Text</Label>
                <Input
                  placeholder="e.g. Enter your company name"
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            )}

            {/* Required Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Mandatory Field (Required)
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                  Members cannot complete registration without providing this value.
                </span>
              </div>
              <Switch
                checked={fieldRequired}
                onCheckedChange={setFieldRequired}
                className="data-[state=checked]:bg-red-600"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveModal}
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {editingFieldId ? "Save Changes" : "Add Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PolarisFormCard>
  );
}
