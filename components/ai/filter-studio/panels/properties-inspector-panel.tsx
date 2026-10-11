"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sliders,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  MoveUp,
  MoveDown,
  ShieldCheck,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import {
  FaceAnchorType,
  BlendMode,
  AnimationPreset,
} from "../types/ar-manifest";
import { cn } from "@/lib/utils";

interface LayerFormValues {
  name: string;
  anchor: FaceAnchorType;
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  uniformScale: boolean;
  rotation: number;
  opacity: number;
  blendMode: BlendMode;
  tintColor: string;
  glowIntensity: number;
  animationPreset: AnimationPreset;
  animationSpeed: number;
  animationAmplitude: number;
}

const layerValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Layer name is required"),
  anchor: Yup.string().required("Face anchor is required"),
  x: Yup.number().required(),
  y: Yup.number().required(),
  z: Yup.number().required(),
  scaleX: Yup.number().min(0.1).max(3.0).required(),
  scaleY: Yup.number().min(0.1).max(3.0).required(),
  rotation: Yup.number().min(-180).max(180).required(),
  opacity: Yup.number().min(0).max(100).required(),
  blendMode: Yup.string().required(),
  glowIntensity: Yup.number().min(0).max(100),
  animationPreset: Yup.string().required(),
});

const ANCHOR_OPTIONS: { value: FaceAnchorType; label: string }[] = [
  { value: "forehead", label: "Forehead / Brow" },
  { value: "left_eye", label: "Left Eye Pupil" },
  { value: "right_eye", label: "Right Eye Pupil" },
  { value: "nose_bridge", label: "Nose Bridge" },
  { value: "cheeks", label: "Cheeks Center" },
  { value: "mouth", label: "Mouth / Lips" },
  { value: "chin", label: "Chin Jawline" },
  { value: "face_oval", label: "Full Face Oval" },
  { value: "free_float", label: "Free Float Aura" },
];

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal (Standard)" },
  { value: "screen", label: "Screen (Additive Glow)" },
  { value: "multiply", label: "Multiply (Shadow Tint)" },
  { value: "overlay", label: "Overlay (High Contrast)" },
  { value: "additive", label: "Additive (Light Source)" },
];

const ANIMATION_PRESETS: { value: AnimationPreset; label: string }[] = [
  { value: "none", label: "Static (No Motion)" },
  { value: "floating", label: "Floating (Harmonic Bob)" },
  { value: "pulse", label: "Pulse (Scale Breathing)" },
  { value: "shimmer", label: "Shimmer (Alpha Gleam)" },
  { value: "particle_drift", label: "Stardust Drift" },
  { value: "orbit", label: "Orbit Rotation" },
];

