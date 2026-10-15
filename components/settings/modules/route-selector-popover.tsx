"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link2, Check, RotateCcw, Compass } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RoutePreset {
  label: string;
  path: string;
  description: string;
}

const COMMON_PRESETS: RoutePreset[] = [
  { label: "Overview", path: "/dashboard", description: "Main community home overview" },
  { label: "Community Feed", path: "/dashboard/feed", description: "Activity stream & updates" },
  { label: "Moments & Stories", path: "/dashboard/moments", description: "Bite-sized visual clips" },
  { label: "Member Network", path: "/dashboard/network", description: "Member directory & connections" },
  { label: "Events Hub", path: "/dashboard/events", description: "Upcoming workshops & meetups" },
  { label: "Spaces / Groups", path: "/dashboard/communities", description: "Discussion rooms & clubs" },
  { label: "Jobs Board", path: "/dashboard/jobs", description: "Career opportunities & listings" },
  { label: "Rewards Store", path: "/dashboard/rewards", description: "Perks, points & redemptions" },
  { label: "AR Camera", path: "/dashboard/camera", description: "Camera & snap experiences" },
];

interface RouteFormValues {
  route: string;
}

const routeValidationSchema = Yup.object().shape({
  route: Yup.string()
    .trim()
    .test(
      "valid-route-or-url",
      "Route must start with / or be a valid URL (http:// or https://)",
      (value) => {
        if (!value || value.trim() === "") return true;
        const v = value.trim();
        return (
          v.startsWith("/") ||
          v.startsWith("http://") ||
          v.startsWith("https://") ||
          v.startsWith("#") ||
          v.startsWith("mailto:")
        );
      },
    )
    .max(500, "Route path cannot exceed 500 characters")
    .nullable(),
});

interface RouteSelectorPopoverProps {
  moduleName: string;
  currentRoute?: string | null;
  defaultRoute: string;
  onChangeRoute: (route: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RouteSelectorPopover: React.FC<RouteSelectorPopoverProps> = ({
  moduleName,
  currentRoute,
  defaultRoute,
  onChangeRoute,
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const effectiveRoute = currentRoute || defaultRoute;
  const isCustom = Boolean(
    currentRoute && currentRoute.trim() !== "" && currentRoute !== defaultRoute,
  );

  const commitRoute = (routeVal: string) => {
    const trimmed = (routeVal || "").trim();
    if (!trimmed || trimmed === defaultRoute) {
      onChangeRoute("");
    } else {
      const formatted =
        trimmed.startsWith("/") ||
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("#") ||
        trimmed.startsWith("mailto:")
          ? trimmed
          : `/${trimmed}`;
      onChangeRoute(formatted);
    }
  };

  const formik = useFormik<RouteFormValues>({
    initialValues: {
      route: currentRoute || "",
    },
    validationSchema: routeValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      commitRoute(values.route);
      setOpen(false);
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      formik.resetForm({ values: { route: currentRoute || "" } });
    } else {
      // Auto-commit on close if dirty and valid so clicking "Save Changes" on the page immediately saves the latest route
      if (formik.dirty && !formik.errors.route) {
        commitRoute(formik.values.route);
      }
    }
    setOpen(isOpen);
  };

  const handlePresetSelect = (path: string) => {
    void formik.setFieldValue("route", path);
    commitRoute(path);
    setOpen(false);
  };

  const handleReset = () => {
    formik.resetForm({ values: { route: "" } });
    onChangeRoute("");
    setOpen(false);
  };

  const hasRouteError = Boolean(formik.touched.route && formik.errors.route);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title={`Configure target route for ${moduleName}`}
          className={cn(
            "group/route inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer",
            isCustom
              ? "bg-indigo-50/80 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/80 hover:bg-indigo-100/80"
              : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80",
            disabled && "opacity-50 pointer-events-none",
            className,
          )}
        >
          <Link2
            className={cn(
              "h-3 w-3 shrink-0",
              isCustom ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground",
            )}
          />
          <span className="truncate max-w-[130px] sm:max-w-[170px]">
            {isCustom ? currentRoute : effectiveRoute}
          </span>
          {isCustom && (
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-84 p-3.5 space-y-3 bg-popover text-popover-foreground border-border shadow-xl rounded-xl z-[150]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-border/60">
          <div>
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <h5 className="text-xs font-bold text-foreground">Target Route / URL</h5>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
              Direct users to any route or custom URL when clicking <strong>{moduleName}</strong>.
            </p>
          </div>
          {isCustom && (
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Custom
            </span>
          )}
        </div>

        {/* Formik Form Container */}
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {/* Input Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-foreground flex items-center justify-between">
              <span>Direct Path or Custom URL</span>
              <span className="text-[10px] font-normal text-muted-foreground font-mono">
                Default: {defaultRoute}
              </span>
            </label>
            <div className="flex items-center gap-1.5">
              <Input
                name="route"
                value={formik.values.route}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. /dashboard/moments or https://..."
                inputSize="slim"
                className={cn(
                  "font-mono text-[11px] h-8 flex-1",
                  hasRouteError && "border-destructive focus-visible:ring-destructive",
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
                className="h-8 px-2.5 text-xs bg-primary text-primary-foreground font-medium shrink-0 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
            {hasRouteError && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.route}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground leading-tight">
              Supports internal paths (<code>/dashboard/...</code>) or full external URLs (<code>https://...</code>).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Quick Destination Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto no-scrollbar pr-0.5">
              {COMMON_PRESETS.map((preset) => {
                const isActive = (formik.values.route || effectiveRoute) === preset.path;
                return (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => handlePresetSelect(preset.path)}
                    className={cn(
                      "text-left p-1.5 rounded-lg border text-[11px] transition-all flex flex-col justify-between cursor-pointer",
                      isActive
                        ? "bg-primary/10 border-primary text-primary font-semibold shadow-2xs"
                        : "bg-muted/30 border-border/70 hover:bg-muted/70 hover:border-border text-foreground",
                    )}
                  >
                    <span className="truncate block font-medium">{preset.label}</span>
                    <span className="font-mono text-[9px] text-muted-foreground truncate block">
                      {preset.path}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer with Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!isCustom && formik.values.route === ""}
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Default</span>
            </Button>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-7 px-2 text-[11px] cursor-pointer"
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={formik.isSubmitting}
                className="h-7 px-2.5 text-[11px] bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 font-medium cursor-pointer shadow-2xs"
              >
                Apply Route
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
