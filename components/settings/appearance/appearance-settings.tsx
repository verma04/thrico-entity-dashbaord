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
import { 
  Loader2, 
  Save, 
  Palette, 
  Layers, 
  Type, 
  Sparkles, 
  Eye, 
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Layout
} from "lucide-react"
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
        Button: {
          ...prev.Button,
          ...restButton,
        },
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

  const quickThemes = [
    {
      name: "Midnight",
      colors: {
        primaryColor: "#0ea5e9",
        secondaryColor: "#6366f1",
        backgroundColor: "#020617",
        textColor: "#f8fafc",
      },
    },
    {
      name: "Editorial",
      colors: {
        primaryColor: "#000000",
        secondaryColor: "#4b5563",
        backgroundColor: "#ffffff",
        textColor: "#111827",
      },
    },
    {
      name: "Oceanic",
      colors: {
        primaryColor: "#059669",
        secondaryColor: "#10b981",
        backgroundColor: "#f0fdfa",
        textColor: "#064e3b",
      },
    },
  ]

  const handleSave = () => {
    update({
      variables: {
        input: formSettings,
      },
    })
  }

  const isChanged = useMemo(() => {
    if (!theme) return true
    const { __typename: t1, Button: b1, ...s1 } = formSettings as any
    const { __typename: t2, Button: b2, ...s2 } = theme as any
    return JSON.stringify(s1) !== JSON.stringify(s2) || JSON.stringify(b1) !== JSON.stringify(b2)
  }, [formSettings, theme])

  const tabs = [
    { id: "colors", label: "Branding", icon: Palette },
    { id: "layout", label: "Geometry", icon: Layout },
    { id: "typography", label: "Text Styles", icon: Type },
  ] as const

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start relative max-w-[1600px] mx-auto w-full">
      {/* Settings Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full xl:w-[450px] flex flex-col gap-6 shrink-0"
      >
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col">
          {/* Header & Tabs */}
          <div className="p-1 border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-1 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 relative",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background border border-border shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon className={cn("h-3.5 w-3.5 relative z-10", activeTab === tab.id ? "text-primary" : "")} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "colors" && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  {/* Presets */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <h3 className="text-[13px] font-semibold uppercase tracking-wider">Presets</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {quickThemes.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            updateFormSetting("primaryColor", preset.colors.primaryColor)
                            updateFormSetting("secondaryColor", preset.colors.secondaryColor)
                            updateFormSetting("backgroundColor", preset.colors.backgroundColor)
                            updateFormSetting("textColor", preset.colors.textColor)
                          }}
                          className={cn(
                            "group flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                            formSettings.primaryColor === preset.colors.primaryColor 
                              ? "border-primary bg-primary/5 shadow-inner" 
                              : "border-border bg-muted/20 hover:border-muted-foreground/30"
                          )}
                        >
                          <div
                            className="h-10 w-full rounded-xl shadow-lg mb-2 border border-black/10"
                            style={{
                              background: `linear-gradient(135deg, ${preset.colors.primaryColor} 0%, ${preset.colors.secondaryColor} 100%)`,
                            }}
                          />
                          <span className={cn(
                            "text-[10px] font-bold tracking-tight uppercase",
                            formSettings.primaryColor === preset.colors.primaryColor ? "text-primary" : "text-muted-foreground"
                          )}>
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-muted-foreground pt-4 border-t border-border/60">
                      <Palette className="h-4 w-4" />
                      <h3 className="text-[13px] font-semibold uppercase tracking-wider">Brand Palette</h3>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <Label className="text-[11px] font-bold text-muted-foreground uppercase">Primary</Label>
                          <div className="flex gap-2">
                            <div className="relative group shrink-0">
                                <Input
                                  type="color"
                                  value={formSettings.primaryColor}
                                  onChange={(e) => updateFormSetting("primaryColor", e.target.value)}
                                  className="w-11 h-11 p-1 rounded-xl cursor-pointer border-border ring-offset-background transition-transform group-hover:scale-105"
                                />
                            </div>
                            <Input 
                              type="text" 
                              value={formSettings.primaryColor} 
                              onChange={(e) => updateFormSetting("primaryColor", e.target.value)}
                              className="h-11 text-[12px] font-mono bg-muted/30 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <Label className="text-[11px] font-bold text-muted-foreground uppercase">Secondary</Label>
                          <div className="flex gap-2">
                            <div className="relative group shrink-0">
                                <Input
                                  type="color"
                                  value={formSettings.secondaryColor}
                                  onChange={(e) => updateFormSetting("secondaryColor", e.target.value)}
                                  className="w-11 h-11 p-1 rounded-xl cursor-pointer border-border transition-transform group-hover:scale-105"
                                />
                            </div>
                            <Input 
                              type="text" 
                              value={formSettings.secondaryColor} 
                              onChange={(e) => updateFormSetting("secondaryColor", e.target.value)}
                              className="h-11 text-[12px] font-mono bg-muted/30 border-border rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <Label className="text-[11px] font-bold text-muted-foreground uppercase">Canvas</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={formSettings.backgroundColor}
                              onChange={(e) => updateFormSetting("backgroundColor", e.target.value)}
                              className="w-11 h-11 p-1 rounded-xl cursor-pointer border-border"
                            />
                            <Input 
                              type="text" 
                              value={formSettings.backgroundColor} 
                              onChange={(e) => updateFormSetting("backgroundColor", e.target.value)}
                              className="h-11 text-[12px] font-mono bg-muted/30 border-border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <Label className="text-[11px] font-bold text-muted-foreground uppercase">Text</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={formSettings.textColor}
                              onChange={(e) => updateFormSetting("textColor", e.target.value)}
                              className="w-11 h-11 p-1 rounded-xl cursor-pointer border-border"
                            />
                            <Input 
                              type="text" 
                              value={formSettings.textColor} 
                              onChange={(e) => updateFormSetting("textColor", e.target.value)}
                              className="h-11 text-[12px] font-mono bg-muted/30 border-border rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "layout" && (
                <motion.div
                  key="layout"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Corner Radius</Label>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{formSettings.borderRadius}px</span>
                      </div>
                      <Slider
                        min={0}
                        max={32}
                        step={2}
                        value={[Number(formSettings.borderRadius)]}
                        onValueChange={(value) => updateFormSetting("borderRadius", value[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50 uppercase">
                        <span>Sharp</span>
                        <span>Balanced</span>
                        <span>Organic</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Stroke Weight</Label>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{formSettings.borderWidth}px</span>
                      </div>
                      <Slider
                        min={0}
                        max={4}
                        step={1}
                        value={[Number(formSettings.borderWidth)]}
                        onValueChange={(value) => updateFormSetting("borderWidth", value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/60">
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Border Style</Label>
                        <Select
                          value={formSettings.borderStyle}
                          onValueChange={(value) => updateFormSetting("borderStyle", value)}
                        >
                          <SelectTrigger className="h-11 text-[12px] rounded-xl border-border bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="solid" className="text-[12px]">Solid</SelectItem>
                            <SelectItem value="dashed" className="text-[12px]">Dashed</SelectItem>
                            <SelectItem value="dotted" className="text-[12px]">Dotted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Elevation</Label>
                        <Select
                          value={formSettings.boxShadow || "none"}
                          onValueChange={(value) => updateFormSetting("boxShadow", value)}
                        >
                          <SelectTrigger className="h-11 text-[12px] rounded-xl border-border bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="none" className="text-[12px]">Flat</SelectItem>
                            <SelectItem value="0 1px 2px 0 rgba(0, 0, 0, 0.05)" className="text-[12px]">Subtle</SelectItem>
                            <SelectItem value="0 4px 12px -2px rgba(0, 0, 0, 0.12)" className="text-[12px]">Floating</SelectItem>
                            <SelectItem value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" className="text-[12px]">High Impact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "typography" && (
                <motion.div
                  key="typography"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Base Font Size</Label>
                        <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{formSettings.fontSize}px</span>
                      </div>
                      <Slider
                        min={12}
                        max={20}
                        step={1}
                        value={[Number(formSettings.fontSize)]}
                        onValueChange={(value) => updateFormSetting("fontSize", value[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50 uppercase">
                        <span>Compact</span>
                        <span>Comfortable</span>
                        <span>Large</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/60">
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Weight</Label>
                        <Select
                          value={String(formSettings.fontWeight)}
                          onValueChange={(value) => updateFormSetting("fontWeight", value)}
                        >
                          <SelectTrigger className="h-11 text-[12px] rounded-xl border-border bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="300" className="text-[12px]">Light (300)</SelectItem>
                            <SelectItem value="400" className="text-[12px]">Regular (400)</SelectItem>
                            <SelectItem value="500" className="text-[12px]">Medium (500)</SelectItem>
                            <SelectItem value="600" className="text-[12px]">Semibold (600)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">Hover Animation</Label>
                        <Select
                          value={formSettings.hoverEffect || "none"}
                          onValueChange={(value) => updateFormSetting("hoverEffect", value)}
                        >
                          <SelectTrigger className="h-11 text-[12px] rounded-xl border-border bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="none" className="text-[12px]">Static</SelectItem>
                            <SelectItem value="lift" className="text-[12px]">Subtle Lift</SelectItem>
                            <SelectItem value="scale" className="text-[12px]">Eased Scale</SelectItem>
                            <SelectItem value="glow" className="text-[12px]">Outer Glow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Save Button */}
          <div className="p-4 bg-muted/50 border-t border-border/60 flex items-center justify-between gap-4">
              <div className="flex-1">
                {isChanged && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Unsaved Progress
                  </motion.p>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={!isChanged || loading}
                className={cn(
                  "h-11 px-8 rounded-2xl text-[13px] font-bold transition-all duration-300 shadow-lg active:scale-95 flex items-center gap-2",
                  isChanged 
                    ? "bg-primary text-primary-foreground hover:shadow-primary/20" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {loading ? "Synchronizing..." : "Commit Changes"}
              </Button>
          </div>
        </div>
      </motion.div>

      {/* Preview Panel Widget */}
      <div className="flex-1 w-full sticky top-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2.5rem] border-8 border-border bg-muted/30 shadow-2xl overflow-hidden flex flex-col h-full min-h-[650px] relative group"
        >
           {/* Device Frame Browser Controls */}
           <div className="px-8 py-5 border-b border-border/60 bg-background/80 backdrop-blur-md flex items-center justify-between relative z-20">
             <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/20 border border-red-400/40" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/20 border border-yellow-400/40" />
                  <div className="h-3 w-3 rounded-full bg-green-400/20 border border-green-400/40" />
                </div>
                <div className="h-6 w-px bg-border/60" />
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-bold text-foreground tracking-tight">Stage Environment</h3>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Real-time Rendering</span>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl border border-border">
                <button 
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    previewMode === "desktop" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    previewMode === "mobile" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Layout className="h-4 w-4" />
                </button>
             </div>
           </div>

           {/* Preview Container */}
           <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background to-muted/20">
               {/* Grid Pattern Overlay */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none"
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
               
               <motion.div 
                 layout
                 className={cn(
                   "relative z-10 transition-all duration-500 ease-in-out",
                   previewMode === "desktop" ? "w-full max-w-4xl" : "w-[375px]"
                 )}
               >
                  <div className="premium-shadow">
                    <ThemePreview theme={formSettings} />
                  </div>
               </motion.div>

               {/* Hint */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/40 font-semibold text-[10px] uppercase tracking-[0.2em] pointer-events-none">
                  Interact with the preview above <ChevronRight className="h-2 w-2" />
               </div>
           </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AppearanceSettings

