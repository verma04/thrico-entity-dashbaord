"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Type, Check, RotateCcw, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TabNameFormValues {
  name: string;
}

const tabNameValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(30, "Tab name cannot exceed 30 characters"),
});

interface TabNamePopoverProps {
  moduleName: string;
  currentName?: string | null;
  onChangeName: (name: string) => void;
  disabled?: boolean;
  className?: string;
  triggerVariant?: "chip" | "icon";
}

export const TabNamePopover: React.FC<TabNamePopoverProps> = ({
  moduleName,
  currentName,
  onChangeName,
  disabled = false,
  className,
  triggerVariant = "chip",
}) => {
  const [open, setOpen] = useState(false);

  const effectiveName = currentName && currentName.trim() !== "" ? currentName.trim() : moduleName;
  const isCustom = Boolean(
    currentName && currentName.trim() !== "" && currentName.trim() !== moduleName,
  );

  const formik = useFormik<TabNameFormValues>({
    initialValues: {
      name: currentName || "",
    },
    validationSchema: tabNameValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const trimmed = (values.name || "").trim();
      if (!trimmed || trimmed === moduleName) {
        onChangeName("");
      } else {
        onChangeName(trimmed);
      }
      setOpen(false);
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      formik.resetForm({ values: { name: currentName || "" } });
    } else {
      // Auto-apply on close if dirty and valid
      if (formik.dirty && !formik.errors.name) {
        const trimmed = (formik.values.name || "").trim();
        if (!trimmed || trimmed === moduleName) {
          onChangeName("");
        } else {
          onChangeName(trimmed);
        }
      }
    }
    setOpen(isOpen);
  };

  const handleReset = () => {
    formik.resetForm({ values: { name: "" } });
    onChangeName("");
    setOpen(false);
  };

  const hasError = Boolean(formik.touched.name && formik.errors.name);
  const previewText = formik.values.name.trim() || moduleName;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {triggerVariant === "icon" ? (
          <button
            type="button"
            disabled={disabled}
            title={`Customize tab name for ${moduleName}`}
            className={cn(
              "h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer",
              isCustom && "text-primary font-semibold",
              disabled && "opacity-50 pointer-events-none",
              className,
            )}
          >
            <Type className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            title={`Customize tab name for ${moduleName}`}
            className={cn(
              "group/tab-name inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer",
              isCustom
                ? "bg-emerald-50/80 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100/80"
                : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80",
              disabled && "opacity-50 pointer-events-none",
              className,
            )}
          >
            <Type
              className={cn(
                "h-3 w-3 shrink-0",
                isCustom ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
              )}
            />
            <span className="truncate max-w-[120px] sm:max-w-[160px]">
              Tab: {effectiveName}
            </span>
            {isCustom && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            )}
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 p-3.5 space-y-3 bg-popover text-popover-foreground border-border shadow-xl rounded-xl z-[150]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-border/60">
          <div>
            <div className="flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-primary" />
              <h5 className="text-xs font-bold text-foreground">Tab Display Name</h5>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
              Rename this navigation tab (Default: <strong>{moduleName}</strong>).
            </p>
          </div>
          {isCustom && (
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Custom
            </span>
          )}
        </div>

        {/* Form Container */}
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {/* Input Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tab-custom-name"
                className="text-[11px] font-semibold text-foreground"
              >
                Custom Label
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formik.values.name.length}/30
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Input
                id="tab-custom-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`e.g. ${moduleName}`}
                inputSize="slim"
                maxLength={30}
                className={cn(
                  "text-[12px] h-8 flex-1 font-medium",
                  hasError && "border-destructive focus-visible:ring-destructive",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    formik.handleSubmit();
                  }
                }}
              />
              <Button
                type="submit"
                size="sm"
                disabled={formik.isSubmitting}
                className="h-8 px-2.5 text-xs bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 font-medium shrink-0 cursor-pointer shadow-2xs"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>

            {hasError && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Live Tab Preview Card */}
          <div className="p-2.5 rounded-lg border border-border/70 bg-muted/30 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Live Preview
              </span>
              <span className="text-[9px] font-mono text-muted-foreground">Mobile & Web</span>
            </div>
            <div className="flex items-center justify-center p-2 rounded-md bg-card border border-border/80 shadow-2xs">
              <div className="flex flex-col items-center gap-0.5 text-primary">
                <span className="text-[12px] font-bold truncate max-w-[180px]">
                  {previewText}
                </span>
                <span className="text-[9px] text-muted-foreground leading-none">
                  (Module: {moduleName})
                </span>
              </div>
            </div>
          </div>

          {/* Footer with Reset & Apply */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!isCustom && formik.values.name === ""}
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-7 px-2 text-[11px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={formik.isSubmitting}
                className="h-7 px-2.5 text-[11px] bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 font-medium cursor-pointer shadow-2xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
