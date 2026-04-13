"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EntityTheme } from "@/store/ts-types"
import { useEditEntityTheme } from "@/graphql/actions"
import { useThemeStore } from "@/store/themeStore"
import ThemePreview from "./theme-preview"
import { Loader2, Save, Palette, Layout, Type, Monitor, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppearanceSettingsProps {
  theme: EntityTheme | null
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme }) => {
  const [formSettings, setFormSettings] = useState<EntityTheme>({
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    buttonColor: "#0f172a",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    inputBackground: "#f8fafc",
    inputBorderColor: "#cbd5e1",
    fontSize: 14,
    fontWeight: "400",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    hoverEffect: "none",
    Button: {
      colorPrimary: "#0f172a",
      colorText: "#ffffff",
      colorBorder: "#0f172a",
      borderRadius: 6,
      defaultBg: "#f1f5f9",
      defaultColor: "#0f172a",
      defaultBorderColor: "#cbd5e1",
      fontSize: 13,
    },
  })

  const [activeTab, setActiveTab] = useState<"colors" | "layout" | "typography">("colors")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  useEffect(() => {
    if (theme) {
      const { __typename, Button, ...restTheme } = theme as any
      const { __typename: btnTypename, ...restButton } = (Button || {}) as any
      setFormSettings((prev) => ({
        ...prev,
        ...restTheme,
        Button: { ...prev.Button, ...restButton },
      }))
    }
  }, [theme])

  const setTheme = useThemeStore((state) => state.setTheme)
  const [update, { loading }] = useEditEntityTheme({
    onCompleted: () => {
      setTheme({
        ...formSettings,
        borderRadius: String(formSettings.borderRadius),
        borderWidth: String(formSettings.borderWidth),
        fontSize: String(formSettings.fontSize),
        Button: {
          colorPrimary: formSettings.Button?.colorPrimary ?? "#0f172a",
          colorText: formSettings.Button?.colorText ?? "#ffffff",
          colorBorder: formSettings.Button?.colorBorder ?? "#0f172a",
          borderRadius: formSettings.Button?.borderRadius ?? 6,
          defaultBg: formSettings.Button?.defaultBg ?? "#f1f5f9",
          defaultColor: formSettings.Button?.defaultColor ?? "#0f172a",
          defaultBorderColor: formSettings.Button?.defaultBorderColor ?? "#cbd5e1",
          fontSize: formSettings.Button?.fontSize ?? 13,
        },
      })
    },
  })

  const updateFormSetting = <K extends keyof EntityTheme>(key: K, value: EntityTheme[K]) => {
    setFormSettings((prev) => ({
      ...prev,
      [key]:
        typeof value === "object" && value !== null && typeof prev[key] === "object" && prev[key] !== null
          ? { ...prev[key], ...value }
          : value,
    }))
  }

  const quickPresets = [
    {
      name: "Default",
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      bg: "#ffffff",
      text: "#0f172a",
    },
    {
      name: "Slate",
      primary: "#475569",
      secondary: "#64748b",
      bg: "#f8fafc",
      text: "#0f172a",
    },
    {
      name: "Midnight",
      primary: "#0ea5e9",
      secondary: "#6366f1",
      bg: "#020617",
      text: "#f8fafc",
    },
    {
      name: "Forest",
      primary: "#059669",
      secondary: "#10b981",
      bg: "#f0fdfa",
      text: "#064e3b",
    },
  ]

  const handleSave = () => {
    update({ variables: { input: formSettings } })
  }

  const isChanged = useMemo(() => {
    if (!theme) return true
    const { __typename: t1, Button: b1, ...s1 } = formSettings as any
    const { __typename: t2, Button: b2, ...s2 } = theme as any
    return JSON.stringify(s1) !== JSON.stringify(s2) || JSON.stringify(b1) !== JSON.stringify(b2)
  }, [formSettings, theme])

  const tabs = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "typography", label: "Typography", icon: Type },
  ] as const

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start w-full max-w-[1400px] mx-auto">

      {/* ── Settings Panel ── */}
      <div className="w-full xl:w-[400px] shrink-0 flex flex-col gap-0 rounded-xl border border-border bg-card overflow-hidden">

        {/* Tab Bar */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-foreground rounded-full"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 min-h-[480px]">
          <AnimatePresence mode="wait">

            {/* ────── Colors ────── */}
            {activeTab === "colors" && (
              <motion.div
                key="colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Presets */}
                <section className="space-y-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Presets</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickPresets.map((preset) => {
                      const active = formSettings.primaryColor === preset.primary
                      return (
                        <button
                          key={preset.name}
                          onClick={() => {
                            updateFormSetting("primaryColor", preset.primary)
                            updateFormSetting("secondaryColor", preset.secondary)
                            updateFormSetting("backgroundColor", preset.bg)
                            updateFormSetting("textColor", preset.text)
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all",
                            active
                              ? "border-foreground bg-accent"
                              : "border-border hover:border-muted-foreground/40 bg-transparent"
                          )}
                        >
                          <div
                            className="h-8 w-full rounded-md"
                            style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                          />
                          <span className={cn("text-[10px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                            {preset.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                <div className="h-px bg-border" />

                {/* Color pickers */}
                <section className="space-y-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Brand Colors</p>
                  <div className="space-y-3">
                    {[
                      { label: "Primary", key: "primaryColor" as const },
                      { label: "Secondary", key: "secondaryColor" as const },
                      { label: "Background", key: "backgroundColor" as const },
                      { label: "Text", key: "textColor" as const },
                    ].map(({ label, key }) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Input
                            type="color"
                            value={formSettings[key] as string}
                            onChange={(e) => updateFormSetting(key, e.target.value)}
                            className="w-8 h-8 p-0.5 rounded-md cursor-pointer border-border"
                          />
                        </div>
                        <Input
                          type="text"
                          value={formSettings[key] as string}
                          onChange={(e) => updateFormSetting(key, e.target.value)}
                          className="h-8 text-[12px] font-mono flex-1"
                        />
                        <Label className="text-[11px] text-muted-foreground w-20 shrink-0">{label}</Label>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ────── Layout ────── */}
            {activeTab === "layout" && (
              <motion.div
                key="layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Corner Radius */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Corner Radius</Label>
                    <span className="text-[11px] font-mono text-foreground tabular-nums">{formSettings.borderRadius}px</span>
                  </div>
                  <Slider
                    min={0} max={32} step={2}
                    value={[Number(formSettings.borderRadius)]}
                    onValueChange={(v) => updateFormSetting("borderRadius", v[0])}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60">
                    <span>Sharp</span><span>Rounded</span>
                  </div>
                </section>

                {/* Stroke Weight */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Border Width</Label>
                    <span className="text-[11px] font-mono text-foreground tabular-nums">{formSettings.borderWidth}px</span>
                  </div>
                  <Slider
                    min={0} max={4} step={1}
                    value={[Number(formSettings.borderWidth)]}
                    onValueChange={(v) => updateFormSetting("borderWidth", v[0])}
                  />
                </section>

                <div className="h-px bg-border" />

                {/* Selects */}
                <section className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Border Style</Label>
                    <Select value={formSettings.borderStyle} onValueChange={(v) => updateFormSetting("borderStyle", v)}>
                      <SelectTrigger className="h-9 text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid" className="text-[12px]">Solid</SelectItem>
                        <SelectItem value="dashed" className="text-[12px]">Dashed</SelectItem>
                        <SelectItem value="dotted" className="text-[12px]">Dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Shadow</Label>
                    <Select
                      value={formSettings.boxShadow || "none"}
                      onValueChange={(v) => updateFormSetting("boxShadow", v)}
                    >
                      <SelectTrigger className="h-9 text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-[12px]">None</SelectItem>
                        <SelectItem value="0 1px 2px 0 rgba(0, 0, 0, 0.05)" className="text-[12px]">Subtle</SelectItem>
                        <SelectItem value="0 4px 12px -2px rgba(0, 0, 0, 0.12)" className="text-[12px]">Elevated</SelectItem>
                        <SelectItem value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" className="text-[12px]">Floating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </motion.div>
            )}

            {/* ────── Typography ────── */}
            {activeTab === "typography" && (
              <motion.div
                key="typography"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Font Size */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Base Font Size</Label>
                    <span className="text-[11px] font-mono text-foreground tabular-nums">{formSettings.fontSize}px</span>
                  </div>
                  <Slider
                    min={12} max={20} step={1}
                    value={[Number(formSettings.fontSize)]}
                    onValueChange={(v) => updateFormSetting("fontSize", v[0])}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60">
                    <span>Small</span><span>Large</span>
                  </div>
                </section>

                <div className="h-px bg-border" />

                <section className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Font Weight</Label>
                    <Select value={String(formSettings.fontWeight)} onValueChange={(v) => updateFormSetting("fontWeight", v)}>
                      <SelectTrigger className="h-9 text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300" className="text-[12px]">Light — 300</SelectItem>
                        <SelectItem value="400" className="text-[12px]">Regular — 400</SelectItem>
                        <SelectItem value="500" className="text-[12px]">Medium — 500</SelectItem>
                        <SelectItem value="600" className="text-[12px]">Semibold — 600</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Hover Effect</Label>
                    <Select value={formSettings.hoverEffect || "none"} onValueChange={(v) => updateFormSetting("hoverEffect", v)}>
                      <SelectTrigger className="h-9 text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-[12px]">None</SelectItem>
                        <SelectItem value="lift" className="text-[12px]">Lift</SelectItem>
                        <SelectItem value="scale" className="text-[12px]">Scale</SelectItem>
                        <SelectItem value="glow" className="text-[12px]">Glow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-muted/30">
          <div>
            {isChanged && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-amber-500 flex items-center gap-1.5"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </motion.span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={!isChanged || loading}
            size="sm"
            className="h-8 px-4 text-[12px] font-medium gap-1.5"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {loading ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {/* ── Preview Panel ── */}
      <div className="flex-1 w-full sticky top-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">

          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium ml-1">Live Preview</span>
            </div>
            <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={cn(
                  "p-1.5 rounded transition-all",
                  previewMode === "desktop"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={cn(
                  "p-1.5 rounded transition-all",
                  previewMode === "mobile"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="p-6 bg-muted/20 flex items-start justify-center min-h-[600px]">
            <motion.div
              layout
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className={cn(
                "w-full transition-all",
                previewMode === "desktop" ? "max-w-4xl" : "max-w-[375px]"
              )}
            >
              <ThemePreview theme={formSettings} />
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AppearanceSettings
