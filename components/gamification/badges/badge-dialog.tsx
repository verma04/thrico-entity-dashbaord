import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { Badge, GamificationTrigger } from "@/graphql/actions";
import { renderModuleIcon } from "@/components/subscription/utils";

const ICON_CATEGORIES = [
  {
    name: "Success & Achievement",
    icons: [
      "⭐",
      "🏆",
      "🎯",
      "🎖️",
      "🏅",
      "🥇",
      "🥈",
      "🥉",
      "👑",
      "✨",
      "🌟",
      "🎊",
    ],
  },
  {
    name: "Rare & Premium",
    icons: [
      "💎",
      "💠",
      "🔮",
      "💫",
      "💍",
      "⚡",
      "🔥",
      "🌈",
      "🦄",
      "🍭",
      "🔱",
      "⚔️",
    ],
  },
  {
    name: "Growth & Speed",
    icons: [
      "🚀",
      "📈",
      "🆙",
      "⚡",
      "🌱",
      "🔥",
      "🏃",
      "🏋️",
      "💡",
      "📡",
      "🛸",
      "🔋",
    ],
  },
  {
    name: "Skill & Action",
    icons: ["🎨", "📝", "💻", "🎭", "🎸", "🎤", "🕹️", "🧩", "🧪", "🛠️", "🎯", "🏹"],
  },
  {
    name: "Social & Community",
    icons: ["🤝", "🌍", "❤️", "🎈", "💬", "📣", "🦋", "🌸", "🍔", "🍕", "🥂", "🎉"],
  },
];

interface BadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingBadge: Badge | null;
  subscriptionModules: { id: string; name: string; icon: string }[];
  triggers: GamificationTrigger[];
  isLoading: boolean;
  onSave: (badge: Partial<Badge>) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  icon: Yup.string().required("Icon is required"),
  type: Yup.string().oneOf(["ACTION", "POINTS"]).required("Type is required"),
  module: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Module is required"),
    otherwise: (schema) => schema.optional(),
  }),
  condition: Yup.object().when("type", {
    is: "ACTION",
    then: (schema) =>
      schema.shape({
        action: Yup.string().required("Action is required"),
        count: Yup.number()
          .required("Count is required")
          .min(1, "Must be at least 1"),
      }),
    otherwise: (schema) =>
      schema.shape({
        pointsRequired: Yup.number()
          .required("Points are required")
          .min(1, "Must be at least 1"),
      }),
  }),
});

