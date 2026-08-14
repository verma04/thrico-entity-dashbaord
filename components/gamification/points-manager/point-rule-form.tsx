import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Zap,
  ChevronRight,
  Info,
  Trophy,
  Target,
  Clock,
  Layers,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

const pointRuleSchema = Yup.object().shape({
  module: Yup.string().required("Please select a module or integration"),
  action: Yup.string().required("Action name is required"),
  trigger: Yup.string().required("Trigger type is required"),
  points: Yup.number()
    .required("Point value is required")
    .min(1, "Must be at least 1 point"),
  dailyCap: Yup.number().nullable(),
  weeklyCap: Yup.number().nullable(),
  monthlyCap: Yup.number().nullable(),
  description: Yup.string().max(200, "Description too long"),
});

interface PointRuleFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  modules?: any[];
  integrations?: any[];
  triggers?: any[];
  moduleTriggers?: any[];
  integrationTriggers?: any[];
}

export function PointRuleForm({
  initialValues,
  onSubmit,
  loading,
  isEdit,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
}: PointRuleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const initialSourceType = React.useMemo(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module,
      );
      if (isIntegration) return "INTEGRATION";
    }
    return "MODULE";
  }, [initialValues, integrations]);

  const [sourceType, setSourceType] = useState<"MODULE" | "INTEGRATION">(
    initialSourceType,
  );

  useEffect(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module,
      );
      setSourceType(isIntegration ? "INTEGRATION" : "MODULE");
    }
  }, [initialValues, integrations]);

  const formik = useFormik({
    initialValues: initialValues || {
      source: initialSourceType,
      module: "",
      action: "",
      trigger: "FIRST_TIME",
      points: 10,
      dailyCap: 10,
      weeklyCap: 70,
      monthlyCap: 210,
      description: "",
    },
    validationSchema: pointRuleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSubmit({
          ...values,
          source: sourceType,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/points-and-badges/points");
        }, 1500);
      } catch (error: any) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to preserve configuration.",
          variant: "destructive",
        });
      }
    },
  });

  const allSources = React.useMemo(() => {
    const mods = modules.map((m) => ({
      id: m.id,
      uuid: m.uuid,
      name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name,
      type: "Module",
      icon: m.icon,
    }));
    const ints = integrations.map((i) => ({
      id: i.id,
      uuid: i.uuid,
      slug: (i as any).slug,
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : i.name,
      type: "Integration",
      icon: i.icon,
    }));
    return { modules: mods, integrations: ints, all: [...mods, ...ints] };
  }, [modules, integrations]);

  const currentSourceList =
    sourceType === "MODULE" ? allSources.modules : allSources.integrations;

  const filteredTriggers = React.useMemo(() => {
    const selected = formik.values.module;
    if (!selected) return [];

    const selectedSource = allSources.all.find(
      (s) =>
        s.id?.toLowerCase() === selected.toLowerCase() ||
        (s.uuid && s.uuid.toLowerCase() === selected.toLowerCase()) ||
        ((s as any).slug && (s as any).slug.toLowerCase() === selected.toLowerCase()),
    );

    const matchValues = new Set<string>();
    matchValues.add(selected.toLowerCase());
    if (selectedSource?.id) matchValues.add(selectedSource.id.toLowerCase());
    if (selectedSource?.uuid) matchValues.add(selectedSource.uuid.toLowerCase());
    if ((selectedSource as any)?.slug) matchValues.add((selectedSource as any).slug.toLowerCase());
    if (selectedSource?.name) matchValues.add(selectedSource.name.toLowerCase());

    const isMatch = (target?: string | null) => {
      if (!target) return false;
      return matchValues.has(target.toLowerCase());
    };

    const fromIntegrationTriggers = integrationTriggers.filter(
      (t) =>
        isMatch(t.integrationId) ||
        isMatch(t.moduleId) ||
        isMatch((t as any).slug) ||
        isMatch((t as any).integrationSlug),
    );

    const fromModuleTriggers = moduleTriggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug),
    );

    const fromGenericTriggers = triggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug),
    );

    const combined = [
      ...fromIntegrationTriggers,
      ...fromModuleTriggers,
      ...fromGenericTriggers,
    ];

    if (combined.length === 0 && sourceType === "INTEGRATION") {
      integrationTriggers.forEach((t) => {
        if (
          isMatch(t.integrationId) ||
          isMatch(t.moduleId) ||
          isMatch(t.name) ||
          isMatch((t as any).type)
        ) {
          combined.push(t);
        }
      });
    }

    const unique = new Map();
    combined.forEach((item) => {
      const key = item.id || item.name || item.description;
      if (key && !unique.has(key)) {
        unique.set(key, item);
      }
    });
    return Array.from(unique.values());
  }, [
    formik.values.module,
    sourceType,
    moduleTriggers,
    integrationTriggers,
    triggers,
    allSources,
  ]);

  const selectedSourceItem = allSources.all.find(
    (s) =>
      s.id?.toLowerCase() === formik.values.module?.toLowerCase() ||
      (s.uuid && s.uuid.toLowerCase() === formik.values.module?.toLowerCase()) ||
      ((s as any).slug && (s as any).slug.toLowerCase() === formik.values.module?.toLowerCase()),
  );
  const selectedTriggerItem = filteredTriggers.find(
    (t) => t.id === formik.values.action || t.name === formik.values.action,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 bg-light-50">
      {/* Main Form */}
      <div className="lg:col-span-8 space-y-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <EcosystemCard
            title="Action Definition"
            description="Choose whether this rule originates from a Module or an Integration, then specify the trigger event."
            icon={Target}
            className="bg-white dark:bg-neutral-900"
          >
            {/* Step 1: Source Type (Module vs Integration) - only show toggle when integrations exist */}
            {integrations.length > 0 && (
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-semibold text-foreground">
                Origin Type
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isEdit}
                  onClick={() => {
                    setSourceType("MODULE");
                    formik.setFieldValue("source", "MODULE");
                    formik.setFieldValue("module", "");
                    formik.setFieldValue("action", "");
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    sourceType === "MODULE"
                      ? "border-zinc-900 bg-zinc-50/80 dark:border-zinc-100 dark:bg-zinc-800/60 ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                      : "border-border bg-card hover:bg-muted/40",
                    isEdit && "opacity-70 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border",
                      sourceType === "MODULE"
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        Platform Module
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {modules.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Core community modules (Feed, Forums, Events, etc.)
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isEdit}
                  onClick={() => {
                    setSourceType("INTEGRATION");
                    formik.setFieldValue("source", "INTEGRATION");
                    formik.setFieldValue("module", "");
                    formik.setFieldValue("action", "");
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    sourceType === "INTEGRATION"
                      ? "border-zinc-900 bg-zinc-50/80 dark:border-zinc-100 dark:bg-zinc-800/60 ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                      : "border-border bg-card hover:bg-muted/40",
                    isEdit && "opacity-70 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border",
                      sourceType === "INTEGRATION"
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    <Boxes className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        Integration
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {integrations.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Third-party connected apps (Shopify, etc.)
                    </p>
                  </div>
                </button>
              </div>
            </div>
            )}

            {/* Step 2: Specific Module/Integration & Trigger Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-5 border-t border-dashed">
              <div className="space-y-2">
                <Label htmlFor="module">
                  {sourceType === "MODULE"
                    ? "Target Module"
                    : "Target Integration"}
                </Label>
                <Select
                  onValueChange={(val) => {
                    formik.setFieldValue("module", val);
                    formik.setFieldValue("action", "");
                  }}
                  value={
                    currentSourceList.find(
                      (item) =>
                        item.id?.toLowerCase() ===
                          formik.values.module?.toLowerCase() ||
                        item.uuid?.toLowerCase() ===
                          formik.values.module?.toLowerCase() ||
                        (item as any).slug?.toLowerCase() ===
                          formik.values.module?.toLowerCase(),
                    )?.id || formik.values.module
                  }
                  disabled={isEdit}
                >
                  <SelectTrigger id="module" className="h-11 shadow-none">
                    <SelectValue
                      placeholder={
                        sourceType === "MODULE"
                          ? "Select a module"
                          : "Select an integration"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {currentSourceList.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.module && formik.errors.module && (
                  <p className="text-xs text-destructive">
                    {formik.errors.module as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Triggering Action</Label>
                <Select
                  onValueChange={(val) => {
                    formik.setFieldValue("action", val);
                    const trig = filteredTriggers.find(
                      (t) =>
                        (t.name || t.id) === val ||
                        t.id === val ||
                        t.name === val,
                    );
                    if (trig && !formik.values.description) {
                      formik.setFieldValue(
                        "description",
                        trig.description || trig.name || "",
                      );
                    }
                  }}
                  value={
                    filteredTriggers.find(
                      (t) =>
                        t.id === formik.values.action ||
                        t.name === formik.values.action ||
                        (t.name || t.id) === formik.values.action,
                    )?.name ||
                    filteredTriggers.find(
                      (t) =>
                        t.id === formik.values.action ||
                        t.name === formik.values.action ||
                        (t.name || t.id) === formik.values.action,
                    )?.id ||
                    formik.values.action
                  }
                  disabled={!formik.values.module || isEdit}
                >
                  <SelectTrigger id="action" className="h-11 shadow-none">
                    <SelectValue
                      placeholder={
                        formik.values.module
                          ? "Select trigger event"
                          : `Select ${sourceType === "MODULE" ? "module" : "integration"} first`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTriggers.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground text-center">
                        No trigger events found for this{" "}
                        {sourceType === "MODULE" ? "module" : "integration"}
                      </div>
                    ) : (
                      filteredTriggers.map((t) => {
                        const itemVal = t.name || t.id;
                        return (
                          <SelectItem key={t.id} value={itemVal}>
                            <div className="flex flex-col py-0.5 text-left">
                              <span className="font-medium text-xs text-foreground">
                                {t.name
                                  ? t.name.replace(/_/g, " ")
                                  : t.description}
                              </span>
                              {t.description &&
                                t.name &&
                                t.description !== t.name && (
                                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                                    {t.description}
                                  </span>
                                )}
                            </div>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.action && formik.errors.action && (
                  <p className="text-xs text-destructive">
                    {formik.errors.action as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select
                  onValueChange={(val) => formik.setFieldValue("trigger", val)}
                  value={formik.values.trigger}
                  disabled={isEdit}
                >
                  <SelectTrigger id="trigger" className="h-11 shadow-none">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_TIME">
                      One-time (First Action)
                    </SelectItem>
                    <SelectItem value="RECURRING">
                      Recurring (Every Action)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.trigger && formik.errors.trigger && (
                  <p className="text-xs text-destructive">
                    {formik.errors.trigger as string}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                {/* Alignment placeholder */}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Rule Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain when this rule applies..."
                  {...formik.getFieldProps("description")}
                  className="min-h-[100px] shadow-none resize-none"
                />
              </div>
            </div>
          </EcosystemCard>

          <EcosystemCard
            title="Economic Values"
            description="Configure the point payout and velocity limits."
            icon={Trophy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points per Action</Label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                  <Input
                    id="points"
                    type="number"
                    {...formik.getFieldProps("points")}
                    className="h-11 pl-10 shadow-none border-indigo-100 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="pt-4 border-t border-dashed">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Frequency Limitations (Anti-Abuse)
                  </h4>

                  <div className="flex items-start gap-3 mb-6 bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-xl">
                    <Info className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-indigo-900/70 leading-relaxed font-semibold">
                        Frequency-Based Buckets
                      </p>
                      <p className="text-[11px] text-indigo-900/60 leading-relaxed">
                        These limits represent the{" "}
                        <strong>maximum number of times</strong> an action can
                        be performed within each period per user.
                      </p>
                      <p className="text-[10px] text-indigo-900/40 italic leading-relaxed">
                        Example: If the daily limit for this action is set to 5,
                        the user can earn points for the first 5 times they
                        perform it each day.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="dailyCap"
                        className="text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        Daily Cap
                      </Label>
                      <Input
                        id="dailyCap"
                        type="number"
                        {...formik.getFieldProps("dailyCap")}
                        className="h-10 bg-muted/30 border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="weeklyCap"
                        className="text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        Weekly Cap
                      </Label>
                      <Input
                        id="weeklyCap"
                        type="number"
                        {...formik.getFieldProps("weeklyCap")}
                        className="h-10 bg-muted/30 border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="monthlyCap"
                        className="text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        Monthly Cap
                      </Label>
                      <Input
                        id="monthlyCap"
                        type="number"
                        {...formik.getFieldProps("monthlyCap")}
                        className="h-10 bg-muted/30 border-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EcosystemCard>
        </form>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <UIBadge
                variant="outline"
                className="w-fit mb-2 bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
              >
                Live Preview
              </UIBadge>
              <CardTitle className="text-lg">Rule Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between opacity-80 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {selectedSourceItem?.name || formik.values.module || "Source"}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                      {selectedSourceItem?.type || (sourceType === "MODULE" ? "Module" : "Integration")}
                    </span>
                  </div>
                  <div className="text-xl font-black mb-4 capitalize">
                    {(
                      selectedTriggerItem?.name ||
                      selectedTriggerItem?.description ||
                      formik.values.action ||
                      "New Action"
                    ).replace(/_/g, " ")}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black">
                      {formik.values.points}
                    </span>
                    <span className="text-sm font-bold mb-1 opacity-80">
                      PTS
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs border-b pb-2">
                  <span className="text-muted-foreground">Trigger</span>
                  <span className="font-bold">{formik.values.trigger}</span>
                </div>
                <div className="flex justify-between text-xs border-b pb-2">
                  <span className="text-muted-foreground">Daily Frequency</span>
                  <span className="font-bold">
                    {formik.values.dailyCap
                      ? `${formik.values.dailyCap} times`
                      : "∞"}
                  </span>
                </div>
                <div className="flex justify-between text-xs border-b pb-2">
                  <span className="text-muted-foreground">
                    Weekly Frequency
                  </span>
                  <span className="font-bold">
                    {formik.values.weeklyCap
                      ? `${formik.values.weeklyCap} times`
                      : "∞"}
                  </span>
                </div>
                <div className="flex justify-between text-xs border-b pb-2">
                  <span className="text-muted-foreground">
                    Monthly Frequency
                  </span>
                  <span className="font-bold">
                    {formik.values.monthlyCap
                      ? `${formik.values.monthlyCap} times`
                      : "∞"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-border/50 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
                <Info className="h-4 w-4 text-amber-600" />
                Strategic Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Point rules are calibrated across the entire ecosystem. Changes
                to payout values affect the economy immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty && !!formik.values.action}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title={isEdit ? "Unsaved Changes" : "Unsaved Definition"}
        description={
          isEdit
            ? "Preserve your updated rule parameters."
            : "Establish this point rule in the production matrix?"
        }
        buttonText={isEdit ? "Update Rule" : "Commission Rule"}
      />
    </div>
  );
}
