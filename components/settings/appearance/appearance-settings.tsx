"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { EntityTheme } from "@/store/ts-types"
import { editEntityTheme } from "@/graphql/actions/theme"
import { useThemeStore } from "@/store/themeStore"
import ThemePreview from "./theme-preview"

interface AppearanceSettingsProps {
  theme: EntityTheme | null
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme }) => {
  const [formSettings, setFormSettings] = useState<EntityTheme>({
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    buttonColor: "#3b82f6",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    inputBackground: "#ffffff",
    inputBorderColor: "#cbd5e1",
    fontSize: 14,
    fontWeight: "400",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    hoverEffect: "none",
    Button: {
      colorPrimary: "#3b82f6",
      colorText: "#ffffff",
      colorBorder: "#3b82f6",
      borderRadius: 6,
      defaultBg: "#f1f5f9",
      defaultColor: "#0f172a",
      defaultBorderColor: "#cbd5e1",
      fontSize: 14,
    },
  })

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
          colorPrimary: formSettings.Button?.colorPrimary ?? "#3b82f6",
          colorText: formSettings.Button?.colorText ?? "#ffffff",
          colorBorder: formSettings.Button?.colorBorder ?? "#3b82f6",
          borderRadius: formSettings.Button?.borderRadius ?? 6,
          defaultBg: formSettings.Button?.defaultBg ?? "#f1f5f9",
          defaultColor: formSettings.Button?.defaultColor ?? "#0f172a",
          defaultBorderColor: formSettings.Button?.defaultBorderColor ?? "#cbd5e1",
          fontSize: formSettings.Button?.fontSize ?? 14,
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
      name: "Default",
      colors: {
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        backgroundColor: "#f8fafc",
        textColor: "#1e293b",
      },
    },
    {
      name: "Nature",
      colors: {
        primaryColor: "#10b981",
        secondaryColor: "#14b8a6",
        backgroundColor: "#f0fdf4",
        textColor: "#065f46",
      },
    },
    {
      name: "Sunset",
      colors: {
        primaryColor: "#f97316",
        secondaryColor: "#ec4899",
        backgroundColor: "#fef2f2",
        textColor: "#7c2d12",
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
    <div className="grid grid-cols-2 gap-6">
      {/* Settings Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Theme Customization</CardTitle>
              <Button onClick={handleSave} disabled={!isChanged} loading={loading}>
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Quick Themes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {quickThemes.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateFormSetting("primaryColor", preset.colors.primaryColor)
                          updateFormSetting("secondaryColor", preset.colors.secondaryColor)
                          updateFormSetting("backgroundColor", preset.colors.backgroundColor)
                          updateFormSetting("textColor", preset.colors.textColor)
                        }}
                        className="h-12 rounded-lg border-2 transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${preset.colors.primaryColor} 0%, ${preset.colors.secondaryColor} 100%)`,
                          borderColor:
                            formSettings.primaryColor === preset.colors.primaryColor ? "#000" : "transparent",
                        }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={formSettings.primaryColor}
                      onChange={(e) => updateFormSetting("primaryColor", e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>

                  <div>
                    <Label>Secondary Color</Label>
                    <Input
                      type="color"
                      value={formSettings.secondaryColor}
                      onChange={(e) => updateFormSetting("secondaryColor", e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={formSettings.backgroundColor}
                        onChange={(e) => updateFormSetting("backgroundColor", e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={formSettings.textColor}
                        onChange={(e) => updateFormSetting("textColor", e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Input Background</Label>
                      <Input
                        type="color"
                        value={formSettings.inputBackground}
                        onChange={(e) => updateFormSetting("inputBackground", e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                    <div>
                      <Label>Border Color</Label>
                      <Input
                        type="color"
                        value={formSettings.borderColor}
                        onChange={(e) => updateFormSetting("borderColor", e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-6 mt-6">
                <div>
                  <Label className="mb-2 block">Border Radius: {formSettings.borderRadius}px</Label>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={[formSettings.borderRadius]}
                    onValueChange={(value) => updateFormSetting("borderRadius", value[0])}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Border Width: {formSettings.borderWidth}px</Label>
                  <Slider
                    min={0}
                    max={4}
                    step={0.5}
                    value={[formSettings.borderWidth]}
                    onValueChange={(value) => updateFormSetting("borderWidth", value[0])}
                  />
                </div>

                <div>
                  <Label>Border Style</Label>
                  <Select
                    value={formSettings.borderStyle}
                    onValueChange={(value) => updateFormSetting("borderStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Box Shadow</Label>
                  <Select
                    value={formSettings.boxShadow || "none"}
                    onValueChange={(value) => updateFormSetting("boxShadow", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="0 1px 2px 0 rgba(0, 0, 0, 0.05)">Light</SelectItem>
                      <SelectItem value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</SelectItem>
                      <SelectItem value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6 mt-6">
                <div>
                  <Label className="mb-2 block">Font Size: {formSettings.fontSize}px</Label>
                  <Slider
                    min={12}
                    max={20}
                    step={1}
                    value={[formSettings.fontSize]}
                    onValueChange={(value) => updateFormSetting("fontSize", value[0])}
                  />
                </div>

                <div>
                  <Label>Font Weight</Label>
                  <Select
                    value={String(formSettings.fontWeight)}
                    onValueChange={(value) => updateFormSetting("fontWeight", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hover Effect</Label>
                  <Select
                    value={formSettings.hoverEffect || "none"}
                    onValueChange={(value) => updateFormSetting("hoverEffect", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="lift">Lift</SelectItem>
                      <SelectItem value="glow">Glow</SelectItem>
                      <SelectItem value="scale">Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div>
        <h3 className="font-semibold mb-4">Live Preview</h3>
        <ThemePreview theme={formSettings} />
      </div>
    </div>
  )
}

export default AppearanceSettings
