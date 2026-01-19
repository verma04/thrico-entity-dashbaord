import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PointRule, GamificationTrigger } from "@/graphql/actions";
import { renderModuleIcon } from "@/components/subscription/utils";

interface PointRuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRule: PointRule | null;
  modules: { id: string; name: string; icon: string }[];
  triggers: GamificationTrigger[];
  pointRules: PointRule[];
  onSave: (rule: Partial<PointRule>) => void;
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  module: Yup.string().required("Module is required"),
  action: Yup.string().required("Action name is required"),
  triggerType: Yup.string().required("Trigger type is required"),
  points: Yup.number()
    .min(1, "Points must be at least 1")
    .required("Points are required"),
  description: Yup.string(),
  isActive: Yup.boolean(),
  dailyCap: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Cannot be negative"),
  weeklyCap: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Cannot be negative"),
  monthlyCap: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Cannot be negative"),
});

export function PointRuleDialog({
  isOpen,
  onOpenChange,
  editingRule,
  modules,
  triggers,
  pointRules,
  onSave,
  isLoading = false,
}: PointRuleDialogProps) {
  const formik = useFormik({
    initialValues: {
      module: editingRule?.module || modules[0]?.id || "",
      action: editingRule?.action || "",
      triggerType: editingRule?.trigger || "RECURRING",
      points: editingRule?.points || 5,
      description: editingRule?.description || "",
      isActive: editingRule?.isActive ?? true,
      dailyCap: editingRule?.dailyCap || "",
      weeklyCap: editingRule?.weeklyCap || "",
      monthlyCap: editingRule?.monthlyCap || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { setStatus }) => {
      console.log(pointRules);
      // Check for duplicate module + action + trigger combination
      const isDuplicate = pointRules.some(
        (rule) =>
          rule.id !== editingRule?.id &&
          rule.module === values.module &&
          rule.action?.toLowerCase() === values.action?.toLowerCase() &&
          rule.trigger === values.triggerType
      );

      if (isDuplicate) {
        setStatus(
          `A rule for "${values.action}" (${values.triggerType}) already exists in this module.`
        );
        return;
      }

      onSave({
        module: values.module,
        action: values.action,
        trigger: values.triggerType, // Map triggerType to trigger
        points: Number(values.points),
        dailyCap: values.dailyCap ? Number(values.dailyCap) : undefined,
        weeklyCap: values.weeklyCap ? Number(values.weeklyCap) : undefined,
        monthlyCap: values.monthlyCap ? Number(values.monthlyCap) : undefined,
        description: values.description,
        isActive: values.isActive,
      } as Partial<PointRule>);

      setStatus(null);
    },
  });

  // Reset status when dialog opens/closes or rule changes
  useEffect(() => {
    if (isOpen) {
      formik.setStatus(null);
      if (!editingRule) {
        formik.resetForm();
      }
    }
  }, [isOpen, editingRule]);

  // Filter triggers based on selected module
  const availableTriggers = triggers.filter(
    (t) => t.moduleId === formik.values.module
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? "Edit Point Rule" : "Add Point Rule"}
          </DialogTitle>
        </DialogHeader>

        {formik.status && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formik.status}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={formik.values.module}
              onValueChange={(v) => {
                formik.setFieldValue("module", v);
                formik.setFieldValue("action", ""); // Reset action
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.id} value={mod.id}>
                    <span className="flex items-center gap-2">
                      {renderModuleIcon(mod.icon)} {mod.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.module && formik.errors.module && (
              <p className="text-sm text-red-500">{formik.errors.module}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Action Name</Label>
            <Select
              value={formik.values.action}
              onValueChange={(v) => formik.setFieldValue("action", v)}
              disabled={!formik.values.module}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {availableTriggers.map((trigger) => (
                  <SelectItem key={trigger.id} value={trigger.id}>
                    {trigger.name}
                  </SelectItem>
                ))}
                {availableTriggers.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No actions available for this module
                  </div>
                )}
              </SelectContent>
            </Select>
            {formik.touched.action && formik.errors.action && (
              <p className="text-sm text-red-500">{formik.errors.action}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <Select
              value={formik.values.triggerType}
              onValueChange={(v) => formik.setFieldValue("triggerType", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_TIME">
                  First Time (One-time bonus)
                </SelectItem>
                <SelectItem value="RECURRING">
                  Recurring (Every time)
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.triggerType && formik.errors.triggerType && (
              <p className="text-sm text-red-500">
                {formik.errors.triggerType}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Points</Label>
            <Input type="number" min={1} {...formik.getFieldProps("points")} />
            {formik.touched.points && formik.errors.points && (
              <p className="text-sm text-red-500">{formik.errors.points}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Describe this point rule"
              {...formik.getFieldProps("description")}
            />
          </div>

          {formik.values.triggerType === "RECURRING" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Daily Cap</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  {...formik.getFieldProps("dailyCap")}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Weekly Cap</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  {...formik.getFieldProps("weeklyCap")}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Monthly Cap</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  {...formik.getFieldProps("monthlyCap")}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={Boolean(formik.values.isActive)}
              onCheckedChange={(v) => formik.setFieldValue("isActive", v)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingRule
                ? "Save Changes"
                : "Add Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