export function PropertiesInspectorPanel() {
  const {
    manifest,
    activeLayerId,
    setActiveLayerId,
    updateLayer,
    removeLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
  } = useFilterStudioStore();

  const activeLayer =
    manifest.layers.find((l) => l.id === activeLayerId) || manifest.layers[0];

  const formik = useFormik<LayerFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: activeLayer?.name || "Layer",
      anchor: activeLayer?.anchor || "forehead",
      x: activeLayer?.transform.x ?? 0,
      y: activeLayer?.transform.y ?? 0,
      z: activeLayer?.transform.z ?? 0,
      scaleX: activeLayer?.transform.scaleX ?? 1,
      scaleY: activeLayer?.transform.scaleY ?? 1,
      uniformScale: activeLayer?.transform.uniformScale ?? true,
      rotation: activeLayer?.transform.rotation ?? 0,
      opacity: Math.round((activeLayer?.transform.opacity ?? 1) * 100),
      blendMode: activeLayer?.blendMode || "normal",
      tintColor: activeLayer?.tintColor || "#F59E0B",
      glowIntensity: activeLayer?.glowIntensity ?? 0,
      animationPreset: activeLayer?.animation.preset || "none",
      animationSpeed: activeLayer?.animation.speed ?? 1,
      animationAmplitude: activeLayer?.animation.amplitude ?? 15,
    },
    validationSchema: layerValidationSchema,
    onSubmit: (values) => {
      if (!activeLayer) return;
      updateLayer(activeLayer.id, {
        name: values.name,
        anchor: values.anchor,
        transform: {
          x: values.x,
          y: values.y,
          z: values.z,
          scaleX: values.scaleX,
          scaleY: values.uniformScale ? values.scaleX : values.scaleY,
          uniformScale: values.uniformScale,
          rotation: values.rotation,
          opacity: values.opacity / 100,
        },
        blendMode: values.blendMode,
        tintColor: values.tintColor,
        glowIntensity: values.glowIntensity,
        animation: {
          preset: values.animationPreset,
          speed: values.animationSpeed,
          amplitude: values.animationAmplitude,
        },
      });
    },
  });

  const handleFieldChange = (
    field: keyof LayerFormValues,
    val: string | number | boolean
  ) => {
    formik.setFieldValue(field, val);
    if (!activeLayer) return;

    if (field === "anchor") {
      updateLayer(activeLayer.id, { anchor: val as FaceAnchorType });
    } else if (
      field === "x" ||
      field === "y" ||
      field === "z" ||
      field === "scaleX" ||
      field === "scaleY" ||
      field === "rotation" ||
      field === "opacity"
    ) {
      updateLayer(activeLayer.id, {
        transform: {
          ...activeLayer.transform,
          x: field === "x" ? (val as number) : activeLayer.transform.x,
          y: field === "y" ? (val as number) : activeLayer.transform.y,
          z: field === "z" ? (val as number) : activeLayer.transform.z,
          scaleX: field === "scaleX" ? (val as number) : activeLayer.transform.scaleX,
          scaleY:
            field === "scaleX" && formik.values.uniformScale
              ? (val as number)
              : field === "scaleY"
              ? (val as number)
              : activeLayer.transform.scaleY,
          rotation:
            field === "rotation" ? (val as number) : activeLayer.transform.rotation,
          opacity:
            field === "opacity" ? (val as number) / 100 : activeLayer.transform.opacity,
        },
      });
    } else if (field === "blendMode") {
      updateLayer(activeLayer.id, { blendMode: val as BlendMode });
    } else if (field === "tintColor") {
      updateLayer(activeLayer.id, { tintColor: val as string });
    } else if (field === "glowIntensity") {
      updateLayer(activeLayer.id, { glowIntensity: val as number });
    } else if (
      field === "animationPreset" ||
      field === "animationSpeed" ||
      field === "animationAmplitude"
    ) {
      updateLayer(activeLayer.id, {
        animation: {
          ...activeLayer.animation,
          preset:
            field === "animationPreset"
              ? (val as AnimationPreset)
              : activeLayer.animation.preset,
          speed:
            field === "animationSpeed"
              ? (val as number)
              : activeLayer.animation.speed,
          amplitude:
            field === "animationAmplitude"
              ? (val as number)
              : activeLayer.animation.amplitude,
        },
      });
    }
  };

  const moveLayer = (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= manifest.layers.length) return;
    const newLayers = [...manifest.layers];
    const [moved] = newLayers.splice(currentIndex, 1);
    newLayers.splice(targetIndex, 0, moved);
    reorderLayers(newLayers.map((l) => l.id));
  };

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Layer Stack Card */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              Filter Layers ({manifest.layers.length})
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Order matters</span>
        </div>

        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5">
          {manifest.layers.map((layer, idx) => {
            const isSelected = layer.id === (activeLayer?.id || "");
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-foreground font-semibold"
                    : "border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <div className="h-5 w-5 rounded bg-zinc-900 border border-border/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={layer.assetUrl}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="truncate text-[11px]">{layer.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="p-1 hover:text-foreground text-muted-foreground cursor-pointer"
                    title="Toggle Visibility"
                  >
                    {layer.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    className="p-1 hover:text-foreground text-muted-foreground cursor-pointer"
                    title="Lock Layer"
                  >
                    {layer.locked ? (
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(idx, "up");
                    }}
                    className="p-1 hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="Move Layer Up"
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === manifest.layers.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(idx, "down");
                    }}
                    className="p-1 hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="Move Layer Down"
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                  {manifest.layers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
                      title="Delete Layer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Layer Properties Card (Formik + Yup) */}
      {activeLayer && (
        <form
          onSubmit={formik.handleSubmit}
          className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                Properties: {activeLayer.name}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              {activeLayer.anchor}
            </Badge>
          </div>

          {/* Face Anchor Attachment Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Face Anchor Landmark</span>
              <span className="text-[10px] text-muted-foreground">
                MediaPipe 468 Anchor
              </span>
            </Label>
            <Select
              value={formik.values.anchor}
              onValueChange={(val) =>
                handleFieldChange("anchor", val as FaceAnchorType)
              }
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Select face anchor" />
              </SelectTrigger>
              <SelectContent>
                {ANCHOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position X & Y */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Offset X
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.x}%
                </span>
              </div>
              <Slider
                value={[formik.values.x]}
                min={-100}
                max={100}
                step={1}
                onValueChange={([val]) => handleFieldChange("x", val)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Offset Y
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.y}%
                </span>
              </div>
              <Slider
                value={[formik.values.y]}
                min={-100}
                max={100}
                step={1}
                onValueChange={([val]) => handleFieldChange("y", val)}
              />
            </div>
          </div>

          {/* Scale & Rotation */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Scale
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.scaleX.toFixed(2)}x
                </span>
              </div>
              <Slider
                value={[formik.values.scaleX]}
                min={0.2}
                max={2.5}
                step={0.05}
                onValueChange={([val]) => handleFieldChange("scaleX", val)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Rotation
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.rotation}°
                </span>
              </div>
              <Slider
                value={[formik.values.rotation]}
                min={-180}
                max={180}
                step={5}
                onValueChange={([val]) => handleFieldChange("rotation", val)}
              />
            </div>
          </div>

          {/* Opacity & Blend Mode */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Opacity
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.opacity}%
                </span>
              </div>
              <Slider
                value={[formik.values.opacity]}
                min={10}
                max={100}
                step={1}
                onValueChange={([val]) => handleFieldChange("opacity", val)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-foreground">
                Blend Mode
              </Label>
              <Select
                value={formik.values.blendMode}
                onValueChange={(val) =>
                  handleFieldChange("blendMode", val as BlendMode)
                }
              >
                <SelectTrigger className="h-8 text-[11px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLEND_MODES.map((b) => (
                    <SelectItem key={b.value} value={b.value} className="text-xs">
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Motion Preset & Glow */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-foreground">
                Motion Physics
              </Label>
              <Select
                value={formik.values.animationPreset}
                onValueChange={(val) =>
                  handleFieldChange("animationPreset", val as AnimationPreset)
                }
              >
                <SelectTrigger className="h-8 text-[11px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANIMATION_PRESETS.map((a) => (
                    <SelectItem key={a.value} value={a.value} className="text-xs">
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-foreground">
                  Glow Intensity
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formik.values.glowIntensity}%
                </span>
              </div>
              <Slider
                value={[formik.values.glowIntensity]}
                min={0}
                max={100}
                step={5}
                onValueChange={([val]) => handleFieldChange("glowIntensity", val)}
              />
            </div>
          </div>
        </form>
      )}

      {/* 3. Multi-Platform Validation Card */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>SDK Compatibility Status</span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono text-emerald-600 border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20"
          >
            All Passed (100%)
          </Badge>
        </div>

        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5 text-zinc-400" />
              <span>Web SDK (Canvas / WebGL2)</span>
            </div>
            <span className="text-emerald-500 font-medium">Ready • 60 FPS</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-zinc-400" />
              <span>iOS SDK (Metal / SceneKit)</span>
            </div>
            <span className="text-emerald-500 font-medium">Ready • 60 FPS</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-zinc-400" />
              <span>Android SDK (OpenGL ES 3)</span>
            </div>
            <span className="text-emerald-500 font-medium">Ready • 60 FPS</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/40">
            <span>Asset Size Budget</span>
            <span className="font-mono text-foreground">184 KB / 2,048 KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
