"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Zap, ChevronRight, Info, Trophy, Target, Clock } from "lucide-react";
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

const pointRuleSchema = Yup.object().shape({
  module: Yup.string().required("Please select a module"),
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
  modules: any[];
  triggers: any[];
}

export function PointRuleForm({
  initialValues,
  onSubmit,
  loading,
  isEdit,
  modules,
  triggers,
}: PointRuleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const formik = useFormik({
    initialValues: initialValues || {
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
        await onSubmit(values);
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/points");
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

  const filteredTriggers = triggers.filter(
    (t) => t.moduleId === formik.values.module,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-8 space-y-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <EcosystemCard
            title="Action Definition"
            description="Specify which user action triggers this point reward."
            icon={Target}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="module">Target Module</Label>
                <Select
                  onValueChange={(val) => formik.setFieldValue("module", val)}
                  value={formik.values.module}
                  disabled={isEdit}
                >
                  <SelectTrigger id="module" className="h-11 shadow-none">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((mod) => (
                      <SelectItem key={mod.id} value={mod.id}>
                        {mod.name}
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
                  onValueChange={(val) => formik.setFieldValue("action", val)}
                  value={formik.values.action}
                  disabled={!formik.values.module || isEdit}
                >
                  <SelectTrigger id="action" className="h-11 shadow-none">
                    <SelectValue
                      placeholder={
                        formik.values.module
                          ? "Select trigger"
                          : "Select module first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTriggers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.description}
                      </SelectItem>
                    ))}
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
                    {formik.errors.trigger as string}ß
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                {/* Placeholder to maintain grid alignment if needed, or just let it flow */}
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
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Frequency Limitations (Anti-Abuse)
                  </h4>
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
                  <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                    {formik.values.module || "Module"}
                  </div>
                  <div className="text-xl font-black mb-4 capitalize">
                    {(formik.values.action || "New Action").replace(/_/g, " ")}
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
                  <span className="text-muted-foreground">Daily Limit</span>
                  <span className="font-bold">
                    {formik.values.dailyCap || "∞"}
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