export function BadgeDialog({
  isOpen,
  onOpenChange,
  editingBadge,
  subscriptionModules,
  triggers,
  isLoading,
  onSave,
}: BadgeDialogProps) {
  const formik = useFormik({
    initialValues: {
      name: "",
      icon: "⭐",
      description: "",
      type: "ACTION" as "ACTION" | "POINTS",
      module: "",
      isActive: true,
      condition: {
        action: "",
        count: 1,
        pointsRequired: 100,
      },
      ...editingBadge,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  // Filter triggers based on selected module
  const filteredTriggers = triggers.filter(
    (t) => t.moduleId === formik.values.module,
  );

  useEffect(() => {
    if (isOpen && !editingBadge) {
      if (subscriptionModules.length > 0 && !formik.values.module) {
        formik.setFieldValue("module", subscriptionModules[0].id);
      }
    }
  }, [isOpen, editingBadge, subscriptionModules]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingBadge ? "Edit Badge" : "Create Badge"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col max-h-[85vh]"
        >
          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6 custom-scrollbar">
            <div className="space-y-4">
              <Label>Badge Identity</Label>

              <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 shadow-sm ring-1 ring-inset ring-primary/10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-xl ring-1 ring-border text-4xl transform hover:scale-110 transition-transform duration-300">
                      {formik.values.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      {formik.values.name || "Badge Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
                      {formik.values.description ||
                        "Enter a description below to see it here..."}
                    </p>
                    <div className="pt-1">
                      <BadgeUI
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold"
                      >
                        {formik.values.type === "ACTION"
                          ? "Action Challenge"
                          : "Points Milestone"}
                      </BadgeUI>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select an Icon
                </Label>
                <div className="rounded-xl border bg-muted/30 p-1">
                  <div className="max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {ICON_CATEGORIES.map((category) => (
                      <div key={category.name} className="p-2 first:pt-1">
                        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                          {category.name}
                        </p>
                        <div className="grid grid-cols-8 gap-2">
                          {category.icons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => formik.setFieldValue("icon", icon)}
                              className={cn(
                                "group relative flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all duration-200",
                                formik.values.icon === icon
                                  ? "bg-primary text-primary-foreground shadow-lg scale-110 z-10"
                                  : "bg-background hover:bg-primary/10 hover:shadow-md hover:-translate-y-1",
                              )}
                            >
                              <span
                                className={cn(
                                  "transition-transform duration-200 group-hover:scale-110",
                                  formik.values.icon === icon
                                    ? "animate-in zoom-in-75 duration-300"
                                    : "",
                                )}
                              >
                                {icon}
                              </span>
                              {formik.values.icon === icon && (
                                <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-foreground/50" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {formik.touched.icon && formik.errors.icon && (
                  <p className="text-sm font-medium text-destructive">
                    {formik.errors.icon}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Feed Master"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What does this badge represent?"
                {...formik.getFieldProps("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formik.values.type}
                onValueChange={(v) => formik.setFieldValue("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTION">
                    Action-Based (Complete X actions)
                  </SelectItem>
                  <SelectItem value="POINTS">
                    Points-Based (Reach X points)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formik.values.type === "ACTION" && (
              <>
                <div className="space-y-2">
                  <Label>Module</Label>
                  <Select
                    value={formik.values.module}
                    onValueChange={(v) => {
                      formik.setFieldValue("module", v);
                      formik.setFieldValue("condition.action", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionModules.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          <span className="flex items-center gap-2">
                            {renderModuleIcon(mod.icon)} {mod.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.module && formik.errors.module && (
                    <p className="text-sm text-red-500">
                      {formik.errors.module}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition.action">Action</Label>
                    <Select
                      value={formik.values.condition?.action}
                      onValueChange={(v) =>
                        formik.setFieldValue("condition.action", v)
                      }
                      disabled={!formik.values.module}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTriggers.map((trigger) => (
                          <SelectItem key={trigger.id} value={trigger.id}>
                            {trigger.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    { (formik.touched.condition as any)?.action &&
                      (formik.errors.condition as any)?.action && (
                        <p className="text-sm text-red-500">
                          {(formik.errors.condition as any)?.action}
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition.count">Required Count</Label>
                    <Input
                      type="number"
                      min={1}
                      id="condition.count"
                      {...formik.getFieldProps("condition.count")}
                    />
                    {(formik.touched.condition as any)?.count &&
                      (formik.errors.condition as any)?.count && (
                        <p className="text-sm text-red-500">
                          {(formik.errors.condition as any)?.count}
                        </p>
                      )}
                  </div>
                </div>
              </>
            )}

            {formik.values.type === "POINTS" && (
              <div className="space-y-2">
                <Label htmlFor="condition.pointsRequired">Points Required</Label>
                <Input
                  type="number"
                  min={1}
                  id="condition.pointsRequired"
                  placeholder="e.g., 1000"
                  {...formik.getFieldProps("condition.pointsRequired")}
                />
                {(formik.touched.condition as any)?.pointsRequired &&
                  (formik.errors.condition as any)?.pointsRequired && (
                    <p className="text-sm text-red-500">
                      {(formik.errors.condition as any)?.pointsRequired}
                    </p>
                  )}
              </div>
            )}

            <div className="flex items-center justify-between pb-2">
              <Label>Active</Label>
              <Switch
                checked={formik.values.isActive}
                onCheckedChange={(v) => formik.setFieldValue("isActive", v)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t px-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingBadge
                  ? "Save Changes"
                  : "Create Badge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
