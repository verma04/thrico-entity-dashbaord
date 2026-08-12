"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet as Dialog,
  SheetContent as DialogContent,
  SheetHeader as DialogHeader,
  SheetTitle as DialogTitle,
  SheetFooter as DialogFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Rank } from "@/graphql/actions";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { GamificationIconPreview } from "@/components/gamification/shared/gamification-icon-preview";

const RANK_ICONS = [
  // Achievements & Medals
  "🏆",
  "🥇",
  "🥈",
  "🥉",
  "🎖️",
  "🏅",
  "⭐",
  "🌟",
  "✨",
  "�",
  "�",
  "💎",
  "�",
  "🔮",
  "🎯",
  "🎪",
  "🎭",
  "🎨",
  // Power & Energy
  "�",
  "⚡",
  "�",
  "💪",
  "🚀",
  "🛡️",
  "⚔️",
  "🗡️",
  // Animals - Powerful
  "🦁",
  "🐯",
  "🦅",
  "🐲",
  "🐉",
  "🦈",
  "🐺",
  "🦊",
  "🦄",
  "🐻",
  // Animals - Cute/Beginner
  "🐣",
  "🐥",
  "🐤",
  "🐰",
  "🐱",
  "🐶",
  "🐨",
  "🐼",
  "🐸",
  "🦋",
  // Nature & Elements
  "�",
  "🌊",
  "🌸",
  "🌺",
  "🌻",
  "🍀",
  "🌙",
  "☀️",
  "⛈️",
  "❄️",
  // Objects & Tools
  "�",
  "🔍",
  "�",
  "📖",
  "🎓",
  "🔑",
  "🔒",
  "�",
  "🧭",
  "⏳",
  // Food & Fun
  "🍕",
  "🍔",
  "🎂",
  "🍩",
  "🍭",
  "🎁",
  "🎈",
  "🎉",
  "🎊",
  // People & Gestures
  "👶",
  "👤",
  "🧙",
  "�‍🚀",
  "🦸",
  "�",
  "👻",
  "💀",
  "👽",
  // Hearts & Love
  "❤️",
  "💖",
  "💗",
  "💙",
  "💚",
  "💜",
  "�",
  "🤍",
  // Sports & Games
  "⚽",
  "🏀",
  "🎮",
  "🎲",
  "♟️",
  "🎳",
  "�",
  "⚾",
  // Miscellaneous
  "🌍",
  "🗺️",
  "🏰",
  "�️",
  "🌋",
  "🎵",
  "🎸",
  "🎹",
];

interface RankDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRank: Rank | null;
  onSave: (formData: any) => void;
  isLoading?: boolean;
  nextOrder: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  color: Yup.string().required("Color is required"),
  minPoints: Yup.number()
    .min(0, "Cannot be negative")
    .required("Min points required"),
  maxPoints: Yup.number()
    .min(Yup.ref("minPoints"), "Max points must be greater than min points")
    .required("Max points required"),
  isActive: Yup.boolean(),
});

export function RankDialog({
  isOpen,
  onOpenChange,
  editingRank,
  onSave,
  isLoading = false,
  nextOrder,
}: RankDialogProps) {
  const formik = useFormik({
    initialValues: {
      name: editingRank?.name || "",
      icon: editingRank?.icon || "⭐",
      color: editingRank?.color || "#3b82f6",
      minPoints: editingRank?.minPoints || 0,
      maxPoints: editingRank?.maxPoints || 1000,

      order: editingRank?.order || nextOrder,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (isOpen && !editingRank) {
      formik.resetForm();
    }
  }, [isOpen, editingRank]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col h-full p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle>{editingRank ? "Edit Rank" : "Create Rank"}</DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-4">
              <Label>Rank Identity</Label>

              <GamificationIconPreview
                icon={formik.values.icon}
                name={formik.values.name}
                badgeLabel={`${formik.values.minPoints} – ${formik.values.maxPoints} pts`}
                color={formik.values.color}
              />

              <div className="space-y-2">
                <Label>Custom Icon Upload</Label>
                <div className="p-3 border rounded-lg space-y-2">
                  <ImageUploadWithCrop
                    currentImage={formik.values.icon.startsWith('http') || formik.values.icon.startsWith('data:') ? formik.values.icon : ""}
                    onImageUpdate={(url) => formik.setFieldValue("icon", url)}
                    aspectRatio={1}
                    recommendedWidth={128}
                    recommendedHeight={128}
                    uploadButtonText="Upload Custom Icon"
                  />
                  <p className="text-[10px] text-muted-foreground leading-snug mt-1">
                    Recommended dimensions: 128x128px.<br />
                    Supported formats: PNG, JPG, SVG, WebP.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Or choose a preset emoji
                </Label>
                <div className="rounded-xl border bg-muted/30 p-1">
                  <div className="max-h-[160px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-8 gap-2 p-2">
                      {RANK_ICONS.map((icon) => (
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
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Bronze"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 p-1 h-10"
                    {...formik.getFieldProps("color")}
                  />
                  <Input
                    placeholder="#000000"
                    {...formik.getFieldProps("color")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Points</Label>
                <Input type="number" {...formik.getFieldProps("minPoints")} />
                {formik.touched.minPoints && formik.errors.minPoints && (
                  <p className="text-xs text-destructive">
                    {formik.errors.minPoints}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Max Points</Label>
                <Input type="number" {...formik.getFieldProps("maxPoints")} />
                {formik.touched.maxPoints && formik.errors.maxPoints && (
                  <p className="text-xs text-destructive">
                    {formik.errors.maxPoints}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-background mt-auto">
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
                  : editingRank
                    ? "Save Changes"
                    : "Create Rank"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
