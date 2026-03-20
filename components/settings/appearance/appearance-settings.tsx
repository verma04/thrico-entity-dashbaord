"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EntityTheme } from "@/store/ts-types"
import { editEntityTheme } from "@/graphql/actions/theme"
import { useThemeStore } from "@/store/themeStore"
import ThemePreview from "./theme-preview"
import { Loader2, Save, Palette, Layers, Type, Sparkles } from "lucide-react"
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
  const [update, { loading }] = editEntityTheme({
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
      name: "Modern SaaS",
      colors: {
        primaryColor: "#0f172a",
        secondaryColor: "#334155",
        backgroundColor: "#ffffff",
        textColor: "#020617",
      },
    },
    {
      name: "Mint Enterprise",
      colors: {
        primaryColor: "#059669",
        secondaryColor: "#34d399",
        backgroundColor: "#f0fdf4",
        textColor: "#064e3b",
      },
    },
    {
      name: "Ocean Tech",
      colors: {
        primaryColor: "#2563eb",
        secondaryColor: "#60a5fa",
        backgroundColor: "#eff6ff",
        textColor: "#1e3a8a",
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

  const isChanged = JSON.stringify(formSettings) !== JSON.stringify(theme)

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* Settings Panel */}
      <div className="w-full xl:w-1/2 flex flex-col gap-6">
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Header & Tabs */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50">
              <button
                onClick={() => setActiveTab("colors")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                  activeTab === "colors"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Palette className="h-3.5 w-3.5" />
                Colors
              </button>
              <button
                onClick={() => setActiveTab("layout")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                  activeTab === "layout"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                Layout
              </button>
              <button
                onClick={() => setActiveTab("typography")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                  activeTab === "typography"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Type className="h-3.5 w-3.5" />
                Typography
              </button>
            </div>

            <Button
              onClick={handleSave}
              disabled={!isChanged || loading}
              className="h-8 px-4 text-[12px] font-semibold bg-slate-900 hover:bg-black text-white gap-2 shadow-sm shrink-0 transition-opacity"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {loading ? "Saving..." : isChanged ? "Save Changes" : "Saved"}
            </Button>
          </div>

          <div className="p-6">
            {activeTab === "colors" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Presets */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-slate-400" />
                    <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Theme Presets</h3>
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
                        className="group flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white transition-all duration-200 relative overflow-hidden"
                      >
                        <div
                          className="h-8 w-full rounded-md shadow-inner mb-2 border border-black/5"
                          style={{
                            background: `linear-gradient(135deg, ${preset.colors.primaryColor} 0%, ${preset.colors.secondaryColor} 100%)`,
                          }}
                        />
                        <span className="text-[11px] font-semibold text-slate-700">{preset.name}</span>
                        {/* Selector ring */}
                        <div className={cn(
                          "absolute inset-0 border-2 rounded-xl transition-opacity pointer-events-none",
                          formSettings.primaryColor === preset.colors.primaryColor ? "border-slate-900 opacity-100" : "border-transparent opacity-0"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="space-y-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Global Tokens</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.primaryColor}
                          onChange={(e) => updateFormSetting("primaryColor", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.primaryColor} 
                          onChange={(e) => updateFormSetting("primaryColor", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.secondaryColor}
                          onChange={(e) => updateFormSetting("secondaryColor", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.secondaryColor} 
                          onChange={(e) => updateFormSetting("secondaryColor", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Canvas Background</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.backgroundColor}
                          onChange={(e) => updateFormSetting("backgroundColor", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.backgroundColor} 
                          onChange={(e) => updateFormSetting("backgroundColor", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Primary Text</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.textColor}
                          onChange={(e) => updateFormSetting("textColor", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.textColor} 
                          onChange={(e) => updateFormSetting("textColor", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="space-y-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Form & Inputs</h3>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Input Background</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.inputBackground}
                          onChange={(e) => updateFormSetting("inputBackground", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.inputBackground} 
                          onChange={(e) => updateFormSetting("inputBackground", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Border Color (Default)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={formSettings.borderColor}
                          onChange={(e) => updateFormSetting("borderColor", e.target.value)}
                          className="w-10 h-10 p-1 border-slate-200 rounded-lg cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formSettings.borderColor} 
                          onChange={(e) => updateFormSetting("borderColor", e.target.value)}
                          className="h-10 text-[12px] font-mono border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12px] font-semibold text-slate-700">Border Radius (Buttons & Cards)</Label>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{formSettings.borderRadius}px</span>
                    </div>
                    <Slider
                      min={0}
                      max={24}
                      step={2}
                      value={[Number(formSettings.borderRadius)]}
                      onValueChange={(value) => updateFormSetting("borderRadius", value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-[10px] uppercase font-semibold text-slate-400">
                      <span>Sharp</span>
                      <span>Rounded</span>
                      <span>Pill</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12px] font-semibold text-slate-700">Border Width</Label>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{formSettings.borderWidth}px</span>
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

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Border Style</Label>
                      <Select
                        value={formSettings.borderStyle}
                        onValueChange={(value) => updateFormSetting("borderStyle", value)}
                      >
                        <SelectTrigger className="h-10 text-[12px] border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid" className="text-[12px]">Solid</SelectItem>
                          <SelectItem value="dashed" className="text-[12px]">Dashed</SelectItem>
                          <SelectItem value="dotted" className="text-[12px]">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Global Box Shadow</Label>
                      <Select
                        value={formSettings.boxShadow || "none"}
                        onValueChange={(value) => updateFormSetting("boxShadow", value)}
                      >
                        <SelectTrigger className="h-10 text-[12px] border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-[12px]">Flat (None)</SelectItem>
                          <SelectItem value="0 1px 2px 0 rgba(0, 0, 0, 0.05)" className="text-[12px]">Subtle</SelectItem>
                          <SelectItem value="0 4px 6px -1px rgba(0, 0, 0, 0.1)" className="text-[12px]">Medium Drop</SelectItem>
                          <SelectItem value="0 10px 15px -3px rgba(0, 0, 0, 0.1)" className="text-[12px]">Elevated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12px] font-semibold text-slate-700">Base Font Size</Label>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{formSettings.fontSize}px</span>
                    </div>
                    <Slider
                      min={12}
                      max={18}
                      step={1}
                      value={[Number(formSettings.fontSize)]}
                      onValueChange={(value) => updateFormSetting("fontSize", value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-[10px] uppercase font-semibold text-slate-400 mt-1">
                      <span>Small</span>
                      <span>Default</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Base Font Weight</Label>
                      <Select
                        value={String(formSettings.fontWeight)}
                        onValueChange={(value) => updateFormSetting("fontWeight", value)}
                      >
                        <SelectTrigger className="h-10 text-[12px] border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400" className="text-[12px]">Regular (400)</SelectItem>
                          <SelectItem value="500" className="text-[12px]">Medium (500)</SelectItem>
                          <SelectItem value="600" className="text-[12px]">Semibold (600)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[12px] font-semibold text-slate-700">Interaction Effect</Label>
                      <Select
                        value={formSettings.hoverEffect || "none"}
                        onValueChange={(value) => updateFormSetting("hoverEffect", value)}
                      >
                        <SelectTrigger className="h-10 text-[12px] border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-[12px]">Static (None)</SelectItem>
                          <SelectItem value="lift" className="text-[12px]">Lift (Translate Y)</SelectItem>
                          <SelectItem value="scale" className="text-[12px]">Scale Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel Widget */}
      <div className="w-full xl:w-1/2 sticky top-6">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
           <div className="px-5 py-4 border-b border-slate-100 bg-white">
             <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Live Component Preview</h3>
             <p className="text-[11px] text-slate-500 mt-0.5">Test real interactions based on your current tokens.</p>
           </div>
           {/* Preview Container inner wrapper to isolate styling cleanly */}
           <div className="p-6 flex-1 flex flex-col relative w-full overflow-hidden">
               <div className="absolute inset-0 bg-slate-100/40 pattern-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0" />
               <div className="relative z-10 w-full h-full">
                  <ThemePreview theme={formSettings} />
               </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceSettings
